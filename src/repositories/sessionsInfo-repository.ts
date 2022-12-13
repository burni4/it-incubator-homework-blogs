import {postsCollection, sessionsInfoCollection} from "./db";
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
    },
    async findUserSession(userId: string, deviceId: string): Promise<sessionInfoTypeInDB[] | null> {
        const foundUserSessions: sessionInfoTypeInDB[] | null = await sessionsInfoCollection.find({userId: userId, deviceId: deviceId}, {projection:{_id:0, userId: 0, expireDate: 0}}).toArray()
        return foundUserSessions
    },
    async findUserSessions(userId: string): Promise<sessionInfoTypeInDB[] | null> {
        const foundUserSessions: sessionInfoTypeInDB[] | null = await sessionsInfoCollection.find({
            userId: userId
        }, {projection: {_id: 0, userId: 0, expireDate: 0}}).toArray()
        return foundUserSessions
    },
    async findUserIdByDeviceId(deviceId: string): Promise<string | null> {
        const foundUserSessions: sessionInfoTypeInDB | null = await sessionsInfoCollection.findOne({deviceId: deviceId}, {projection:{_id:0}})
        if(!foundUserSessions) return null
        return foundUserSessions.userId
    }

}