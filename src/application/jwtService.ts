import jwt from 'jsonwebtoken'
import {userOutputType} from "../projectTypes";

const JWT_SECRET_LOCAL: string = "JWT_SECRET"

const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_LOCAL;

export const jwtService = {
    async createJWT(user: userOutputType){
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'})
        return {
            accessToken: token
        }
    },
    async getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        }catch(error){
            return null
        }
    }
}
