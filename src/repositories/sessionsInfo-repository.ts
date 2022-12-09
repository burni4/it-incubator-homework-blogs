import {sessionsInfoCollection} from "./db";


export const sessionsInfoRepositoryInDB = {

    async deleteAllComments(): Promise<boolean> {
        const result = await sessionsInfoCollection.deleteMany({})
        return !!result.deletedCount
    }
}