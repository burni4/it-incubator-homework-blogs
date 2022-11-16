import {body} from "express-validator";

export const authTypeValidation = [
    body('login').exists({checkFalsy: true}).withMessage('The field [Login] must exist'),
    body('password').exists({checkFalsy: true}).withMessage('The field [Password] must exist')
]





