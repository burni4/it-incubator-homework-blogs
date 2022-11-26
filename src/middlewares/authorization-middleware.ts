import {Response, Request, NextFunction} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwtService";

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
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if(userId){
        //req.body.user = await usersService.findUserByID(userId)
        next()
        return
    }
    res.send(401)
}