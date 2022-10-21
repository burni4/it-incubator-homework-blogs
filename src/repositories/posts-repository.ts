type postType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
}

const posts: postType[] = [];

export const blogsRepository = {
    findPostByID(id: string){
        return posts.find(p => p.id === id);
    }
}