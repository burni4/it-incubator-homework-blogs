import {body, param} from "express-validator";
export const deviceParamsValidation = [
    param('deviceId').exists({checkFalsy: true}).withMessage('Param [deviceId] not found')
]




