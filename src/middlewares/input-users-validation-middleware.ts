import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {messageRepository} from "../repositories/messages-repository";

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

    const errors = []
    const userEmail = await usersService.findByEmail(req.body.email)
    const userLogin = await usersService.findByLogin(req.body.login)
    if (userEmail) errors.push({message: 'email is already exist', field: "email"})
    if (userLogin) errors.push({message: 'login is already exist', field: "login"})
    if (errors.length < 1) return next()
    res.status(400).send({"errorsMessages": errors})

}


