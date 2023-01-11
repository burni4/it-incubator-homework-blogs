import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {userDBType} from "../projectTypes";
import {usersRepositoryInDB} from "../repositories/users-repository";

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

export const passwordRecoveryTypeValidation = [
    body('email').trim().exists({checkFalsy: true}).withMessage('The field [Email] must exist')
        .bail().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email not valid')
]

export const newPasswordTypeValidation = [
    body('newPassword').exists({checkFalsy: true}).withMessage('The field [newPassword] must exist')
        .bail().isLength({min: 6, max: 20}).withMessage('New password length should be min 6 and max 20 symbols'),
    body('recoveryCode').exists({checkFalsy: true}).withMessage('The field [recoveryCode] must exist')
]

export const validationRecoveryCode = async (req: Request, res: Response, next: NextFunction) => {

    const errors: any = []
    const codeIsValid: boolean = await usersRepositoryInDB.recoveryCodeIsValid(req.body.recoveryCode)
    if (!errors) errors.push({message: 'recovery code not valid', field: "recoveryCode"})
    if (errors.length < 1) return next()
    res.status(400).send({"errorsMessages": errors})

}

export const validationOfExistingUsersByCode = async (req: Request, res: Response, next: NextFunction) => {

    const errors = []
    const user: userDBType | null = await usersService.findUserByConfirmationCode(req.body.code)
    if (!user) errors.push({message: 'Code not exist', field: "code"})
    if (user && user.emailConfirmation.isConfirmed) errors.push({message: 'Email already confirmed', field: "code"})
    if (errors.length < 1) return next()
    res.status(400).send({"errorsMessages": errors})

}
export const validationOfConfirmedUserByEmail = async (req: Request, res: Response, next: NextFunction) => {

    const errors = []
    const user:userDBType | null = await usersService.findByLoginOrEmail(req.body.email)
    if (!user) errors.push({message: 'login is already exist', field: "email"})
    if (user && user.emailConfirmation.isConfirmed) errors.push({message: 'Email already confirmed', field: "email"})
    if (errors.length < 1) return next()
    res.status(400).send({"errorsMessages": errors})
}






