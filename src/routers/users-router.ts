import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {usersService} from "../domain/users-service";
import {basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {userTypeValidation} from "../middlewares/input-users-validation-middleware";
import {userInputType, userOutputType} from "../projectTypes";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuthMiddleware,
    inputValidationMiddleware,
    async (req: Request<{},{},{}>, res: Response) => {

    res.send(200)

})

usersRouter.post('/',
    basicAuthMiddleware,
    userTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},userInputType>, res: Response) => {

        const newUser: userOutputType | null = await usersService.createUser(req.body.login, req.body.email, req.body.password)

        res.status(201).send(newUser);

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