import {Response, Request, NextFunction} from "express";

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