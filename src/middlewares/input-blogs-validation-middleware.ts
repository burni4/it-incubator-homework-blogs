import {Request,Response,NextFunction} from "express";
import {body} from "express-validator";
import {messageRepository} from "../repositories/messages-repository";

export const blogTypeValidation = [
    body('name').exists({checkFalsy: true}).withMessage('The field [Name] must exist')
        .bail().isLength({max: 15}).withMessage('Name length should be max 15 symbols'),
    body('youtubeUrl').exists({checkFalsy: true}).withMessage('The field [youtubeUrl] must exist')
        .bail().isLength({max: 300}).withMessage('URL length should be max 300 symbols')
        .bail().matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('URL not valid')
]





