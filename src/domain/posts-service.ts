import {postsRepositoryInDB} from "../repositories/posts-repository";
import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {outputPostsWithPaginatorType, postType, queryPostParams} from "../projectTypes";


export const postsService = {
    async findAllPosts(queryParams: queryPostParams, blogId?: string): Promise<outputPostsWithPaginatorType>{
        return postsRepositoryInDB.findAllPosts(queryPostParamsPaginator(queryParams), blogId);
    },
    async findPostByID(id: string): Promise<postType | null> {
        return postsRepositoryInDB.findPostByID(id)
    },
    async deletePostByID(id: string): Promise<boolean>{
        return postsRepositoryInDB.deletePostByID(id)
    },
    async createPost(data: postType): Promise<postType | null >{

        const foundBlog = await blogsRepositoryInDB.findBlogByID(data.blogId)

        if(!foundBlog){
            return null
        }
        const newPost: postType = {
            id: String(+new Date()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName:  String(foundBlog.name),
            createdAt: new Date().toISOString()
        }
        const createdPost: postType = await postsRepositoryInDB.createPost(newPost)

        return createdPost
    },
    async updatePostByID(id: string, body: postType): Promise<boolean>{
        return postsRepositoryInDB.updatePostByID(id, body)
    },
    async deleteAllPosts(): Promise<boolean>{
        return postsRepositoryInDB.deleteAllPosts()
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