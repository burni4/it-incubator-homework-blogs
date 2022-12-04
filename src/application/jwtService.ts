import jwt from 'jsonwebtoken'
import {userOutputType} from "../projectTypes";

const JWT_SECRET_LOCAL: string = "JWT_SECRET"

const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_LOCAL;

export const jwtService = {
    createAccessJWT(user: userOutputType){
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '10s'})
        return {
            accessToken: token
        }
    },
    createRefreshJWT(user: userOutputType){
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '20s'})
        return {
            refreshToken : token
        }
    },
    getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        }catch(error){
            return null
        }
    },
    getUserIdByRefreshToken(token: string){
        try{
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        }catch(error){
            return null
        }
    }
}
