import {Request,Response,NextFunction} from "express";
import {validationResult} from "express-validator";
import {messageRepository} from "../repositories/messages-repository";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction)  => {

    const errors = messageRepository.convertErrorMessagesFromValidationResult(validationResult(req));

    if (errors.errorsMessages.length !== 0) {
        res.status(400).send(errors);
    }else{
        next()
    }
}