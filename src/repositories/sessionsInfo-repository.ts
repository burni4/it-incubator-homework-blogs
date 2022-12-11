import {sessionsInfoCollection} from "./db";


export const sessionsInfoRepositoryInDB = {

    async deleteAllComments(): Promise<boolean> {
        const result = await sessionsInfoCollection.deleteMany({})
        return !!result.deletedCount
    },
    async deleteAllSessionsExceptOne(deviceId: string, userId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.deleteMany({deviceId: deviceId, userId: userId})
        return result.deletedCount === 1
    },
    async deleteSessionByDeviceId(deviceId: string, userId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.deleteOne({deviceId: deviceId, userId: userId})
        return result.deletedCount === 1
    }
}