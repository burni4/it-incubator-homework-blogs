import {Request,Response,NextFunction} from "express";
import {validationResult} from "express-validator";
import {messageRepository} from "../repositories/messages-repository";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction)  => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json(errors);
    }else{
        next()
    }
}