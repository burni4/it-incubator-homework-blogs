import {CommentsModelClass} from "./db";
import {
    commentDBType,
    commentInputType,
    commentOutputType,
    LikesInfoOutputType,
    LikeStatus,
    outputCommentsWithPaginatorType,
    queryCommentParams
} from "../projectTypes";

export const commentsRepositoryInDB = {
    async findCommentByID(idFromDB: string): Promise<commentOutputType | null>{
        const foundCommentInDB: commentDBType | null = await CommentsModelClass.findOne({ id : idFromDB }, {projection:{_id:0}})
        if(!foundCommentInDB){
            return null
        }
        return {
            id: foundCommentInDB.id,
            content: foundCommentInDB.content,
            userId: foundCommentInDB.userId,
            userLogin: foundCommentInDB.userLogin,
            createdAt: foundCommentInDB.createdAt,
            likesInfo: await this.getCommentLikesInfo(foundCommentInDB.userId,foundCommentInDB.id)
        }
    },
    async createComment(newComment: commentDBType): Promise<commentDBType | null> {
        const newObjectComment: commentDBType = Object.assign({}, newComment);
        await CommentsModelClass.create(newComment)

        return newObjectComment
    },
    async updateCommentByID(id: string, comment: commentInputType): Promise<boolean> {
        const result = await CommentsModelClass.updateOne({id: id}, {$set: {content: comment.content}})
        return result.matchedCount === 1
    },
    async deleteCommentByID(id: string): Promise<boolean> {
        const result = await CommentsModelClass.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await CommentsModelClass.deleteMany({})
        return !!result.deletedCount
    },
    async findAllCommentsByPostID(paginator: queryCommentParams, postId: string): Promise<outputCommentsWithPaginatorType> {

        const filter = {postId: postId}

        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundCommentsInDB = await CommentsModelClass.find(filter, {projection:{_id:0}}).lean()
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize);

        const totalCount = await CommentsModelClass.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const commentsArray = foundCommentsInDB

        const outputComments: outputCommentsWithPaginatorType = {
            pagesCount: pageCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: totalCount,
            items: await Promise.all(commentsArray.map(async (comment) => {
                return {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt,
                    likesInfo: await this.getCommentLikesInfo(comment.userId,comment.id)
                }
            }))
        }
        return outputComments
    },
    async likeTheComment(userId: string, commentId: string): Promise<boolean> {

        const commentInstance = await CommentsModelClass.findOne({id: commentId})

        if (!commentInstance) return false

        const likeIndex = commentInstance.likedUsersId.indexOf(userId)

        if(likeIndex < 0){
            commentInstance.likedUsersId.push(userId)
        }else {
            commentInstance.likedUsersId.splice(likeIndex, 1)
        }

        const dislikeIndex = commentInstance.dislikedUsersId.indexOf(userId)

        if(dislikeIndex >= 0){
            commentInstance.likedUsersId.splice(likeIndex, 1)
        }

        await commentInstance.save()

        return true
    },
    async dislikeTheComment(userId: string, commentId: string): Promise<boolean> {

        const commentInstance = await CommentsModelClass.findOne({id: commentId})

        if (!commentInstance) return false

        const dislikeIndex = commentInstance.dislikedUsersId.indexOf(userId)

        if(dislikeIndex < 0){
            commentInstance.likedUsersId.push(userId)
        }else {
            commentInstance.likedUsersId.splice(dislikeIndex, 1)
        }

        const likeIndex = commentInstance.likedUsersId.indexOf(userId)

        if(likeIndex >= 0){
            commentInstance.likedUsersId.splice(likeIndex, 1)
        }

        await commentInstance.save()

        return true
    },
    async removeLikeAndDislike(userId: string, commentId: string): Promise<boolean> {

        const commentInstance = await CommentsModelClass.findOne({id: commentId})

        if (!commentInstance) return false

        const likeIndex = commentInstance.likedUsersId.indexOf(userId)

        if(likeIndex >= 0){
            commentInstance.likedUsersId.splice(likeIndex, 1)
        }

        const dislikeIndex = commentInstance.dislikedUsersId.indexOf(userId)

        if(dislikeIndex >= 0){
            commentInstance.likedUsersId.splice(likeIndex, 1)
        }
        await commentInstance.save()

        return true
    },
    async getCommentLikesInfo(userId: string, commentId: string): Promise<LikesInfoOutputType> {

        let likesInfo: LikesInfoOutputType = {likesCount: 0, dislikesCount: 0, myStatus: LikeStatus.None}

        const commentInstance = await CommentsModelClass.findOne({id: commentId})

        if (!commentInstance) return likesInfo

        likesInfo.likesCount = commentInstance.likedUsersId.length
        likesInfo.dislikesCount = commentInstance.dislikedUsersId.length

        const likeIndex = commentInstance.likedUsersId.indexOf(userId)
        const dislikeIndex = commentInstance.dislikedUsersId.indexOf(userId)

        if(likeIndex >= 0){
            likesInfo.myStatus = LikeStatus.Like
        }else if(dislikeIndex >= 0){
            likesInfo.myStatus = LikeStatus.Dislike
        }

        return likesInfo
    }
}