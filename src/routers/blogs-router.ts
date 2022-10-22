import {Request, Response, Router} from "express";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogsRepository} from "../repositories/blogs-repository";
import {blogTypeValidation} from "../middlewares/input-blogs-validation-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', (req: Request, res: Response) => {

    const foundProducts = blogsRepository.findAllBlogs();
    res.send(foundProducts);

})

blogsRouter.get('/:id', (req: Request, res: Response) => {

    let blog = blogsRepository.findBlogByID(req.params.id)
    if (blog){
        res.send(blog);
    }else{
        res.send(404);
    }

})

blogsRouter.post('/',
    blogTypeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

})