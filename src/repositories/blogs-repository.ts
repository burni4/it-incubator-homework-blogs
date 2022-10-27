import {blogsCollection, blogType} from "./db";

export const blogsRepository = {
    async findAllBlogs(): Promise<blogType[]>{
        return blogsCollection.find({}).toArray();
    },
    async findBlogByID(id: string): Promise<blogType | null | void>{
        return await blogsCollection.findOne({id: id})
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
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog
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