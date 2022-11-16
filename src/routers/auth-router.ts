import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"

export const authRouter = Router({});

authRouter.post('/login',
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        res.status(201);

})
