import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"

export const usersRouter = Router({});

usersRouter.get('/', async (req: Request<{},{},{}>, res: Response) => {

    res.send(200)

})

usersRouter.post('/',
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        res.status(201);

})

usersRouter.delete('/:id',
    async (req: Request, res: Response) => {

    res.sendStatus(204);

})