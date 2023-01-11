import {BlogsModelClass} from "./db";
import {blogDBType, outputBlogsWithPaginatorType, queryBlogParams} from "../projectTypes";

export const blogsRepositoryInDB = {
    async findAllBlogs(paginator: queryBlogParams): Promise<outputBlogsWithPaginatorType>{
        let filter = {}
        if(paginator.searchNameTerm){
            filter = {name: { $regex: paginator.searchNameTerm, $options: "i" }}
        }
        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundBlogsInDB = await BlogsModelClass.find(filter, {projection:{_id:0}}).lean()
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize);

        const totalCount = await BlogsModelClass.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const blogsArray = foundBlogsInDB

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
    async findBlogByID(id: string): Promise<blogDBType | null>{
        const blog = await BlogsModelClass.findOne({id: id})
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
        const result = await BlogsModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async createBlog(data: blogDBType): Promise<blogDBType>{
        const newBlog: blogDBType = {
            id: String(+new Date()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString()
        }
        const newObjectBlog: blogDBType = Object.assign({}, newBlog);
        await BlogsModelClass.create(newBlog)

        return newObjectBlog
    },
    async updateBlogByID(id: string, body: blogDBType): Promise<boolean>{
        const result = await BlogsModelClass.updateOne({id: id}, {$set: {
            name: body.name,
            youtubeUrl: body.websiteUrl}})
        return result.matchedCount === 1
    },
    async deleteAllBlogs(): Promise<boolean>{
        const result = await BlogsModelClass.deleteMany({})
        return !!result.deletedCount
    }
}