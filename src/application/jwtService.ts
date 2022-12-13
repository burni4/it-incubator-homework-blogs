import jwt from 'jsonwebtoken'
import {generatedTokensType, sessionInfoTypeInDB} from "../projectTypes";
import {usersService} from "../domain/users-service";
import {sessionsInfoRepositoryInDB} from "../repositories/sessionsInfo-repository";

const JWT_SECRET_LOCAL: string = "JWT_SECRET"

const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_LOCAL;

export const jwtService = {
    createAccessJWT(userId: string){
        return jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: '10s'})
    },
    createRefreshJWT(userId: string, deviceId: string){
        return  jwt.sign({userId: userId, deviceId: deviceId}, JWT_SECRET, {expiresIn: '20s'})
    },
    getUserIdByToken(token: string){
        try{
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        }catch(error){
            return null
        }
    },
    getRefreshTokenPayload(refreshToken: string):{userId: string, deviceId: string} | null{
        try{
            const result: any = jwt.verify(refreshToken, JWT_SECRET)
            return result
        }catch(error){
            return null
        }
    },
    async generateNewTokens(userId: string, ip: string, title: string, deviceId?: string): Promise<generatedTokensType | null>{

        const sessionInfo: sessionInfoTypeInDB | null = await usersService.createUserSession(userId, ip, title, deviceId)

        if (!sessionInfo){
            return null
        }

        const tokens: generatedTokensType = {
            accessToken: this.createAccessJWT(userId),
            refreshToken: this.createRefreshJWT(userId, sessionInfo.deviceId)
        }

        return tokens

    },
    async updateRefreshToken(ip: string, title: string, refreshToken: string): Promise<generatedTokensType | null>{

        let result: any

        try{
            result = jwt.verify(refreshToken, JWT_SECRET)
        }catch(error){
            return null
        }

        await sessionsInfoRepositoryInDB.deleteSessionByDeviceId(result.deviceId)

        const tokens : generatedTokensType | null = await  this.generateNewTokens(result.userId, ip, title, result.deviceId)

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
