import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepositoryInDB} from "../repositories/users-repository";
import {v4 as uuidv4} from 'uuid';
import {
    outputUsersWithPaginatorType,
    queryUserParams,
    userOutputType,
    userDBType, emailConfirmationType, sessionInfoTypeInDB, devicesOutputType, UserPasswordRecoveryCodeTypeInDB
} from "../projectTypes";
import add from "date-fns/add";
import {emailManager} from "../managers/email-manager";
import {sessionsInfoRepositoryInDB} from "../repositories/sessionsInfo-repository";
import {jwtService} from "../application/jwtService";

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
        return await usersRepositoryInDB.findUserByConfirmationCode(code)
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
    createUser: async function (login: string, email: string, password: string): Promise<userOutputType | null> {
        const passwordSalt = await this.generateSalt()
        const passwordHash = await this.generateHash(password, passwordSalt)

        const newUser: userDBType = {
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
        } catch {
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
        if(user.emailConfirmation.isConfirmed) return false

        const newEmailConfirmation: emailConfirmationType = {
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {hours: 1, minutes: 0}),
            isConfirmed: false
        }

        const resUpdate: boolean = await usersRepositoryInDB.updateEmailConfirmationCode(user.id, newEmailConfirmation.confirmationCode)

        if (!resUpdate) return false

        try {
            await emailManager.sendEmailConfirmationMessage(newEmailConfirmation.confirmationCode, email)
        } catch {
            return false
        }
        return true
    },
    async sendPasswordRecoveryCodeOnEmail(email: string): Promise<boolean>{

        const user: userDBType | null = await this.findByLoginOrEmail(email)

        if(!user) return true

        const newPasswordRecoveryCodeObj: UserPasswordRecoveryCodeTypeInDB = {
            userId: user.id,
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), {hours: 1, minutes: 0})
        }

        const resUpdate: boolean = await usersRepositoryInDB.addRecoveryPasswordCode(newPasswordRecoveryCodeObj)

        if (!resUpdate) return false

        try {
            await emailManager.sendEmailRecoveryPasswordMessage(newPasswordRecoveryCodeObj.recoveryCode, email)
        } catch {
            return false
        }
        return true
    },
    async updatePasswordByRecoveryCode(newPassword: string,recoveryCode: string): Promise<boolean>{

        const codeIsValid: boolean = await usersRepositoryInDB.recoveryCodeIsValid(recoveryCode)

        if (!codeIsValid) return false

        const userId = await usersRepositoryInDB.findUserIdByRecoveryCode(recoveryCode)

        if (!userId) return false

        const passwordSalt = await this.generateSalt()
        const passwordHash = await this.generateHash(newPassword, passwordSalt)

        const result = await usersRepositoryInDB.updateUserPassword(userId, passwordHash,passwordSalt)

        const delResult = await usersRepositoryInDB.deleteAllSentUserRecoveryCodes(userId)

        return true
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
    async createUserSession(userId: string, ip: string, title: string, deviceId?: string): Promise<sessionInfoTypeInDB | null>{

        const issueDate = new Date()

        const newSession: sessionInfoTypeInDB = {
            ip: ip,
            title: title,
            expireDate: add(issueDate, {seconds: 20}),
            lastActiveDate: issueDate,
            deviceId: deviceId || uuidv4(),
            userId: userId}
        await sessionsInfoRepositoryInDB.createUserSession(newSession)
        return  newSession
    },
    async deleteSession(refreshToken: string): Promise<boolean>{
        const result = jwtService.getRefreshTokenPayload(refreshToken)
        if(!result) return false
        return await sessionsInfoRepositoryInDB.deleteSessionByDeviceId(result.deviceId)
    },
    async deleteSessionByDeviceId(deviceId: string): Promise<boolean>{
        return await sessionsInfoRepositoryInDB.deleteSessionByDeviceId(deviceId)
    },
    async findSessionByDeviceID(refreshToken: string): Promise<sessionInfoTypeInDB | null>{
        const result = jwtService.getRefreshTokenPayload(refreshToken)
        if(!result) return null
        return await sessionsInfoRepositoryInDB.findSessionByDeviceID(result.deviceId)
    },
    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async generateSalt() {
        return await bcrypt.genSalt(10)
    },
    async findUserDevicesByRefreshToken(refreshToken: string): Promise<sessionInfoTypeInDB[]> {
        const result = jwtService.getRefreshTokenPayload(refreshToken)
        if(!result) return []
        const foundSessions: sessionInfoTypeInDB[] | null = await sessionsInfoRepositoryInDB.findUserSessions(result.userId)
        if (!foundSessions) return []
        return foundSessions
    },
    async deleteAllSessionsExceptOne(refreshToken: string): Promise<boolean>{
        const result = jwtService.getRefreshTokenPayload(refreshToken)
        if(!result) return false
        const delRes = await sessionsInfoRepositoryInDB.deleteAllSessionsExceptOne(result.deviceId, result.userId)
        return delRes
    },
    async checkIsAUserDevice(refreshToken: string, deviceId: string): Promise<boolean> {
        const result = jwtService.getRefreshTokenPayload(refreshToken)
        if(!result) return false
        return result.userId === await sessionsInfoRepositoryInDB.findUserIdByDeviceId(deviceId)
    },
    async deleteAllSentUserRecoveryCodes(userId: string): Promise<boolean> {
        const result = usersRepositoryInDB.deleteAllSentUserRecoveryCodes(userId)
        return !!result
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