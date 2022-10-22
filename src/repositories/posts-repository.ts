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
    deletePostByID(id: string): boolean{
        for (let i =  0; i < posts.length; i++){
            if(posts[i].id === id){
                posts.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    deleteAllPosts(): void{
        posts.length = 0;
    }
}