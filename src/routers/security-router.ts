import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {refreshTokenVerification} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {deviceParamsValidation} from "../middlewares/input-device-validation-middleware";

export const securityRouter = Router({})

securityRouter.get('/devices',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const foundDevices = usersService.findUserDevicesByRefreshToken(req.cookies?.refreshToken)
        res.status(200).send(foundDevices)
})

securityRouter.delete('/devices',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const result = await  usersService.deleteAllSessionsExceptOne(req.cookies?.refreshToken)
        res.status(204)
})

securityRouter.delete('/devices/:deviceId',
    deviceParamsValidation,
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const result: boolean = await usersService.checkIsAUserDevice(req.cookies?.refreshToken, req.params.deviceId)
        if (!result) {
            return res.status(403)
        }

        const sessionDeleted = usersService.deleteSession(req.cookies?.refreshToken)

        if (!sessionDeleted) {
            return res.status(404)
        }

        res.status(204)

})
