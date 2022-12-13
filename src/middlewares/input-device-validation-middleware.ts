import {param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";
export const deviceParamsValidation = [
    param('deviceId').exists({checkFalsy: true}).withMessage('Param [deviceId] not found')
]

export const deviceSessionExist = async (req: Request, res: Response, next: NextFunction) => {

    const session = await usersService.findSessionByDeviceID(req.cookies?.refreshToken)

    if (!session) return res.status(404)

    next()
}




