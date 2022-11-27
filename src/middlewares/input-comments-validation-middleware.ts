import {body, param} from "express-validator";
import {commentsRepositoryInDB} from "../repositories/comments-repository";
import {NextFunction, Request, Response} from "express";



export const commentParamsValidation = [
    param('id').exists({checkFalsy: true}).withMessage('Param [id] not found')
]

export const commentValidationOwnerID = (req: Request, res: Response, next: NextFunction) => body('user').exists({checkFalsy: true}).withMessage('The field [user] must exist')
    .bail().custom(async (value) => {
        const result: boolean = await commentsRepositoryInDB.checkOwnerComment(value, req.params.id)
        if (!result) {
            res.sendStatus(403);
            return false
            //throw new Error('Trying to delete a comment that is not your own');
        }
        return true;
    })


