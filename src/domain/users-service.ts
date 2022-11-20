import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepositoryInDB} from "../repositories/users-repository";
import {
    outputUsersWithPaginatorType,
    queryUserParams,
    userOutputType,
    userType
} from "../projectTypes";

export const usersService = {
    async findUsers(params: queryUserParams): Promise<outputUsersWithPaginatorType>{
        return await usersRepositoryInDB.findUsers(queryUserParamsPaginator(params))
    },
    async createUser(login: string, email: string, password: string): Promise<userOutputType | null>{
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

        await usersRepositoryInDB.createUser(newUser)

        const outputUser: userOutputType = {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }

        return outputUser
    },
    async deleteUserByID(id: string): Promise<boolean>{
        return await usersRepositoryInDB.deleteUserByID(id)
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

const queryUserParamsPaginator = (queryParams: queryUserParams):queryUserParams => {
    return {
        pageNumber: +queryParams.pageNumber || 1,
        pageSize: +queryParams.pageSize || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc',
        searchLoginTerm: queryParams.searchLoginTerm || null,
        searchEmailTerm: queryParams.searchEmailTerm || null,
    }
}