import {commentsRepositoryInDB} from "../repositories/comments-repository";
import {
    commentDBType,
    commentInputType,
    commentOutputType, outputCommentsWithPaginatorType,
    queryCommentParams,
    userOutputType
} from "../projectTypes";
import {postsRepositoryInDB} from "../repositories/posts-repository";

export const commentsService = {
    async deleteCommentByID(id: string, user: userOutputType): Promise<boolean>{
        return await commentsRepositoryInDB.deleteCommentByID(id)
    },
    async findCommentByID(id: string): Promise<commentOutputType | null>{
        return await commentsRepositoryInDB.findCommentByID(id)
    },
    async checkOwnerComment(user: userOutputType, commentId: string): Promise<boolean>{
        const result: commentOutputType | null = await this.findCommentByID(commentId)
        if(!result || result.userId !== user.id){
            return false
        }
        return true
    },
    async updateCommentByID(id: string, body: commentInputType): Promise<boolean>{
        return await commentsRepositoryInDB.updateCommentByID(id, body)
    },
    async createComment(user: userOutputType, body: commentInputType, postId: string): Promise<commentOutputType | null>{

        const foundPost = await postsRepositoryInDB.findPostByID(postId)

        if(!foundPost){
            return null
        }
        const newComment: commentDBType = {
            id: String(+new Date()),
            content : body.content,
            userId : user.id,
            userLogin : user.login,
            createdAt: new Date().toISOString(),
            postId: postId
        }

        const newCommentInDB = await commentsRepositoryInDB.createComment(newComment)

        if(!newCommentInDB){
            return  null
        }
        return {
            id: newCommentInDB.id,
            content : newCommentInDB.content,
            userId : newCommentInDB.userId,
            userLogin : newCommentInDB.userLogin,
            createdAt: newCommentInDB.createdAt
        }
    },
    async findAllCommentsByPostID(postId: string, queryParams: queryCommentParams): Promise<outputCommentsWithPaginatorType | null>{

        const foundPost = await postsRepositoryInDB.findPostByID(postId)

        if(!foundPost){
            return null
        }

        return await commentsRepositoryInDB.findAllCommentsByPostID(queryCommentParamsPaginator(queryParams), postId);
    },
}

const queryCommentParamsPaginator = (queryParams: queryCommentParams):queryCommentParams => {
    return {
        pageNumber: +queryParams.pageNumber || 1,
        pageSize: +queryParams.pageSize || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc'
    }
}