import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {errorsMessages, messageRepository} from "../repositories/messages-repository";
import {usersService} from "../domain/users-service";
import {userDBType} from "../projectTypes";

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

export const validationOfExistingUsersByCode = async (req: Request, res: Response, next: NextFunction) => {

    const errors = []
    const user: userDBType | null = await usersService.findUserByConfirmationCode(req.body.code)
    if (!user) errors.push({message: 'code not exist', field: "code"})
    if (user && user.emailConfirmation.isConfirmed) errors.push({message: 'Email already confirmed', field: "isConfirmed"})
    if (errors.length < 1) return next()
    res.status(400).send({"errorsMessages": errors})

}
export const validationOfConfirmedUserByEmail = async (req: Request, res: Response, next: NextFunction) => {

    const errors = []
    const user:userDBType | null = await usersService.findByLoginOrEmail(req.body.email)
    if (!user) errors.push({message: 'login is already exist', field: "email"})
    if (user && user.emailConfirmation.isConfirmed) errors.push({message: 'Email already confirmed', field: "isConfirmed"})
    if (errors.length < 1) return next()
    res.status(400).send({"errorsMessages": errors})
}





