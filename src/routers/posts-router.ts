import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {postsRepository} from "../repositories/posts-repository";

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {

    const foundProducts = postsRepository.findAllPosts()
    res.send(foundProducts);

})