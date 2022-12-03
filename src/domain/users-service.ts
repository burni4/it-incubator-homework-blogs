import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepositoryInDB} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';
import {
    outputUsersWithPaginatorType,
    queryUserParams,
    userOutputType,
    userDBType, userServiceType
} from "../projectTypes";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";

export const usersService = {
    async findUsers(params: queryUserParams): Promise<outputUsersWithPaginatorType>{
        return await usersRepositoryInDB.findUsers(queryUserParamsPaginator(params))
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<userDBType | null>{
        return await usersRepositoryInDB.findByLoginOrEmail(loginOrEmail)
    },
    async findByLogin(login: string): Promise<userDBType | null>{
        return await usersRepositoryInDB.findByLogin(login)
    },
    async findByEmail(email: string): Promise<userDBType | null>{
        return await usersRepositoryInDB.findByEmail(email)
    },
    async findUserByConfirmationCode(code: string): Promise<userDBType | null>{
        return await this.findUserByConfirmationCode(code)
    },
    async confirmEmailByCode(code: string): Promise<boolean>{
        let user: userDBType | null = await usersRepositoryInDB.findUserByConfirmationCode(code)
        if(!user) return false
        if(user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode === code
            && user.emailConfirmation.expirationDate > new Date()){
            let result = await usersRepositoryInDB.updateConfirmation(user.id)
            return result
        }
        return false
    },
    async confirmEmailByRegistrationLink(email: string): Promise<boolean>{
        const code = ''
        return await this.confirmEmailByCode(code)
    },
    async userWithLoginOrEmailExist(email: string, login: string): Promise<boolean>{

        const userByEmail = await usersRepositoryInDB.findByEmail(email)
        const userByLogin = await usersRepositoryInDB.findByLogin(login)

        if (userByEmail || userByLogin){
            return true
        }else{
            return false
        }
    },
    async userWithEmailAndPasswordExist(email: string, password: string): Promise<boolean>{
        const passwordSalt = await this.generateSalt()
        const passwordHash = await this.generateHash(password, passwordSalt)

        const userByEmail = await usersRepositoryInDB.findByEmail(email)
        const userByLoginPasswordUsed = await usersRepositoryInDB.findByPasswordHash(passwordHash)

        if (userByEmail || userByLoginPasswordUsed){
            return true
        }else{
            return false
        }
    },
    async findUserByID(userId: string): Promise<userOutputType | null>{
        return await usersRepositoryInDB.findUserByID(userId)
    },
    async createUser(login: string, email: string, password: string): Promise<userOutputType | null>{
        const passwordSalt = await this.generateSalt()
        const passwordHash = await this.generateHash(password,passwordSalt)

        const newUser: userServiceType = {
            //_id: new ObjectId(),
            id: String(+new Date()),
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 0}),
                isConfirmed: false
            }
        }

        const newUserInDB = await usersRepositoryInDB.createUser(newUser)

        try {
            await emailManager.sendEmailConfirmationMessage(newUser.emailConfirmation.confirmationCode, newUser.accountData.email)
        }catch {
            await usersRepositoryInDB.deleteUserByID(newUser.id)
            return null
        }

        const outputUser: userOutputType = {
            id: newUser.id,
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }

        return outputUser
    },
    async resendConfirmationCodeOnEmail(email: string): Promise<boolean>{

        const user: userDBType | null = await this.findByLoginOrEmail(email)

        if(!user) return false

        await emailManager.sendEmailConfirmationMessage(user.emailConfirmation.confirmationCode, email)

        return false
    },
    async deleteUserByID(id: string): Promise<boolean>{
        return await usersRepositoryInDB.deleteUserByID(id)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<userOutputType | null> {
        const user: userDBType | null = await usersRepositoryInDB.findByLoginOrEmail(loginOrEmail)
        if(!user) return null

        const passwordHash = await this.generateHash(password, user.accountData.passwordSalt)

        if(user.accountData.passwordHash !== passwordHash){
            return null
        }
        return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    },
    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async generateSalt() {
        return await bcrypt.genSalt(10)
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