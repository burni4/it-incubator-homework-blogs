import {usersCollection} from "./db";
import {outputUsersWithPaginatorType, queryUserParams, userOutputType, userType} from "../projectTypes";

export const usersRepositoryInDB = {
    async findUserByID(idFromDB: string): Promise<userOutputType | null>{
        const foundUsersInDB: userType | null = await usersCollection.findOne({ id : idFromDB }, {projection:{_id:0}})
        if(!foundUsersInDB){
           return null
        }
        return {
            id: foundUsersInDB.id,
            login: foundUsersInDB.login,
            email: foundUsersInDB.email,
            createdAt: foundUsersInDB.createdAt
        }
    },
    async findUsers(paginator: queryUserParams): Promise<outputUsersWithPaginatorType>{
        let filter = {}
        const expressions = []
        if(paginator.searchLoginTerm){
            expressions.push({login: { $regex: paginator.searchLoginTerm, $options: "i" }})
        }
        if(paginator.searchEmailTerm){
            expressions.push({email: { $regex: paginator.searchEmailTerm, $options: "i" }})
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
                    login: user.login,
                    email: user.email,
                    createdAt: user.createdAt
                }
            })
        }
        return usersArray
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