import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {blogType, outputBlogType, postType, queryBlogParams} from "../projectTypes";
import {postsService} from "./posts-service";

export const blogsService = {
    async findAllBlogs(queryParams: queryBlogParams): Promise<outputBlogType>{
        return blogsRepositoryInDB.findAllBlogs(queryBlogParamsPaginator(queryParams));
    },
    async findBlogByID(id: string): Promise<blogType | null>{
        return blogsRepositoryInDB.findBlogByID(id)
    },
    async deleteBlogByID(id: string): Promise<boolean>{
        return blogsRepositoryInDB.deleteBlogByID(id)
    },
    async createBlog(data: blogType): Promise<blogType>{
        const newBlog: blogType = {
            id: String(+new Date()),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: new Date().toISOString()
        }
        const createdBlog: blogType = await blogsRepositoryInDB.createBlog(newBlog)
        return createdBlog
    },
    async createPostByBlogID(id: string, data: postType): Promise<postType | null>{
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
        searchNameTerm: typeof queryParams.searchNameTerm === "string" ? queryParams.searchNameTerm : null,
        pageNumber: typeof queryParams.pageNumber === "string" ? +queryParams.pageNumber : 1,
        pageSize: typeof queryParams.pageSize === "string" ? +queryParams.pageSize : 10,
        sortBy: typeof queryParams.sortBy === "string" ? queryParams.sortBy : 'createdAt',
        sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc'
    }
}