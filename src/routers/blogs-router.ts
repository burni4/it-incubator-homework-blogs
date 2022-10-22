import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogsRepository} from "../repositories/blogs-repository"
import {blogTypeValidation} from "../middlewares/input-blogs-validation-middleware"
import {authorizationMiddleware} from "../middlewares/authorization-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', (req: Request, res: Response) => {

    const foundProducts = blogsRepository.findAllBlogs();
    res.send(foundProducts);

})

blogsRouter.get('/:id', (req: Request, res: Response) => {

    const blog = blogsRepository.findBlogByID(req.params.id)
    if (blog) {
        res.send(blog);
    } else {
        res.send(404);
    }

})

blogsRouter.post('/',
    authorizationMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

    const newBlog = blogsRepository.createBlog(req.body)

    res.status(201).send(newBlog);

})

blogsRouter.put('/:id',
    authorizationMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const isUpdated = blogsRepository.updateBlogByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})

blogsRouter.delete('/:id',
    authorizationMiddleware,
    (req: Request, res: Response) => {

    const isDeleted = blogsRepository.deleteBlogByID(req.params.id)
    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
})