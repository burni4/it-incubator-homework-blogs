import {body} from "express-validator";

export const postTypeValidation = [
    body('title').trim().exists({checkFalsy: true}).withMessage('The field [title] must exist')
        .bail().isLength({max: 30}).withMessage('Name length should be max 30 symbols'),
    body('shortDescription').trim().exists({checkFalsy: true}).withMessage('The field [shortDescription] must exist')
        .bail().isLength({max: 100}).withMessage('Name length should be max 100 symbols'),
    body('content').trim().exists({checkFalsy: true}).withMessage('The field [content] must exist')
        .bail().isLength({max: 1000}).withMessage('Name length should be max 1000 symbols'),
    body('blogId').exists({checkFalsy: true}).withMessage('The field [blogId] must exist')
]





