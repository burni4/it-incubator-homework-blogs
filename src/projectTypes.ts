export enum LikeStatus {'None', 'Like', 'Dislike'}

export type postDBType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export class BlogClass {
    id: string
    createdAt: string

    constructor(public name: string,
                public description: string,
                public websiteUrl: string
    ) {
        this.id = String(+new Date())
        this.createdAt = new Date().toISOString()
    }
}

export type blogDBType = {
    id: string
    name : string
    description : string
    websiteUrl: string
    createdAt: string
}

export type userDBType = {
    id: string
    accountData: {
        login: string
        passwordHash: string
        passwordSalt: string
        email: string
        createdAt: string
    },
    emailConfirmation: emailConfirmationType
}

export type userServiceType = {
    id: string
    accountData: {
        login: string
        passwordHash: string
        passwordSalt: string
        email: string
        createdAt: string
    },
    emailConfirmation: emailConfirmationType
}
export type emailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean

}
export type UserPasswordRecoveryCodeTypeInDB = {
    userId: string
    recoveryCode: string
    expirationDate: Date

}
export type generatedTokensType = {
    accessToken: string
    refreshToken: string

}
export type userInputType = {
    login: string
    password : string
    email: string

}

export type userOutputType = {
    id: string
    login: string
    email : string
    createdAt: string
}

export type sessionInfoTypeInDB = {
    ip: string
    title: string
    expireDate: Date
    lastActiveDate: Date
    deviceId: string
    userId: string
}

export type devicesOutputType = {
    ip: string
    title: string
    lastActiveDate: String
    deviceId: string

}

export type registrationConformationType = {
    code: string
}
export type registrationResendingConformationType = {
    email: string
}

export type paginatorType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
}

export type queryBlogParams = {
    searchNameTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

export type queryPostParams = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

export type queryUserParams = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}

export type queryCommentParams = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: string
}

export type loginInputType = {
    login: string
    password: string
}

export type dataRegistrationType = {
    login: string
    password: string
    email: string
}

export type commentDBType = {
    id: string
    content : string
    userId : string
    userLogin : string
    createdAt: string
    postId: string
    likedUsersId: string[],
    dislikedUsersId: string[]
}

export type commentOutputType = {
    id: string
    content : string
    userId : string
    userLogin : string
    createdAt: string
    likesInfo: LikesInfoOutputType
}
export type LikesInfoOutputType = {
    likesCount: Number,
    dislikesCount: Number,
    myStatus: LikeStatus
}
export type commentInputType = {
    content : string
}

export type outputUsersWithPaginatorType = paginatorType & {
    items: userOutputType[]
}

export type outputBlogsWithPaginatorType = paginatorType & {
    items: blogDBType[]
}

export type outputPostsWithPaginatorType = paginatorType & {
    items: postDBType[]
}

export type outputCommentsWithPaginatorType = paginatorType & {
    items: commentOutputType[]
}