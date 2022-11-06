export type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type blogType = {
    id?: string,
    name : string,
    youtubeUrl: string
    createdAt: string
}