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
    youtubeUrl: string
    createdAt: string
}

export type userType = {
    id: string
    login : string
    password : string
    email: string
    createdAt: string
}

export type paginatorType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
}

export type outputBlogType = paginatorType & {
    items: blogType[]
}

export type outputPostType = paginatorType & {
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
