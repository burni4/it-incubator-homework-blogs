import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogParamsValidation, blogTypeValidation} from "../middlewares/input-blogs-validation-middleware"
import {basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {BlogsService} from "../domain/blogs-service";
import {queryBlogParams, queryPostParams} from "../projectTypes";
import {postTypeValidation} from "../middlewares/input-posts-validation-middleware";
import {blogsController} from "../composition-root";

export const blogsRouter = Router({});

export class BlogsController {
    constructor(protected blogsService: BlogsService) {}

    async getBlogs(req: Request<{}, {}, {}, queryBlogParams>, res: Response) {
        const foundBlogs = await this.blogsService.findAllBlogs(req.query);
        res.send(foundBlogs);
    }

    async getAllPostsByBlogID(req: Request<{ id: string }, {}, {}, queryPostParams>, res: Response) {
        const foundPosts = await this.blogsService.findAllPostsByBlogID(req.params.id, req.query);

        if (!foundPosts) {
            res.sendStatus(404);
        } else {
            res.send(foundPosts);
        }
    }
    async getBlogByID(req: Request, res: Response) {

        const blog = await this.blogsService.findBlogByID(req.params.id)
        if (blog) {
            res.send(blog);
        } else {
            res.send(404);
        }
    }

    async createBlog(req: Request, res: Response) {
        const newBlog = await this.blogsService.createBlog(req.body)
        res.status(201).send(newBlog);
    }

    async createPostByBlogID(req: Request, res: Response) {

        const newBlog = await this.blogsService.createPostByBlogID(req.params.id, req.body)

        if (!newBlog) {
            res.sendStatus(404)
            return;
        } else {
            res.status(201).send(newBlog);
        }
    }
    async updateBlogByID(req: Request, res: Response) {
        const isUpdated = await this.blogsService.updateBlogByID(req.params.id, req.body)
        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
    async deleteBlogByID(req: Request, res: Response) {

        const isDeleted = await this.blogsService.deleteBlogByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
}

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.get('/:id/posts',
    blogParamsValidation,
    blogsController.getAllPostsByBlogID.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogByID.bind(blogsController))

blogsRouter.post('/',
    basicAuthMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    blogParamsValidation,
    postTypeValidation,
    inputValidationMiddleware,
    blogsController.createPostByBlogID.bind(blogsController))

blogsRouter.put('/:id',
    basicAuthMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    blogsController.updateBlogByID.bind(blogsController))

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    blogParamsValidation,
    blogsController.deleteBlogByID.bind(blogsController))