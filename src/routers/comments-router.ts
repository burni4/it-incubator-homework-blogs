import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {usersService} from "../domain/users-service";

export const commentsRouter = Router({});

commentsRouter.get('/:id',
    async (req: Request<{},{},{}>, res: Response) => {


})

commentsRouter.post('/:id',
    async (req: Request<{},{},{}>, res: Response) => {


})

commentsRouter.delete('/:id',
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await usersService.deleteUserByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})