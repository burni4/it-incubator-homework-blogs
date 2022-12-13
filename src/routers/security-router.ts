import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {refreshTokenVerification} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
        checkIsAUserDevice,
        deviceParamsValidation,
        deviceSessionExist
} from "../middlewares/input-device-validation-middleware";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenVerification,
    async (req: Request, res: Response) => {
        const foundDevices = await usersService.findUserDevicesByRefreshToken(req.cookies?.refreshToken)
        res.status(200).send(foundDevices)
})

securityRouter.delete('/devices',
    refreshTokenVerification,
    async (req: Request, res: Response) => {
        await  usersService.deleteAllSessionsExceptOne(req.cookies?.refreshToken)
        res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId',
    deviceParamsValidation,
    deviceSessionExist,
    refreshTokenVerification,
    checkIsAUserDevice,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {


        const sessionDeleted = await usersService.deleteSession(req.cookies.refreshToken)

        if (!sessionDeleted) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)

})
