import {usersCollection} from "./db";


export const commentsRepositoryInDB = {
    async deleteAllComments(): Promise<boolean>{
        const result = await usersCollection.deleteMany({})
        return !!result.deletedCount
    }
}