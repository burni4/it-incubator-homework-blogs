export type postType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type blogType = {
    id: string
    name : string
    description : string
    websiteUrl: string
    createdAt: string
}

export type userType = {
    id: string
    login : string
    passwordHash : string
    passwordSalt : string
    email: string
    createdAt: string
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

export type paginatorType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
}

export type outputUsersWithPaginatorType = paginatorType & {
    items: userOutputType[]
}

export type outputBlogsWithPaginatorType = paginatorType & {
    items: blogType[]
}

export type outputPostsWithPaginatorType = paginatorType & {
    items: postType[]
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

export type loginInputType = {
    login: string
    password: string
}