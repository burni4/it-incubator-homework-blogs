import jwt from 'jsonwebtoken'
import {userOutputType, userDBType} from "../projectTypes";

const JWT_SECRET_LOCAL: string = "JWT_SECRET"

const JWT_SECRET = process.env.mongoURIAtlas || JWT_SECRET_LOCAL;

export const jwtService = {
    async createJWT(user: userOutputType){
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'})
        return {
            accessToken: token
        }
    },
    async getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, '')
            return result.id
        }catch(error){
            return null
        }
    }
}
