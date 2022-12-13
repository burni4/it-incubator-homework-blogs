import {blogsCollection, postsCollection, sessionsInfoCollection} from "./db";
import {blogType, sessionInfoTypeInDB} from "../projectTypes";


export const sessionsInfoRepositoryInDB = {

    async deleteAllSessions(): Promise<boolean> {
        const result = await sessionsInfoCollection.deleteMany({})
        return !!result.deletedCount
    },
    async deleteAllSessionsExceptOne(deviceId: string, userId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.deleteMany({ $and: [ {userId: userId},{deviceId: { $ne: deviceId }}]})
        return result.deletedCount === 1
    },
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.deleteOne({deviceId: deviceId})
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
    async findSessionByDeviceID(deviceId: string): Promise<sessionInfoTypeInDB | null> {
        const foundUserSessions: sessionInfoTypeInDB | null = await sessionsInfoCollection.findOne({deviceId: deviceId}, {projection:{_id:0, userId: 0, expireDate: 0}})
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
    },
    async updateSessionInfo(deviceId: string): Promise<boolean>{
        const result = await sessionsInfoCollection.updateOne({deviceId: deviceId}, {$set: {
                lastActiveDate: new Date()}})
        return result.matchedCount === 1
    },

}