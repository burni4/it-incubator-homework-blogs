import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router({});

blogsRouter.get('/', (req: Request, res: Response) => {

    const foundProducts = blogsRepository.findAllBlogs();
    res.send(foundProducts);

})