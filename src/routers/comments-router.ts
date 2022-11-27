import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {commentsService} from "../domain/comments-service";
import {authMiddleware} from "../middlewares/authorization-middleware";
import {commentParamsValidation, commentValidationOwnerID} from "../middlewares/input-comments-validation-middleware";

export const commentsRouter = Router({});

commentsRouter.get('/:id',
    async (req: Request<{},{},{}>, res: Response) => {


})

commentsRouter.post('/:id',
    async (req: Request<{},{},{}>, res: Response) => {


})

commentsRouter.delete('/:id',
    authMiddleware,
    commentParamsValidation,
    commentValidationOwnerID,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await commentsService.deleteCommentByID(req.params.id, req.body.user)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})