import {commentsCollection, postsCollection, usersCollection} from "./db";
import {
    commentDBType,
    commentInputType,
    commentOutputType
} from "../projectTypes";



export const commentsRepositoryInDB = {
    async findCommentByID(idFromDB: string): Promise<commentOutputType | null>{
        const foundCommentInDB: commentDBType | null = await commentsCollection.findOne({ id : idFromDB }, {projection:{_id:0}})
        if(!foundCommentInDB){
            return null
        }
        return {
            id: foundCommentInDB.id,
            content: foundCommentInDB.content,
            userId: foundCommentInDB.userId,
            userLogin: foundCommentInDB.userLogin,
            createdAt: foundCommentInDB.createdAt
        }
    },
    async createComment(newComment: commentDBType): Promise<commentDBType | null> {
        const newObjectComment: commentDBType = Object.assign({}, newComment);
        await commentsCollection.insertOne(newObjectComment)

        return newObjectComment
    },
    async updateCommentByID(id: string, comment: commentInputType): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set: {content: comment.content}})
        return result.matchedCount === 1
    },
    async deleteCommentByID(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await commentsCollection.deleteMany({})
        return !!result.deletedCount
    }
}