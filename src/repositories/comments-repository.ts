import {commentsCollection, usersCollection} from "./db";
import {commentDBType, commentOutputType, userDBType, userOutputType} from "../projectTypes";


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
    async deleteCommentByID(id: string): Promise<boolean>{
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean>{
        const result = await commentsCollection.deleteMany({})
        return !!result.deletedCount
    },
    async checkOwnerComment(user: userOutputType, commentId: string): Promise<boolean>{
        const result: commentDBType | null = await this.findCommentByID(commentId)
        if(!result || result.userId !== user.id){
            return false
        }
        return true
    }


}