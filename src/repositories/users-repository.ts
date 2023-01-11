import {UserPasswordRecoveryCodesModelClass, UsersModelClass} from "./db";
import {
    outputUsersWithPaginatorType,
    queryUserParams,
    userOutputType,
    userDBType, UserPasswordRecoveryCodeTypeInDB
} from "../projectTypes";

export const usersRepositoryInDB = {
    async findUserByID(idFromDB: string): Promise<userOutputType | null>{
        const foundUsersInDB: userDBType | null = await UsersModelClass.findOne({ id : idFromDB }, {projection:{_id:0}})
        if(!foundUsersInDB){
           return null
        }
        return {
            id: foundUsersInDB.id,
            login: foundUsersInDB.accountData.login,
            email: foundUsersInDB.accountData.email,
            createdAt: foundUsersInDB.accountData.createdAt
        }
    },
    async findUsers(paginator: queryUserParams): Promise<outputUsersWithPaginatorType>{
        let filter = {}
        const expressions = []
        if(paginator.searchLoginTerm){
            expressions.push({"accountData.login": { $regex: paginator.searchLoginTerm, $options: "i" }})
        }
        if(paginator.searchEmailTerm){
            expressions.push({"accountData.email": { $regex: paginator.searchEmailTerm, $options: "i" }})
        }

        if (expressions.length > 0){
            filter = {$or: expressions}
        }

        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundUsersInDB = await UsersModelClass.find(filter, {projection:{_id:0}}).lean()
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize);

        const totalCount = await UsersModelClass.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const usersArrayFromDB = foundUsersInDB

        const usersArray: outputUsersWithPaginatorType = {
            pagesCount: pageCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: totalCount,
            items: usersArrayFromDB.map((user) => {
                return {
                    id: user.id,
                    login: user.accountData.login,
                    email: user.accountData.email,
                    createdAt: user.accountData.createdAt
                }
            })
        }
        return usersArray
    },
    async deleteUserByID(id: string): Promise<boolean>{
        const result = await UsersModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<userDBType | null>{
        const filter = {$or: [{"accountData.login" : { $regex: loginOrEmail, $options: "i" }},
                {"accountData.email" : { $regex: loginOrEmail, $options: "i" }}]}
        const user: userDBType | null = await UsersModelClass.findOne(filter)
        if (user) {
            return {
                id: user.id,
                accountData: {
                    login: user.accountData.login,
                    email: user.accountData.email,
                    passwordHash: user.accountData.passwordHash,
                    passwordSalt: user.accountData.passwordSalt,
                    createdAt: user.accountData.createdAt
                },
                emailConfirmation: {
                    confirmationCode: user.emailConfirmation.confirmationCode,
                    expirationDate: user.emailConfirmation.expirationDate,
                    isConfirmed: user.emailConfirmation.isConfirmed
                }
            }
        }
        return null
    },
    async findByEmail(email: string): Promise<userDBType | null>{

        const user: userDBType | null = await UsersModelClass.findOne({"accountData.email": email})

        if(user){
            return user
        }else{
            return null
        }

    },
    async findByLogin(login: string): Promise<userDBType | null>{

        const user: userDBType | null = await UsersModelClass.findOne({"accountData.login": login})

        if(user){
            return user
        }else{
            return null
        }

    },
    async findByPasswordHash(passwordHash: string): Promise<userDBType | null>{

        const user: userDBType | null = await UsersModelClass.findOne({"accountData.passwordHash": passwordHash})

        if(user){
            return user
        }else{
            return null
        }

    },
    async findUserByConfirmationCode(code: string): Promise<userDBType | null>{

        const user: userDBType | null = await UsersModelClass.findOne({"emailConfirmation.confirmationCode": code})

        if(user){
            return user
        }else{
            return null
        }

    },
    async updateConfirmation(id: string): Promise<boolean>{

        let result = await  UsersModelClass.updateOne({id: id},{$set:{'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1

    },
    async updateEmailConfirmationCode(id: string, confirmationCode: string): Promise<boolean> {

        let result = await UsersModelClass.updateOne({id: id}, {$set: {'emailConfirmation.confirmationCode': confirmationCode}})
        return result.modifiedCount === 1

    },
    async createUser(newUser: userDBType): Promise<userDBType | null> {
        const newObjectUser: userDBType = Object.assign({}, newUser);

        await UsersModelClass.create(newUser)

        return newObjectUser
    },
    async deleteAllUsers(): Promise<boolean>{
        const result = await UsersModelClass.deleteMany({})
        await UserPasswordRecoveryCodesModelClass.deleteMany({})
        return !!result.deletedCount
    },
    async addRecoveryPasswordCode(userPasswordRecoveryCode: UserPasswordRecoveryCodeTypeInDB): Promise<boolean> {

        const recoveryPasswordCodeInstance = new UserPasswordRecoveryCodesModelClass()

        recoveryPasswordCodeInstance.userId = userPasswordRecoveryCode.userId
        recoveryPasswordCodeInstance.recoveryCode = userPasswordRecoveryCode.recoveryCode
        recoveryPasswordCodeInstance.expirationDate = userPasswordRecoveryCode.expirationDate

        await recoveryPasswordCodeInstance.save()

        return true
    },
    async recoveryCodeIsValid(recoveryCode: string): Promise<boolean> {

        const recoveryCodeObj: UserPasswordRecoveryCodeTypeInDB | null = await this.findByRecoveryCode(recoveryCode)
        if(!recoveryCodeObj) return false
        if(recoveryCodeObj.expirationDate < new Date()) return false
        return true
    },
    async findByRecoveryCode(recoveryCode: string): Promise<UserPasswordRecoveryCodeTypeInDB | null> {
        return UserPasswordRecoveryCodesModelClass.findOne({recoveryCode: recoveryCode}).lean()
    },
    async updateUserPassword(userId: string, passwordHash: string, passwordSalt: string): Promise<boolean> {

        const userInstance = await UsersModelClass.findOne({id: userId})

        if(!userInstance) return false

        userInstance.accountData.passwordHash = passwordHash
        userInstance.accountData.passwordSalt = passwordSalt

        await userInstance.save()

        return false
    },
    async findUserIdByRecoveryCode(recoveryCode: string): Promise<string | null> {

        const result = await this.findByRecoveryCode(recoveryCode)

        if (!result) return null

        return result.userId
    },
    async deleteAllSentUserRecoveryCodes(userId: string): Promise<boolean> {

        const result = await UserPasswordRecoveryCodesModelClass.deleteMany({userId: userId})

        return true
    }
}