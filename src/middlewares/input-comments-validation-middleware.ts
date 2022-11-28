import {body, param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {commentsService} from "../domain/comments-service";
import {commentOutputType} from "../projectTypes";


export const commentTypeValidation = [
    body('content').trim().exists({checkFalsy: true}).withMessage('The field [Content] must exist')
        .bail().isLength({min: 20, max: 300}).withMessage('Content length should be min 20, max 300 symbols'),
]
export const commentParamsValidation = [
    param('id').exists({checkFalsy: true}).withMessage('Param [id] not found')
]

export const commentValidationOwnerID = async (req: Request, res: Response, next: NextFunction) => {

    const foundComment: commentOutputType | null = await commentsService.findCommentByID(req.params.id);

    if(!foundComment) {
        res.sendStatus(404);
        return
    }

    const result: boolean = await commentsService.checkOwnerComment(req.body.user, req.params.id)
    if (!result) {
        res.sendStatus(403);
        return
    }
    next()
}


