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
    findAllPosts(){
        return posts;
    },
    findPostByID(id: string){
        return posts.find(p => p.id === id);
    },
    deleteAllPosts(){
        posts.length = 0;
    }
}