import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogsRepository} from "../repositories/blogs-repository"
import {blogTypeValidation} from "../middlewares/input-blogs-validation-middleware"
import {authorizationMiddleware} from "../middlewares/authorization-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {

    const foundProducts = await blogsRepository.findAllBlogs();
    res.send(foundProducts);

})

blogsRouter.get('/:id', async (req: Request, res: Response) => {

    const blog = await blogsRepository.findBlogByID(req.params.id)
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
    async (req: Request, res: Response) => {

        const newBlog = await blogsRepository.createBlog(req.body)

        res.status(201).send(newBlog);

    })

blogsRouter.put('/:id',
    authorizationMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isUpdated = await blogsRepository.updateBlogByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

    })

blogsRouter.delete('/:id',
    authorizationMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await blogsRepository.deleteBlogByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })