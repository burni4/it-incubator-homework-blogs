import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {
    authTypeValidation, newPasswordTypeValidation, passwordRecoveryTypeValidation,
    registrationConfirmationTypeValidation,
    registrationResendingConfirmationTypeValidation, validationOfConfirmedUserByEmail, validationOfExistingUsersByCode
} from "../middlewares/input-auth-validation-middleware";
import {usersService} from "../domain/users-service";
import {generatedTokensType, userOutputType} from "../projectTypes";
import {jwtService} from "../application/jwtService";
import {authMiddleware, refreshTokenVerification} from "../middlewares/authorization-middleware";
import {userTypeValidation, validationOfExistingUsers} from "../middlewares/input-users-validation-middleware";
import {ipVerification} from "../middlewares/ip-verification-middleware";

export const authRouter = Router({})

authRouter.post('/login',
    ipVerification,
    authTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, { loginOrEmail: string, password: string }>, res: Response) => {

        const ip = req.ip //|| req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const userAgent = req.headers['user-agent'] || 'unknown device'

        const user: userOutputType | null = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {

            const tokens: generatedTokensType | null = await jwtService.generateNewTokens(user.id, ip, userAgent)

            if (!tokens) return res.sendStatus(401)

            res.cookie("refreshToken", tokens.refreshToken, {httpOnly: true, secure: true})
                .status(200).send({accessToken: tokens.accessToken})
        } else {
            res.sendStatus(401)
        }
    })
authRouter.post('/refresh-token',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const tokens: generatedTokensType | null = await jwtService.updateRefreshToken(req.cookies.refreshToken)

        if (!tokens) return res.sendStatus(401)

        res.cookie("refreshToken", tokens.refreshToken, {httpOnly: true, secure: true})
            .status(200).send({accessToken: tokens.accessToken})
    })
authRouter.post('/logout',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const result: boolean = await usersService.deleteSession(req.cookies.refreshToken)

        if (!result) {
            return res.sendStatus(401)
        }

        res.clearCookie("refreshToken")
        return res.sendStatus(204)

    })
authRouter.post('/registration-confirmation',
    ipVerification,
    registrationConfirmationTypeValidation,
    validationOfExistingUsersByCode,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const mailConfirmed: boolean = await usersService.confirmEmailByCode(req.body.code)

        if (mailConfirmed) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })
authRouter.post('/registration-email-resending',
    ipVerification,
    registrationResendingConfirmationTypeValidation,
    validationOfConfirmedUserByEmail,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const mailSend: boolean = await usersService.resendConfirmationCodeOnEmail(req.body.email)

        if (mailSend) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }

    })
authRouter.post('/registration',
    ipVerification,
    userTypeValidation,
    validationOfExistingUsers,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)

        if (user) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })

authRouter.post('/password-recovery',
    ipVerification,
    passwordRecoveryTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, {email: string}>, res: Response) => {

        const mailSend: boolean = await usersService.sendPasswordRecoveryCodeOnEmail(req.body.email)

        if (mailSend) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }

    })
authRouter.post('/new-password',
    ipVerification,
    newPasswordTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, {newPassword: string, recoveryCode: string}>, res: Response) => {

        const passwordUpdated: boolean = await usersService.updatePasswordByRecoveryCode(req.body.newPassword, req.body.recoveryCode)

        if (passwordUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(400)
        }
    })
authRouter.get('/me',
    authMiddleware,
    inputValidationMiddleware,
    async (req: Request<{}, {}, { user: userOutputType }>, res: Response) => {

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