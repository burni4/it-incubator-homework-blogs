import {Request, Response, Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogParamsValidation, blogTypeValidation} from "../middlewares/input-blogs-validation-middleware"
import {basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {blogsService} from "../domain/blogs-service";
import {queryBlogParams, queryPostParams} from "../projectTypes";
import {postTypeValidation} from "../middlewares/input-posts-validation-middleware";

export const blogsRouter = Router({});

class BlogsController {
    async getBlogs(req: Request<{}, {}, {}, queryBlogParams>, res: Response) {
        const foundBlogs = await blogsService.findAllBlogs(req.query);
        res.send(foundBlogs);
    }

    async getAllPostsByBlogID(req: Request<{ id: string }, {}, {}, queryPostParams>, res: Response) {
        const foundPosts = await blogsService.findAllPostsByBlogID(req.params.id, req.query);

        if (!foundPosts) {
            res.sendStatus(404);
        } else {
            res.send(foundPosts);
        }
    }
    async getBlogByID(req: Request, res: Response) {

        const blog = await blogsService.findBlogByID(req.params.id)
        if (blog) {
            res.send(blog);
        } else {
            res.send(404);
        }
    }

    async createBlog(req: Request, res: Response) {
        const newBlog = await blogsService.createBlog(req.body)
        res.status(201).send(newBlog);
    }

    async createPostByBlogID(req: Request, res: Response) {

        const newBlog = await blogsService.createPostByBlogID(req.params.id, req.body)

        if (!newBlog) {
            res.sendStatus(404)
            return;
        } else {
            res.status(201).send(newBlog);
        }
    }
    async updateBlogByID(req: Request, res: Response) {
        const isUpdated = await blogsService.updateBlogByID(req.params.id, req.body)
        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
    async deleteBlogByID(req: Request, res: Response) {

        const isDeleted = await blogsService.deleteBlogByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
}
const blogsController = new BlogsController()

blogsRouter.get('/', blogsController.getBlogs)

blogsRouter.get('/:id/posts',
    blogParamsValidation,
    blogsController.getAllPostsByBlogID)

blogsRouter.get('/:id', blogsController.getBlogByID)

blogsRouter.post('/',
    basicAuthMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    blogsController.createBlog)

blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    blogParamsValidation,
    postTypeValidation,
    inputValidationMiddleware,
    blogsController.createPostByBlogID)

blogsRouter.put('/:id',
    basicAuthMiddleware,
    blogTypeValidation,
    inputValidationMiddleware,
    blogsController.updateBlogByID)

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    blogParamsValidation,
    blogsController.deleteBlogByID)