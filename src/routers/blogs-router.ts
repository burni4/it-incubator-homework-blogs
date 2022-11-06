import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogParamsValidation, blogTypeValidation} from "../middlewares/input-blogs-validation-middleware"
import {basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {blogsService} from "../domain/blogs-service";

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {

    const foundProducts = await blogsService.findAllBlogs();
    res.send(foundProducts);

})

blogsRouter.get('/:id', async (req: Request, res: Response) => {

    const blog = await blogsService.findBlogByID(req.params.id)
    if (blog) {
        res.send(blog);
    } else {
        res.send(404);
    }

})

blogsRouter.post('/',
    basicAuthMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const newBlog = await blogsService.createBlog(req.body)

        res.status(201).send(newBlog);

    })

blogsRouter.put('/:id',
    basicAuthMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isUpdated = await blogsService.updateBlogByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

    })

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    blogParamsValidation,
    async (req: Request, res: Response) => {

        const isDeleted = await blogsService.deleteBlogByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })