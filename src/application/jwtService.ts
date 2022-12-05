import jwt from 'jsonwebtoken'
import {generatedTokensType, userOutputType} from "../projectTypes";

const JWT_SECRET_LOCAL: string = "JWT_SECRET"

const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_LOCAL;

export const jwtService = {
    createAccessJWT(userId: string){
        return jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: '10s'})
    },
    createRefreshJWT(userId: string){
        return  jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: '20s'})
    },
    getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        }catch(error){
            return null
        }
    },
    generateNewTokens(userId: string):generatedTokensType{

        const tokens: generatedTokensType = {
            accessToken: this.createAccessJWT(userId),
            refreshToken: this.createRefreshJWT(userId)
        }

        return tokens

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
