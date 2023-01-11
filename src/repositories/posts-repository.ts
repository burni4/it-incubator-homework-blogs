import {PostsModelClass} from "./db";
import {outputPostsWithPaginatorType, postDBType, queryPostParams} from "../projectTypes";

export const postsRepositoryInDB = {
    async findAllPosts(paginator: queryPostParams, blogID?: string): Promise<outputPostsWithPaginatorType>{

        let filter = {}

        if(blogID){
            filter = {blogId: blogID}
        }

        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundPostsInDB = await PostsModelClass.find(filter, {projection:{_id:0}})
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize)
            .lean();

        const totalCount = await PostsModelClass.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const postsArray = foundPostsInDB

        const outputPosts: outputPostsWithPaginatorType = {
            pagesCount: pageCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: totalCount,
            items: postsArray.map((post) => {
                return {
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt
                }
            })
        }
        return outputPosts
    },
    async findPostByID(id: string): Promise<postDBType | null> {
        const post = await PostsModelClass.findOne({id: id})
        if (post) {
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            }
        }
        return null
    },
    async deletePostByID(id: string): Promise<boolean>{
            const result = await PostsModelClass.deleteOne({id: id})
            return result.deletedCount === 1
    },
    async createPost(newPost: postDBType): Promise<postDBType>{

        const newObjectPost: postDBType = Object.assign({}, newPost);
        await PostsModelClass.create(newPost)

        return newObjectPost
    },
    async updatePostByID(id: string, body: postDBType): Promise<boolean>{
        const result = await PostsModelClass.updateOne({id: id}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId}})

        return result.matchedCount === 1
    },
    async deleteAllPosts(): Promise<boolean>{
        const result = await PostsModelClass.deleteMany({})
        return !!result.deletedCount
    }
}