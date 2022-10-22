type postType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
}

const posts: postType[] = [];

export const postsRepository = {
    findAllPosts(): postType[]{
        return posts;
    },
    findPostByID(id: string): postType | undefined{
        return posts.find(p => p.id === id);
    },
    deleteAllPosts(): void{
        posts.length = 0;
    }
}