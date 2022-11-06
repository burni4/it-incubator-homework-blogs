import {body, param} from "express-validator";
import {blogsRepositoryInDB} from "../repositories/blogs-repository";

export const postTypeValidation = [
    body('title').trim().exists({checkFalsy: true}).withMessage('The field [title] must exist')
        .bail().isLength({max: 30}).withMessage('Title length should be max 30 symbols'),
    body('blogId').exists({checkFalsy: true}).withMessage('The field [blogId] must exist')
        .bail().custom(async (value) => {
        const blog = await blogsRepositoryInDB.findBlogByID(value)
        if (!blog) {
            throw new Error('BlogID does not exist');
        }
        return true;
    }),
    body('shortDescription').trim().exists({checkFalsy: true}).withMessage('The field [shortDescription] must exist')
        .bail().isLength({max: 100}).withMessage('ShortDescription length should be max 100 symbols'),
    body('content').trim().exists({checkFalsy: true}).withMessage('The field [content] must exist')
        .bail().isLength({max: 1000}).withMessage('Content length should be max 1000 symbols'),

]
export const postParamsValidation = [
    param('id').exists({checkFalsy: true}).withMessage('Param [id] not found')
]




