import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {authorizationMiddleware, basicAuthMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postTypeValidation} from "../middlewares/input-posts-validation-middleware";

export const postsRouter = Router({});

postsRouter.get('/', async (req: Request, res: Response) => {

    const foundProducts = await postsRepository.findAllPosts()
    res.send(foundProducts);

})

postsRouter.get('/:id', async (req: Request, res: Response) => {

    const post = await postsRepository.findPostByID(req.params.id)
    if (post) {
        res.send(post);
    } else {
        res.send(404);
    }

})

postsRouter.delete('/:id',
    basicAuthMiddleware,
    async (req: Request, res: Response) => {

        const isDeleted = await postsRepository.deletePostByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    })

postsRouter.post('/',
    basicAuthMiddleware,
    postTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const newPost = await postsRepository.createPost(req.body)

        res.status(201).send(newPost);

    })

postsRouter.put('/:id',
    basicAuthMiddleware,
    postTypeValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const isUpdated = await postsRepository.updatePostByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

    })