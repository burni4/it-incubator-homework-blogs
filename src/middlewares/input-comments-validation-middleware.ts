import {body, param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {commentsService} from "../domain/comments-service";


export const commentTypeValidation = [
    body('content').trim().exists({checkFalsy: true}).withMessage('The field [Content] must exist')
        .bail().isLength({min: 20, max: 300}).withMessage('Content length should be min 20, max 300 symbols'),
]
export const commentParamsValidation = [
    param('id').exists({checkFalsy: true}).withMessage('Param [id] not found')
]

export const commentValidationOwnerID = (req: Request, res: Response, next: NextFunction) => body('user').exists({checkFalsy: true}).withMessage('The field [user] must exist')
    .bail().custom(async (value) => {
        const result: boolean = await commentsService.checkOwnerComment(value, req.params.id)
        if (!result) {
            res.sendStatus(403);
            return false
            //throw new Error('Trying to delete a comment that is not your own');
        }
        return true;
    })


