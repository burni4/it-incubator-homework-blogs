import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {
    authTypeValidation,
    registrationConfirmationTypeValidation, registrationResendingConfirmationTypeValidation
} from "../middlewares/input-auth-validation-middleware";
import {usersService} from "../domain/users-service";
import {
    dataRegistrationType,
    registrationConformationType,
    registrationResendingConformationType,
    userOutputType
} from "../projectTypes";
import {jwtService} from "../application/jwtService";
import {authMiddleware} from "../middlewares/authorization-middleware";
import {userTypeValidation} from "../middlewares/input-users-validation-middleware";
import {body} from "express-validator";

export const authRouter = Router({})

authRouter.post('/login',
    authTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},{loginOrEmail: string, password: string}>, res: Response) => {

        const user: userOutputType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token = jwtService.createJWT(user)
                res.status(200).send(token)
            } else {
                res.sendStatus(401)
            }
})
authRouter.post('/registration-confirmation',
    registrationConfirmationTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},registrationConformationType>, res: Response) => {

        const mailConfirmed: boolean = await usersService.confirmEmailByCode(req.body.code)

        if (mailConfirmed) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    })
authRouter.post('/registration-email-resending',
    registrationResendingConfirmationTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},registrationResendingConformationType>, res: Response) => {

        const mailSend: boolean = await usersService.resendConfirmationCodeOnEmail(req.body.email)

        if (mailSend) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }

    })
authRouter.post('/registration',
    userTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},dataRegistrationType>, res: Response) => {

        const emailOrPasswordIsUsed = await usersService.userWithEmailAndPasswordExist(req.body.email,req.body.password)

        if (emailOrPasswordIsUsed){
            return res.sendStatus(400)
        }

        const user = await usersService.createUser(req.body.login,req.body.email,req.body.password)

        if (user){
            res.sendStatus(204)
        }else {
            res.sendStatus(400)
        }
    })
authRouter.get('/me',
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
