import {blogsCollection} from "./db";
import {blogType, outputBlogType, queryBlogParams} from "../projectTypes";

export const blogsRepositoryInDB = {
    async findAllBlogs(paginator: queryBlogParams): Promise<outputBlogType>{
        let filter = {}
        if(paginator.searchNameTerm){
            filter = {name: { $regex: paginator.searchNameTerm}}
        }
        const foundBlogsInDB = await blogsCollection.find(filter, {projection:{_id:0}}).toArray();
        const outputBlogs: outputBlogType = {
            pagesCount: 0,
            page: 0,
            pageSize: 0,
            totalCount: 0,
            items: [
                {
                    id: "string",
                    name: "string",
                    youtubeUrl: "string",
                    createdAt: "2022-11-06T14:17:28.774Z"
                }
            ]
        }
        return outputBlogs
    },
    async findBlogByID(id: string): Promise<blogType | null>{
        const blog = await blogsCollection.findOne({id: id})
        if(blog){
            return {
                id: blog.id,
                name : blog.name,
                youtubeUrl: blog.youtubeUrl,
                createdAt: blog.createdAt,
            }
        }
        return null
    },
    async deleteBlogByID(id: string): Promise<boolean>{
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async createBlog(data: blogType): Promise<blogType>{
        const newBlog: blogType = {
            id: String(+new Date()),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: new Date().toISOString()
        }
        const newObjectBlog: blogType = Object.assign({}, newBlog);
        await blogsCollection.insertOne(newBlog)

        return newObjectBlog
    },
    async updateBlogByID(id: string, body: blogType): Promise<boolean>{
        const result = await blogsCollection.updateOne({id: id}, {$set: {
            name: body.name,
            youtubeUrl: body.youtubeUrl}})
        return result.matchedCount === 1
    },
    async deleteAllBlogs(): Promise<boolean>{
        const result = await blogsCollection.deleteMany({})
        return !!result.deletedCount
    }
}