import {postsCollection} from "./db";
import {postType} from "../projectTypes";

export const postsRepositoryInDB = {
    async findAllPosts(): Promise<postType[]>{
        return postsCollection.find({}, {projection:{_id:0}}).toArray();
    },
    async findPostByID(id: string): Promise<postType | null> {
        const post = await postsCollection.findOne({id: id})
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
            const result = await postsCollection.deleteOne({id: id})
            return result.deletedCount === 1
    },
    async createPost(newPost: postType): Promise<postType>{

        const newObjectPost: postType = Object.assign({}, newPost);
        await postsCollection.insertOne(newPost)

        return newObjectPost
    },
    async updatePostByID(id: string, body: postType): Promise<boolean>{
        const result = await postsCollection.updateOne({id: id}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId}})

        return result.matchedCount === 1
    },
    async deleteAllPosts(): Promise<boolean>{
        const result = await postsCollection.deleteMany({})
        return !!result.deletedCount
    }
}