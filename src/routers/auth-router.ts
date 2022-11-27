import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {authTypeValidation} from "../middlewares/input-auth-validation-middleware";
import {usersService} from "../domain/users-service";
import {userOutputType} from "../projectTypes";
import {jwtService} from "../application/jwtService";
import {authMiddleware} from "../middlewares/authorization-middleware";

export const authRouter = Router({})

authRouter.post('/login',
    authTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},{loginOrEmail: string, password: string}>, res: Response) => {

        const user: userOutputType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token = await jwtService.createJWT(user)
                res.status(200).send(token)
            } else {
                res.sendStatus(401)
            }
})
authRouter.post('/me',
    authMiddleware,
    inputValidationMiddleware,
    async (req: Request<{},{},{user: userOutputType}>, res: Response) => {

        if (req.body.user) {
            const outputUser = {
                email: req.body.user.email,
                login: req.body.user.login,
                userId: req.body.user.id
            }
            res.status(200).send(outputUser)
        } else {
            res.sendStatus(401)
        }
    })
