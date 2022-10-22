import {Request,Response,NextFunction} from "express";
import {body} from "express-validator";
import {messageRepository} from "../repositories/messages-repository";

export const blogTypeValidation = () => {
    body('name').isLength({max: 15}).withMessage('Title length should be max 15 symbols'),
    body('youtubeUrl').isLength({max: 300}).withMessage('Title length should be max 300 symbols')
}





