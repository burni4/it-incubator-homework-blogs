import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {authorizationMiddleware} from "../middlewares/authorization-middleware";
import {blogsRouter} from "./blogs-router";

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

blogsRouter.delete('/:id',
    authorizationMiddleware,
    (req: Request, res: Response) => {

        const isDeleted = postsRepository.deletePostByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
})