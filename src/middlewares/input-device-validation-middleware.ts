import {param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";
export const deviceParamsValidation = [
    param('deviceId').exists({checkFalsy: true}).withMessage('Param [deviceId] not found')
]

export const deviceSessionExist = async (req: Request, res: Response, next: NextFunction) => {

    const session = await usersService.findSessionByDeviceID(req.cookies?.refreshToken)

    if (session) return next()

    return res.status(404)

    const result: boolean = await usersService.checkIsAUserDevice(req.cookies?.refreshToken, req.params.deviceId)
    if (result) return next()

    res.status(403)

}




