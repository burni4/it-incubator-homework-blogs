import {CommentsModelClass, PostsModelClass} from "./db";
import {
    ExtendedLikesInfoOutputType,
    LikesInfoOutputType,
    LikeStatus, NewestLikesType,
    outputPostsWithPaginatorType,
    PostDBType,
    PostDBTypeOutputType,
    queryPostParams, userOutputType
} from "../projectTypes";
import {injectable} from "inversify";

@injectable()
export class PostsRepositoryInDB {
    async findAllPosts(paginator: queryPostParams, blogID?: string, user?: userOutputType): Promise<outputPostsWithPaginatorType>{

        let filter = {}

        if(blogID){
            filter = {blogId: blogID}
        }

        const skipCount: number = (paginator.pageNumber - 1) * paginator.pageSize

        const foundPostsInDB = await PostsModelClass.find(filter, {projection:{_id:0}})
            .sort({[paginator.sortBy]: paginator.sortDirection === 'asc' ?  1 : -1})
            .skip(skipCount)
            .limit(paginator.pageSize)
            .lean();

        const totalCount = await PostsModelClass.count(filter)
        const pageCount: number = Math.ceil(totalCount / paginator.pageSize)
        const postsArray = foundPostsInDB

        const outputPosts: outputPostsWithPaginatorType = {
            pagesCount: pageCount,
            page: paginator.pageNumber,
            pageSize: paginator.pageSize,
            totalCount: totalCount,
            items: await Promise.all(postsArray.map(async (post) => {
                return {
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: await this.getLikesInfo(user, post.id)
                }
            }))
        }
        return outputPosts
    }
    async findPostByID(id: string, user?: userOutputType): Promise<PostDBTypeOutputType | null> {
        const post = await PostsModelClass.findOne({id: id})
        if (post) {
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: await this.getLikesInfo(user, id)
            }
        }
        return null
    }
    async deletePostByID(id: string): Promise<boolean>{
            const result = await PostsModelClass.deleteOne({id: id})
            return result.deletedCount === 1
    }
    async createPost(newPost: PostDBType): Promise<PostDBTypeOutputType>{

        const newObjectPost: PostDBType = Object.assign({}, newPost);
        await PostsModelClass.create(newPost)

        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
    }
    async updatePostByID(id: string, body: PostDBTypeOutputType): Promise<boolean>{
        const result = await PostsModelClass.updateOne({id: id}, {$set: {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId}})

        return result.matchedCount === 1
    }
    async deleteAllPosts(): Promise<boolean>{
        const result = await PostsModelClass.deleteMany({})
        return !!result.deletedCount
    }
    async likeThePost(user: userOutputType, postId: string): Promise<boolean> {

        const postInstance = await PostsModelClass.findOne({id: postId})
        if (!postInstance) return false

        const foundLike = postInstance.likedUsers.find((info) => info.userId === user.id)

        if (!foundLike) {
            postInstance.likedUsers.push({
                addedAt: new Date().toISOString(),
                userId: user.id,
                login: user.login
            })
        }

        postInstance.dislikedUsers = postInstance.dislikedUsers.filter((info) => info.userId !== user.id)

        postInstance.save()

        return true
    }
    async dislikeThePost(user: userOutputType, postId: string): Promise<boolean> {

        const postInstance = await PostsModelClass.findOne({id: postId})
        if (!postInstance) return false

        const foundDislike = postInstance.dislikedUsers.find((info) => info.userId === user.id)

        if (!foundDislike) {
            postInstance.dislikedUsers.push({
                addedAt: new Date().toISOString(),
                userId: user.id,
                login: user.login
            })
        }

        postInstance.likedUsers = postInstance.likedUsers.filter((info) => info.userId !== user.id)

        postInstance.save()

        return true
    }
    async removeLikeAndDislike(user: userOutputType, postId: string): Promise<boolean> {

        const postInstance = await PostsModelClass.findOne({id: postId})
        if (!postInstance) return false

        postInstance.likedUsers = postInstance.likedUsers.filter((info) => info.userId !== user.id)
        postInstance.dislikedUsers = postInstance.dislikedUsers.filter((info) => info.userId !== user.id)

        return true
    }
    async getLikesInfo(user: userOutputType | undefined | null, postId: string): Promise<ExtendedLikesInfoOutputType> {

        let extendedLikesInfo: ExtendedLikesInfoOutputType = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
            newestLikes: []
        }

        const postInstance = await PostsModelClass.findOne({id: postId})

        if (!postInstance) return extendedLikesInfo

        extendedLikesInfo.likesCount = postInstance.likedUsers.length
        extendedLikesInfo.dislikesCount = postInstance.dislikedUsers.length
        extendedLikesInfo.newestLikes = postInstance.likedUsers.sort((x, y) => {
            const dateX = Date.parse(x.addedAt)
            const dateY = Date.parse(y.addedAt)

            if (dateX < dateY) {
                return 1;
            }
            if (dateX > dateY) {
                return -1;
            }
            return 0;
        }).slice(0, 3).map((elem) => {
            return {
                addedAt: elem.addedAt,
                userId: elem.userId,
                login: elem.login
            }
        }
)

        if (!user) {
            extendedLikesInfo.myStatus = LikeStatus.None
        } else if (postInstance.likedUsers.find((info) => info.userId === user.id)) {
            extendedLikesInfo.myStatus = LikeStatus.Like
        } else if (postInstance.dislikedUsers.find((info) => info.userId === user.id)) {
            extendedLikesInfo.myStatus = LikeStatus.Dislike
        }

        return extendedLikesInfo
    }
}