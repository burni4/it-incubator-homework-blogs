import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {refreshTokenVerification} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

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

        res.status(200)
})

securityRouter.delete('/devices/:deviceId',
    refreshTokenVerification,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

    res.status(200)

})
