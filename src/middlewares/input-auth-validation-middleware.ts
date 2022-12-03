import {body} from "express-validator";

export const authTypeValidation = [
    body('loginOrEmail').exists({checkFalsy: true}).withMessage('The field [Login] must exist'),
    body('password').exists({checkFalsy: true}).withMessage('The field [Password] must exist')
]
export const registrationConfirmationTypeValidation = [
    body('code').exists({checkFalsy: true}).withMessage('The field [Code] must exist'),
]
export const registrationResendingConfirmationTypeValidation = [
    body('email').trim().exists({checkFalsy: true}).withMessage('The field [Email] must exist')
        .bail().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email not valid')
]




