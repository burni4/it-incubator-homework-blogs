import {body, param} from "express-validator";

export const blogTypeValidation = [
    body('name').trim().exists({checkFalsy: true}).withMessage('The field [Name] must exist')
        .bail().isLength({max: 15}).withMessage('Name length should be max 15 symbols'),
    body('youtubeUrl').trim().exists({checkFalsy: true}).withMessage('The field [youtubeUrl] must exist')
        .bail().isLength({max: 100}).withMessage('URL length should be max 100 symbols')
        .bail().matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('URL not valid')
]

export const blogParamsValidation = [
    param('id').exists({checkFalsy: true}).withMessage('Param [id] not found')
]




