import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {blogType, outputBlogsWithPaginatorType, outputPostsWithPaginatorType, postType, queryBlogParams, queryPostParams} from "../projectTypes";
import {postsService, queryPostParamsPaginator} from "./posts-service";

export const blogsService = {
    async findAllBlogs(queryParams: queryBlogParams): Promise<outputBlogsWithPaginatorType>{
        return blogsRepositoryInDB.findAllBlogs(queryBlogParamsPaginator(queryParams));
    },
    async findAllPostsByBlogID(id: string, queryParams: queryPostParams): Promise<outputPostsWithPaginatorType | null>{

        const foundBlog = await blogsRepositoryInDB.findBlogByID(id)

        if(!foundBlog){
            return null
        }

        return postsService.findAllPosts(queryPostParamsPaginator(queryParams), id);
    },
    async findBlogByID(id: string): Promise<blogType | null>{
        return await blogsRepositoryInDB.findBlogByID(id)
    },
    async deleteBlogByID(id: string): Promise<boolean>{
        return await blogsRepositoryInDB.deleteBlogByID(id)
    },
    async createBlog(data: blogType): Promise<blogType>{
        const newBlog: blogType = {
            id: String(+new Date()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString()
        }
        const createdBlog: blogType = await blogsRepositoryInDB.createBlog(newBlog)
        return createdBlog
    },
    async createPostByBlogID(id: string, data: postType): Promise<postType | null>{

        const foundBlog = await blogsRepositoryInDB.findBlogByID(id)

        if(!foundBlog){
          return null
        }
        data.blogId = id

        return await postsService.createPost(data)
    },
    async updateBlogByID(id: string, body: blogType): Promise<boolean>{
        return blogsRepositoryInDB.updateBlogByID(id, body)
    },
    async deleteAllBlogs(): Promise<boolean>{
        return blogsRepositoryInDB.deleteAllBlogs()
    }
}
const queryBlogParamsPaginator = (queryParams: queryBlogParams):queryBlogParams => {
    return {
        searchNameTerm: queryParams.searchNameTerm || null,
        pageNumber: +queryParams.pageNumber || 1,
        pageSize: +queryParams.pageSize || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc'
    }
}