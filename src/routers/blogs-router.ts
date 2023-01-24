import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware"
import {blogParamsValidation, blogTypeValidation} from "../middlewares/input-blogs-validation-middleware"
import {authMiddlewareGetUser, basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {postTypeValidation} from "../middlewares/input-posts-validation-middleware";
import {blogsController} from "../composition-root";

export const blogsRouter = Router({});

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))

blogsRouter.get('/:id/posts',
    authMiddlewareGetUser,
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