import {usersCollection} from "./db";
import {userType} from "../projectTypes";

export const usersRepositoryInDB = {
    async findAllUsers(): Promise<null>{
        return null
    },
    async deleteUserByID(id: string): Promise<boolean>{
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<userType | null>{
        const filter = {$or: [{login : { $regex: loginOrEmail, $options: "i" }},
                {email : { $regex: loginOrEmail, $options: "i" }}]}
        const user: userType | null = await usersCollection.findOne(filter)
        if (user) {
            return {
                id: user.id,
                login: user.login,
                email: user.email,
                passwordHash: user.passwordHash,
                passwordSalt: user.passwordSalt,
                createdAt: user.createdAt
            }
        }
        return null
    },
    async createUser(newUser: userType): Promise<userType | null>{
        const newObjectUser: userType = Object.assign({}, newUser);
        await usersCollection.insertOne(newUser)

        return newObjectUser
    },
    async deleteAllUsers(): Promise<boolean>{
        const result = await usersCollection.deleteMany({})
        return !!result.deletedCount
    }
}