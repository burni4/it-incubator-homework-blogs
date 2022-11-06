import {Request, Response, Router} from "express";
import {basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {
    postParamsValidation,
    postTypeValidation,
    postTypeValidationBlogID
} from "../middlewares/input-posts-validation-middleware";
import {postsService} from "../domain/posts-service";
import {queryPostParams} from "../projectTypes";

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