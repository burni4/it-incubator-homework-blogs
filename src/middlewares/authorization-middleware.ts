import {Response, Request, NextFunction} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwtService";
import {userDBType} from "../projectTypes";

const credentials = {
    login: 'admin',
    password: 'qwerty'
}

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const encodedAuth = Buffer.from(`${credentials.login}:${credentials.password}`).toString('base64')

    const validHeader = `Basic ${encodedAuth}`

    if (validHeader === authHeader) {
        next()
        return
    }
    res.sendStatus(401)
}

export  const authMiddleware = async (req: Request, res: Response, next: NextFunction)  => {

    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)

    if(!userId){
        res.sendStatus(401)
        return
    }

    const user = await usersService.findUserByID(userId)

    if(!user){
        res.sendStatus(401)
        return
    }

    req.body.user = user

    next()
}

export  const authMiddlewareGetUser = async (req: Request, res: Response, next: NextFunction)  => {

    if(!req.headers.authorization) return next()

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)

    if(!userId) return next()

    const user = await usersService.findUserByID(userId)

    if(!user) return next()

    req.body.user = user

    next()

}

export const refreshTokenVerification = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.sendStatus(401)
        return
    }


    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)

    if(!userId){
        res.sendStatus(401)
        return
    }
    /*
    const user = await  usersService.findUserByID(userId)
    if(!user){
        res.sendStatus(401)
        return
    }
    */
    next()
}