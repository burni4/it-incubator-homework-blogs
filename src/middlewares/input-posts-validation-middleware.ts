import {body, param} from "express-validator";
import {blogsRepositoryInDB} from "../repositories/blogs-repository";
import {NextFunction, Request, Response} from "express";
import {commentOutputType} from "../projectTypes";
import {commentsService} from "../domain/comments-service";
import {postsService} from "../composition-root";

export const postTypeValidation = [
    body('title').trim().exists({checkFalsy: true}).withMessage('The field [title] must exist')
        .bail().isLength({max: 30}).withMessage('Title length should be max 30 symbols'),
    body('shortDescription').trim().exists({checkFalsy: true}).withMessage('The field [shortDescription] must exist')
        .bail().isLength({max: 100}).withMessage('ShortDescription length should be max 100 symbols'),
    body('content').trim().exists({checkFalsy: true}).withMessage('The field [content] must exist')
        .bail().isLength({max: 1000}).withMessage('Content length should be max 1000 symbols'),

]

export const postTypeValidationBlogID = body('blogId').exists({checkFalsy: true}).withMessage('The field [blogId] must exist')
        .bail().custom(async (value) => {
        const blog = await blogsRepositoryInDB.findBlogByID(value)
        if (!blog) {
            throw new Error('BlogID does not exist');
        }
        return true;
    })

export const postParamsValidation = [
    param('id').exists({checkFalsy: true}).withMessage('Param [id] not found')
]

export const postValidationID = async (req: Request, res: Response, next: NextFunction) => {

    const foundPost = await postsService.findPostByID(req.params.id);

    if(!foundPost) {
        res.sendStatus(404);
        return
    }

    next()
}




