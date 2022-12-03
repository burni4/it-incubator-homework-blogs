import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {usersRepositoryInDB} from "../repositories/users-repository";
import {errorsMessages, messageRepository} from "../repositories/messages-repository";

export const userTypeValidation = [
    body('login').trim().exists({checkFalsy: true}).withMessage('The field [Login] must exist')
        .bail().isLength({min: 3, max: 10}).withMessage('Login length should be min 3 and max 10 symbols')
        .bail().matches('^[a-zA-Z0-9_-]*$').withMessage('Login not valid'),
    body('password').trim().exists({checkFalsy: true}).withMessage('The field [Password] must exist')
        .bail().isLength({min: 6, max: 20}).withMessage('Password length should be min 6 and max 20 symbols'),
    body('email').trim().exists({checkFalsy: true}).withMessage('The field [Email] must exist')
        .bail().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email not valid')
]
export const validationOfExistingUsers = async (req: Request, res: Response, next: NextFunction) => {

    const userByLogin = await usersRepositoryInDB.findByLogin(req.body.login)

    if (!userByLogin) {
        messageRepository.addMessage('login','Email or login already used')
        res.sendStatus(400).send(errorsMessages);
        return
    }

    const userByEmail = await usersRepositoryInDB.findByEmail(req.body.email)
    if (!userByEmail) {
        messageRepository.addMessage('email','Email or login already used')
        res.sendStatus(400).send(errorsMessages);
        return
    }

    next()
}



