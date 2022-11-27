import {commentsRepositoryInDB} from "../repositories/comments-repository";
import {userOutputType} from "../projectTypes";


export const commentsService = {
    async deleteCommentByID(id: string, user: userOutputType): Promise<boolean>{
        return await commentsRepositoryInDB.deleteCommentByID(id)
    }
}
