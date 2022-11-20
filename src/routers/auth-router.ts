import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {authTypeValidation} from "../middlewares/input-auth-validation-middleware";
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('/login',
    authTypeValidation,
    inputValidationMiddleware,
    async (req: Request<{},{},{loginOrEmail: string, password: string}>, res: Response) => {

        const checkResult: boolean = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
            if (checkResult) {
                    res.sendStatus(204)
            } else {
                    res.sendStatus(401)
            }
})
