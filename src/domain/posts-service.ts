import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {outputPostsWithPaginatorType, postDBType, queryPostParams} from "../projectTypes";
import {PostsRepositoryInDB} from "../repositories/posts-repository";


export class PostsService {
    constructor(protected postsRepositoryInDB: PostsRepositoryInDB) {}
    async findAllPosts(queryParams: queryPostParams, blogId?: string): Promise<outputPostsWithPaginatorType>{
        return this.postsRepositoryInDB.findAllPosts(queryPostParamsPaginator(queryParams), blogId);
    }
    async findPostByID(id: string): Promise<postDBType | null> {
        return this.postsRepositoryInDB.findPostByID(id)
    }
    async deletePostByID(id: string): Promise<boolean>{
        return this.postsRepositoryInDB.deletePostByID(id)
    }
    async createPost(data: postDBType): Promise<postDBType | null >{

        const foundBlog = await blogsRepositoryInDB.findBlogByID(data.blogId)

        if(!foundBlog){
            return null
        }
        const newPost: postDBType = {
            id: String(+new Date()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName:  String(foundBlog.name),
            createdAt: new Date().toISOString()
        }
        const createdPost: postDBType = await this.postsRepositoryInDB.createPost(newPost)

        return createdPost
    }
    async updatePostByID(id: string, body: postDBType): Promise<boolean>{
        return this.postsRepositoryInDB.updatePostByID(id, body)
    }
    async deleteAllPosts(): Promise<boolean>{
        return this.postsRepositoryInDB.deleteAllPosts()
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