import {commentsCollection} from "./db";


export const commentsRepositoryInDB = {
    async deleteCommentByID(id: string): Promise<boolean>{
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean>{
        const result = await commentsCollection.deleteMany({})
        return !!result.deletedCount
    }

}