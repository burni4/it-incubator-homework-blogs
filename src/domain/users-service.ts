import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepositoryInDB} from "../repositories/users-repository";
import {userType} from "../projectTypes";

export const usersService = {
    async createUser(login: string, email: string, password: string): Promise<any>{
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password,passwordSalt)

        const newUser = {
            //_id: new ObjectId(),
            id: String(+new Date()),
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString()
        }

        return usersRepositoryInDB.createUser(newUser)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user: userType | null = await usersRepositoryInDB.findByLoginOrEmail(loginOrEmail)
        if(!user) return false

        const passwordHash = await this.generateHash(password, user.passwordSalt)

        if(user.passwordHash !== passwordHash){
            return false
        }
        return true
    },
    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}