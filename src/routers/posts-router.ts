import {Request, Response, Router} from "express";
import {authMiddleware, authMiddlewareGetUser, basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    postParamsValidation,
    postTypeValidation,
    postTypeValidationBlogID
} from "../middlewares/input-posts-validation-middleware";
import {postsService} from "../domain/posts-service";
import {commentOutputType, queryCommentParams, queryPostParams, userOutputType} from "../projectTypes";
import {commentTypeValidation, commentValidationOwnerID} from "../middlewares/input-comments-validation-middleware";
import {commentsService} from "../domain/comments-service";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request<{},{},{}, queryPostParams>, res: Response) => {

    const foundProducts = await postsService.findAllPosts(req.query)
    res.send(foundProducts);

})

postsRouter.get('/:id', async (req: Request, res: Response) => {

    const post = await postsService.findPostByID(req.params.id)
    if (post) {
        res.send(post);
    } else {
        res.send(404);
    }

})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    postParamsValidation,
    async (req: Request, res: Response) => {

        const isDeleted = await postsService.deletePostByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })

postsRouter.post('/',
    basicAuthMiddleware,
    postTypeValidationBlogID,
    postTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsService.createPost(req.body)

        if(!newPost){
            return res.status(400)
        }

        res.status(201).send(newPost);

    })

postsRouter.post('/:id/comments',
    authMiddleware,
    postParamsValidation,
    commentTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const post = await postsService.findPostByID(req.params.id)

        if(!post){
            res.sendStatus(404)
            return
        }

        const newComment = await commentsService.createComment(req.body.user, req.body, req.params.id)

        if(!newComment){
            res.sendStatus(400)
            return
        }

        res.status(201).send(newComment);

    })

postsRouter.get('/:id/comments',
    //authMiddlewareGetUser,
    postParamsValidation,
    async (req: Request, res: Response) => {

        const post = await postsService.findPostByID(req.params.id)

        if(!post){
            res.sendStatus(404)
            return
        }

        let userId: string = ''

        if(req.body.user){
            userId = req.body.user.id
        }

        const foundPosts = await commentsService.findAllCommentsByPostID(req.params.id, req.query as any, userId);

        if(!foundPosts){
            res.sendStatus(404);
        }else {
            res.send(foundPosts);
        }

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    postTypeValidationBlogID,
    postTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isUpdated = await postsService.updatePostByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

    })