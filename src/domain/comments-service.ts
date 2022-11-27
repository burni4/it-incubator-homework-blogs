import {commentsRepositoryInDB} from "../repositories/comments-repository";
import {blogType, commentDBType, commentInputType, commentOutputType, userOutputType} from "../projectTypes";
import {blogsRepositoryInDB} from "../repositories/blogs-repository";


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
    },
    async updateCommentByID(id: string, body: commentInputType): Promise<boolean>{
        return await commentsRepositoryInDB.updateCommentByID(id, body)
    },
}
