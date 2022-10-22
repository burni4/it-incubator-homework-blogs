import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {postTypeValidation} from "../middlewares/input-posts-validation-middleware";

export const postsRouter = Router({});

postsRouter.get('/', (req: Request, res: Response) => {

    const foundProducts = postsRepository.findAllPosts()
    res.send(foundProducts);

})

postsRouter.get('/:id', (req: Request, res: Response) => {

    const post = postsRepository.findPostByID(req.params.id)
    if (post) {
        res.send(post);
    } else {
        res.send(404);
    }

})

postsRouter.delete('/:id',
    authorizationMiddleware,
    (req: Request, res: Response) => {

        const isDeleted = postsRepository.deletePostByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
})

postsRouter.post('/',
    authorizationMiddleware,
    postTypeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const newPost = postsRepository.createPost(req.body)

        res.status(201).send(newPost);

})

postsRouter.put('/:id',
    authorizationMiddleware,
    postTypeValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const isUpdated = postsRepository.updatePostByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

})