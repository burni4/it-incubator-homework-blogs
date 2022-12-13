import {param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {sessionsInfoRepositoryInDB} from "../repositories/sessionsInfo-repository";
export const deviceParamsValidation = [
    param('deviceId').exists({checkFalsy: true}).withMessage('Param [deviceId] not found')
]

export const deviceSessionExist = async (req: Request, res: Response, next: NextFunction) => {

    const result = await sessionsInfoRepositoryInDB.findSessionByDeviceID(req.params.deviceId)

    if (!result) {
        return res.sendStatus(404)
    }

    next()
}

export const checkIsAUserDevice = async (req: Request, res: Response, next: NextFunction) => {


    const result: boolean = await usersService.checkIsAUserDevice(req.cookies?.refreshToken, req.params.deviceId)
    if (!result) {
        return res.sendStatus(403)
    }

    next()
}



