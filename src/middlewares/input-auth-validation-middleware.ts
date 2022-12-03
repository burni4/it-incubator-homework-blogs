import {body} from "express-validator";

export const authTypeValidation = [
    body('loginOrEmail').exists({checkFalsy: true}).withMessage('The field [Login] must exist'),
    body('password').exists({checkFalsy: true}).withMessage('The field [Password] must exist')
]
export const registrationConfirmationTypeValidation = [
    body('code').exists({checkFalsy: true}).withMessage('The field [Code] must exist'),
]




