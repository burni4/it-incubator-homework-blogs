import {usersCollection} from "./db";

export const usersRepositoryInDB = {
    async findAllUsers(): Promise<null>{
        return null
    },
    async deleteUserByID(id: string): Promise<boolean>{
        return true
    },
    async createUser(): Promise<null>{
        return null
    },
    async deleteAllUsers(): Promise<boolean>{
        const result = await usersCollection.deleteMany({})
        return !!result.deletedCount
    }
}