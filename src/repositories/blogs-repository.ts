import {blogsCollection, blogType} from "./db";

export const blogsRepository = {
    async findAllBlogs(): Promise<blogType[]>{
        return blogsCollection.find({}, {projection:{_id:0}}).toArray();
    },
    async findBlogByID(id: string): Promise<blogType | null | void>{
        const blog = await blogsCollection.findOne({id: id})
        return {
            id: blog?.id || "",
            name : blog?.name || "",
            youtubeUrl: blog?.youtubeUrl || "",
            createdAt: blog?.createdAt || "",
        }
    },
    async deleteBlogByID(id: string): Promise<boolean>{
        const result = await blogsCollection.deleteOne({id: id})
        const blog = await this.findBlogByID(id);
        return !!blog
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