import {sessionsInfoCollection} from "./db";
import {sessionInfoTypeInDB} from "../projectTypes";


export const sessionsInfoRepositoryInDB = {

    async deleteAllComments(): Promise<boolean> {
        const result = await sessionsInfoCollection.deleteMany({})
        return !!result.deletedCount
    },
    async deleteAllSessionsExceptOne(deviceId: string, userId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.deleteMany({ $and: [ {userId: userId},{deviceId: { $ne: deviceId }}]})
        return result.deletedCount === 1
    },
    async deleteSessionByDeviceId(deviceId: string, userId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.deleteOne({deviceId: deviceId, userId: userId})
        return result.deletedCount === 1
    },
    async createUserSession(sessionInfo: sessionInfoTypeInDB): Promise<sessionInfoTypeInDB | null> {
        const newUserSession: sessionInfoTypeInDB = Object.assign({}, sessionInfo);
        await sessionsInfoCollection.insertOne(sessionInfo)

        return newUserSession
    }
}