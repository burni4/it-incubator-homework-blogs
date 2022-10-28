import {postsCollection, postType} from "./db";
import {blogsRepository} from "./blogs-repository";

export const postsRepository = {
    async findAllPosts(): Promise<postType[]>{
        return postsCollection.find({}).toArray();
    },
    async findPostByID(id: string): Promise<postType | null | void> {
        return await postsCollection.findOne({id: id})
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
        const result = await postsCollection.insertOne(newPost)

        const newObjectPost = Object.assign({}, newPost);

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