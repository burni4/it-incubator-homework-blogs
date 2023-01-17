import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {commentsService} from "../domain/comments-service";
import {authMiddleware, authMiddlewareGetUser} from "../middlewares/authorization-middleware";
import {
    commentParamsValidation,
    commentTypeValidation,
    commentValidationOwnerID, likeStatusTypeValidation
} from "../middlewares/input-comments-validation-middleware";
import {commentOutputType} from "../projectTypes";

export const commentsRouter = Router({});

commentsRouter.get('/:id',
    //authMiddlewareGetUser,
    commentParamsValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        let userId: string = ''

        if(req.body.user){
            userId = req.body.user.id
        }

        const foundComment: commentOutputType | null = await commentsService.findCommentByID(req.params.id, userId);

        if(!foundComment){
            res.sendStatus(404);
        }else {
            res.send(foundComment);
        }
})

commentsRouter.put('/:id',
    authMiddleware,
    commentParamsValidation,
    commentTypeValidation,
    commentValidationOwnerID,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const foundComment: commentOutputType | null = await commentsService.findCommentByID(req.params.id);

        if(!foundComment) {
            res.sendStatus(404);
            return
        }

        const isUpdated = await commentsService.updateCommentByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})

commentsRouter.delete('/:id',
    authMiddleware,
    commentParamsValidation,
    commentValidationOwnerID,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const foundComment: commentOutputType | null = await commentsService.findCommentByID(req.params.id);

        if(!foundComment) {
            res.sendStatus(404);
            return
        }

        const isDeleted = await commentsService.deleteCommentByID(req.params.id, req.body.user)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})
commentsRouter.put('/:id/like-status',
    authMiddleware,
    commentParamsValidation,
    likeStatusTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const foundComment: commentOutputType | null = await commentsService.findCommentByID(req.params.id);

        if(!foundComment) {
            res.sendStatus(404);
            return
        }

        const result = await commentsService.setLikeStatus(req.body.likeStatus,req.params.id, req.body.user.id)

        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})