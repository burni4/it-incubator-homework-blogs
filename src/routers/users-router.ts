import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {usersService} from "../domain/users-service";
import {basicAuthMiddleware} from "../middlewares/authorization-middleware";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: Request<{},{},{}>, res: Response) => {

    res.send(200)

})

usersRouter.post('/',
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        res.status(201);

})

usersRouter.delete('/:id',
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await usersService.deleteUserByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})