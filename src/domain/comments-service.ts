import {commentsRepositoryInDB} from "../repositories/comments-repository";
import {commentDBType, commentOutputType, userOutputType} from "../projectTypes";


export const commentsService = {
    async deleteCommentByID(id: string, user: userOutputType): Promise<boolean>{
        return await commentsRepositoryInDB.deleteCommentByID(id)
    },
    async findCommentByID(id: string): Promise<commentOutputType | null>{
        return await commentsRepositoryInDB.findCommentByID(id)
    },
    async checkOwnerComment(user: userOutputType, commentId: string): Promise<boolean>{
        const result: commentDBType | null = await this.findCommentByID(commentId)
        if(!result || result.userId !== user.id){
            return false
        }
        return true
    }
}
