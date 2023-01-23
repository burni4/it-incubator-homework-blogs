import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {
    LikeStatus, NewestLikesType,
    outputPostsWithPaginatorType,
    PostDBType,
    PostDBTypeOutputType,
    queryPostParams, userOutputType
} from "../projectTypes";
import {PostsRepositoryInDB} from "../repositories/posts-repository";
import {inject, injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepositoryInDB) protected postsRepositoryInDB: PostsRepositoryInDB) {}
    async findAllPosts(queryParams: queryPostParams, blogId?: string, user?: userOutputType): Promise<outputPostsWithPaginatorType>{
        return this.postsRepositoryInDB.findAllPosts(queryPostParamsPaginator(queryParams), blogId, user);
    }
    async findPostByID(id: string, user?: userOutputType): Promise<PostDBTypeOutputType | null> {
        return this.postsRepositoryInDB.findPostByID(id, user)
    }
    async deletePostByID(id: string): Promise<boolean>{
        return this.postsRepositoryInDB.deletePostByID(id)
    }
    async createPost(data: PostDBTypeOutputType): Promise<PostDBTypeOutputType | null >{

        const foundBlog = await blogsRepositoryInDB.findBlogByID(data.blogId)

        if(!foundBlog){
            return null
        }
        const newPost: PostDBType = {
            id: String(+new Date()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName:  String(foundBlog.name),
            createdAt: new Date().toISOString(),
            likedUsers: [],
            dislikedUsers: []
        }
        const createdPost: PostDBTypeOutputType = await this.postsRepositoryInDB.createPost(newPost)

        return createdPost
    }
    async updatePostByID(id: string, body: PostDBTypeOutputType): Promise<boolean>{
        return this.postsRepositoryInDB.updatePostByID(id, body)
    }
    async deleteAllPosts(): Promise<boolean>{
        return this.postsRepositoryInDB.deleteAllPosts()
    }
    async setLikeStatus(likeStatus: LikeStatus, postId: string, user: userOutputType): Promise<boolean>{

        if (likeStatus === LikeStatus.Like) {
            return await this.postsRepositoryInDB.likeTheComment(user, postId)
        }

        if (likeStatus === LikeStatus.Dislike) {
            return await this.postsRepositoryInDB.dislikeTheComment(user, postId)
        }

        return await this.postsRepositoryInDB.removeLikeAndDislike(user, postId)
    }
}

export const queryPostParamsPaginator = (queryParams: queryPostParams):queryPostParams => {
    return {
        pageNumber: +queryParams.pageNumber || 1,
        pageSize: +queryParams.pageSize || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc'
    }
}