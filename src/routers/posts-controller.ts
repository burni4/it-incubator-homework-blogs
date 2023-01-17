import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {queryPostParams} from "../projectTypes";
import {commentsService} from "../domain/comments-service";

export class PostsController {
    constructor(protected postsService: PostsService) {
    }

    async findAllPosts(req: Request<{}, {}, {}, queryPostParams>, res: Response) {

        const foundProducts = await this.postsService.findAllPosts(req.query)
        res.send(foundProducts);

    }
    async findPostByID(req: Request, res: Response) {

        const post = await this.postsService.findPostByID(req.params.id)
        if (post) {
            res.send(post);
        } else {
            res.send(404);
        }

    }
    async deletePostByID(req: Request, res: Response) {

        const isDeleted = await this.postsService.deletePostByID(req.params.id)
        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

    }
    async createPost(req: Request, res: Response) {

        const newPost = await this.postsService.createPost(req.body)

        if(!newPost){
            return res.status(400)
        }

        res.status(201).send(newPost);

    }
    async createComment(req: Request, res: Response) {

        const post = await this.postsService.findPostByID(req.params.id)

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

    }

    async findAllCommentsByPostID(req: Request, res: Response) {

        const post = await this.postsService.findPostByID(req.params.id)

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

    }
    async updatePostByID(req: Request, res: Response) {

        const isUpdated = await this.postsService.updatePostByID(req.params.id, req.body)

        if (isUpdated) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
}