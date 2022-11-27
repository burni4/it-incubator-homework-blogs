import {commentsCollection} from "./db";
import {
    commentDBType,
    commentInputType,
    commentOutputType,outputCommentsWithPaginatorType, queryCommentParams
} from "../projectTypes";



export const commentsRepositoryInDB = {
    async findCommentByID(idFromDB: string): Promise<commentOutputType | null>{
        const foundCommentInDB: commentDBType | null = await commentsCollection.findOne({ id : idFromDB }, {projection:{_id:0}})
        if(!foundCommentInDB){
            return null
        }
        return {
            id: foundCommentInDB.id,
            content: foundCommentInDB.content,
            userId: foundCommentInDB.userId,
            userLogin: foundCommentInDB.userLogin,
            createdAt: foundCommentInDB.createdAt
        }
    },
    async createComment(newComment: commentDBType): Promise<commentDBType | null> {
        const newObjectComment: commentDBType = Object.assign({}, newComment);
        await commentsCollection.insertOne(newObjectComment)

        return newObjectComment
    },
    async updateCommentByID(id: string, comment: commentInputType): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set: {content: comment.content}})
        return result.matchedCount === 1
    },
    async deleteCommentByID(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await commentsCollection.deleteMany({})
        return !!result.deletedCount
    },
    async findAllCommentsByPostID(paginator: queryCommentParams, postId: string): Promise<outputCommentsWithPaginatorType> {

        const filter = {postId: postId}

        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundCommentsInDB = await commentsCollection.find(filter, {projection:{_id:0}})
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize);

        const totalCount = await commentsCollection.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const commentsArray = await foundCommentsInDB.toArray()

        const outputComments: outputCommentsWithPaginatorType = {
            pagesCount: pageCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: totalCount,
            items: commentsArray.map((comment) => {
                return {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt
                }
            })
        }
        return outputComments
    }
}