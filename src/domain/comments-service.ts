import {commentsRepositoryInDB} from "../repositories/comments-repository";


export const commentsService = {
    async deleteCommentByID(id: string): Promise<boolean>{
        return await commentsRepositoryInDB.deleteCommentByID(id)
    }
}
