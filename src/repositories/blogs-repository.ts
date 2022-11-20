import {blogsCollection} from "./db";
import {blogType, outputBlogsWithPaginatorType, queryBlogParams} from "../projectTypes";

export const blogsRepositoryInDB = {
    async findAllBlogs(paginator: queryBlogParams): Promise<outputBlogsWithPaginatorType>{
        let filter = {}
        if(paginator.searchNameTerm){
            filter = {name: { $regex: paginator.searchNameTerm, $options: "i" }}
        }
        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundBlogsInDB = await blogsCollection.find(filter, {projection:{_id:0}})
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize);

        const totalCount = await blogsCollection.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const blogsArray = await foundBlogsInDB.toArray()

        const outputBlogs: outputBlogsWithPaginatorType = {
            pagesCount: pageCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: totalCount,
            items: blogsArray.map((blog) => {
                return {
                    id: blog.id,
                    name: blog.name,
                    description: blog.description,
                    websiteUrl: blog.websiteUrl,
                    createdAt: blog.createdAt
                }
            })
        }
        return outputBlogs
    },
    async findBlogByID(id: string): Promise<blogType | null>{
        const blog = await blogsCollection.findOne({id: id})
        if(blog){
            return {
                id: blog.id,
                name : blog.name,
                description : blog.description,
                websiteUrl: blog.websiteUrl,
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
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString()
        }
        const newObjectBlog: blogType = Object.assign({}, newBlog);
        await blogsCollection.insertOne(newBlog)

        return newObjectBlog
    },
    async updateBlogByID(id: string, body: blogType): Promise<boolean>{
        const result = await blogsCollection.updateOne({id: id}, {$set: {
            name: body.name,
            youtubeUrl: body.websiteUrl}})
        return result.matchedCount === 1
    },
    async deleteAllBlogs(): Promise<boolean>{
        const result = await blogsCollection.deleteMany({})
        return !!result.deletedCount
    }
}