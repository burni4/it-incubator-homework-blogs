import {postsCollection, postType} from "./db";
import {blogsRepository} from "./blogs-repository";

export const postsRepository = {
    async findAllPosts(): Promise<postType[]>{
        return postsCollection.find({}, {projection:{_id:0}}).toArray();
    },
    async findPostByID(id: string): Promise<postType | null | void> {
        const post = await postsCollection.findOne({id: id})
        return {
            id: post?.id || "",
            title: post?.id || "",
            shortDescription: post?.id || "",
            content: post?.id || "",
            blogId: post?.id || "",
            blogName: post?.id || "",
            createdAt: post?.id || "",
        }
    },
    async deletePostByID(id: string): Promise<boolean>{
            const result = await postsCollection.deleteOne({id: id})
            return result.deletedCount === 1
    },
    async createPost(data: postType): Promise<postType>{

        const blog = await blogsRepository.findBlogByID(data.blogId)

        const newPost: postType = {
            id: String(+new Date()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName:  String(blog?.name),
            createdAt: new Date().toISOString()
        }
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