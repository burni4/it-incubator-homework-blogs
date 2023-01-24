import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {commentsService} from "../domain/comments-service";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(@inject(PostsService) protected postsService: PostsService) {
    }

    async findAllPosts(req: Request, res: Response) {

        const foundPosts = await this.postsService.findAllPosts(req.query as any,undefined, req.body.user)
        res.send(foundPosts);

    }
    async findPostByID(req: Request, res: Response) {

        const post = await this.postsService.findPostByID(req.params.id, req.body.user)
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

    async setLikeStatus(req: Request, res: Response) {

        const post = await this.postsService.findPostByID(req.params.id)

        if(!post){
            res.sendStatus(404)
            return
        }

        const result = await this.postsService.setLikeStatus(req.body.likeStatus,req.params.id, req.body.user)

        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }

    }

}