import {usersCollection} from "./db";
import {
    outputUsersWithPaginatorType,
    queryUserParams,
    userOutputType,
    userDBType,
    emailConfirmationType
} from "../projectTypes";

export const usersRepositoryInDB = {
    async findUserByID(idFromDB: string): Promise<userOutputType | null>{
        const foundUsersInDB: userDBType | null = await usersCollection.findOne({ id : idFromDB }, {projection:{_id:0}})
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

        const foundUsersInDB = await usersCollection.find(filter, {projection:{_id:0}})
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize);

        const totalCount = await usersCollection.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const usersArrayFromDB = await foundUsersInDB.toArray()

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
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<userDBType | null>{
        const filter = {$or: [{"accountData.login" : { $regex: loginOrEmail, $options: "i" }},
                {"accountData.email" : { $regex: loginOrEmail, $options: "i" }}]}
        const user: userDBType | null = await usersCollection.findOne(filter)
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

        const user: userDBType | null = await usersCollection.findOne({"accountData.email": email})

        if(user){
            return user
        }else{
            return null
        }

    },
    async findByLogin(login: string): Promise<userDBType | null>{

        const user: userDBType | null = await usersCollection.findOne({"accountData.login": login})

        if(user){
            return user
        }else{
            return null
        }

    },
    async findByPasswordHash(passwordHash: string): Promise<userDBType | null>{

        const user: userDBType | null = await usersCollection.findOne({"accountData.passwordHash": passwordHash})

        if(user){
            return user
        }else{
            return null
        }

    },
    async findUserByConfirmationCode(code: string): Promise<userDBType | null>{

        const user: userDBType | null = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})

        if(user){
            return user
        }else{
            return null
        }

    },
    async updateConfirmation(id: string): Promise<boolean>{

        let result = await  usersCollection.updateOne({id: id},{$set:{'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1

    },
    async updateEmailConfirmation(id: string, emailConformation: emailConfirmationType): Promise<boolean> {

        let result = await usersCollection.updateOne({id: id}, {$set: {emailConfirmation: emailConformation}})
        return result.modifiedCount === 1

    },
    async createUser(newUser: userDBType): Promise<userDBType | null> {
        const newObjectUser: userDBType = Object.assign({}, newUser);
        await usersCollection.insertOne(newUser)

        return newObjectUser
    },
    async deleteAllUsers(): Promise<boolean>{
        const result = await usersCollection.deleteMany({})
        return !!result.deletedCount
    }
}