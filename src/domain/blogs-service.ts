import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {blogType, queryBlogParams} from "../projectTypes";

export const blogsService = {
    async findAllBlogs(queryParams: queryBlogParams): Promise<blogType[]>{
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