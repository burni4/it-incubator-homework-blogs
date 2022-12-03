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

    const user = await usersService.findUserByConfirmationCode(req.body.login)

    if (!user) {
        res.sendStatus(400).send({errorsMessages: [{message: 'Code not exist', field:'code'}]});
        return
    }

    next()
}
export const validationOfConfirmedUserByEmail = async (req: Request, res: Response, next: NextFunction) => {

    const user: userDBType | null = await usersService.findByLoginOrEmail(req.body.email)

    if (!user) {
        res.sendStatus(400).send({errorsMessages: [{message: 'User not exist', field:'user'}]});
        return
    }
    if (user.emailConfirmation.isConfirmed) {
        res.sendStatus(400).send({errorsMessages: [{message: 'Email already confirmed', field:'isConfirmed'}]});
        return
    }

    next()
}





