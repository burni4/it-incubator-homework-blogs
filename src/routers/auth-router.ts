import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {
    authTypeValidation,
    registrationConfirmationTypeValidation,
    registrationResendingConfirmationTypeValidation, validationOfConfirmedUserByEmail, validationOfExistingUsersByCode
} from "../middlewares/input-auth-validation-middleware";
import {usersService} from "../domain/users-service";
import {userDBType, userOutputType} from "../projectTypes";
import {jwtService} from "../application/jwtService";
import {authMiddleware, refreshTokenVerification} from "../middlewares/authorization-middleware";
import {userTypeValidation, validationOfExistingUsers} from "../middlewares/input-users-validation-middleware";

export const authRouter = Router({})

authRouter.post('/login',
    authTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},{loginOrEmail: string, password: string}>, res: Response) => {

        const user: userOutputType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (user) {
                const token = jwtService.createAccessJWT(user)
                const refreshToken = jwtService.createRefreshJWT(user)
                await usersService.updateRefreshToken(user.id, refreshToken)
                res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    .status(200).send(token)
            } else {
                res.sendStatus(401)
            }
})
authRouter.post('/refresh-token',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const user: userDBType | null = await usersService.findByRefreshToken(req.cookies?.refreshToken)

        if (!user) {
            res.sendStatus(401)
            return
        }

        const useOutput: userOutputType = {id: user.id,
            email: user.accountData.email,
            login: user.accountData.login,
            createdAt: user.accountData.createdAt}

        const token = jwtService.createAccessJWT(useOutput)
        const refreshToken = jwtService.createRefreshJWT(useOutput)
        await usersService.updateRefreshToken(user.id, refreshToken)
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
            .status(200).send(token)
    })
authRouter.post('/logout',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const user = await usersService.findByRefreshToken(req.cookies?.refreshToken)
        if (!user){
            res.status(401)
        }else{
            await usersService.updateRefreshToken(user.id,'')
            res.clearCookie("refreshToken").status(204)
        }



})
authRouter.post('/registration-confirmation',
    registrationConfirmationTypeValidation,
    validationOfExistingUsersByCode,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const mailConfirmed: boolean = await usersService.confirmEmailByCode(req.body.code)

        if (mailConfirmed) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }
    })
authRouter.post('/registration-email-resending',
    registrationResendingConfirmationTypeValidation,
    validationOfConfirmedUserByEmail,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const mailSend: boolean = await usersService.resendConfirmationCodeOnEmail(req.body.email)

        if (mailSend) {
            res.sendStatus(204)
        }else{
            res.sendStatus(400)
        }

    })
authRouter.post('/registration',
    userTypeValidation,
    validationOfExistingUsers,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

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