import {blogType} from "../repositories/db";
import {blogsRepositoryInDB} from "../repositories/blogs-repository";

export const blogsService = {
    async findAllBlogs(): Promise<blogType[]>{
        return blogsRepositoryInDB.findAllBlogs();
    },
    async findBlogByID(id: string): Promise<blogType | null | void>{
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