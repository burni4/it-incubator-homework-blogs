import {Router} from "express";
import {authMiddleware, authMiddlewareGetUser, basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    postParamsValidation,
    postTypeValidation,
    postTypeValidationBlogID
} from "../middlewares/input-posts-validation-middleware";
import {commentTypeValidation, likeStatusTypeValidation} from "../middlewares/input-comments-validation-middleware";
import {postsController} from "../composition-root";

export const postsRouter = Router({});

postsRouter.get('/',
    authMiddlewareGetUser,
    postsController.findAllPosts.bind(postsController))

postsRouter.get('/:id',
    authMiddlewareGetUser,
    postsController.findPostByID.bind(postsController))

postsRouter.delete('/:id',
    basicAuthMiddleware,
    postParamsValidation,
    postsController.deletePostByID.bind(postsController))

postsRouter.post('/',
    basicAuthMiddleware,
    postTypeValidationBlogID,
    postTypeValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController))

postsRouter.post('/:id/comments',
    authMiddleware,
    postParamsValidation,
    commentTypeValidation,
    inputValidationMiddleware,
    postsController.createComment.bind(postsController))

postsRouter.get('/:id/comments',
    authMiddlewareGetUser,
    postParamsValidation,
    postsController.findAllCommentsByPostID.bind(postsController))

postsRouter.put('/:id',
    basicAuthMiddleware,
    postTypeValidationBlogID,
    postTypeValidation,
    inputValidationMiddleware,
    postsController.updatePostByID.bind(postsController))

postsRouter.put('/:id/like-status',
    authMiddleware,
    postTypeValidation,
    likeStatusTypeValidation,
    inputValidationMiddleware,
    postsController.setLikeStatus.bind(postsController))