import basicAuth from 'express-basic-auth';
import {usersRepository} from "../repositories/registered-users-repository";
import {Response, Request, NextFunction} from "express";

export const authorizationMiddleware = basicAuth({

        authorizer: (user, password, authorize) => {
            return authorize(null, usersRepository.checkUserAuthentication(user, password))
        },
        authorizeAsync: true,
})

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