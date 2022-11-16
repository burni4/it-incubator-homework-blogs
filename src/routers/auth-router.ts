import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {authTypeValidation} from "../middlewares/input-auth-validation-middleware";

export const authRouter = Router({});

authRouter.post('/login',
    authTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        res.status(201);

})
