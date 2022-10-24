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
    createPost(data: postType): postType{
        const newPost: postType = {
            id: String(+new Date()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: ""
        }
        posts.push(newPost)
        return newPost
    },
    updatePostByID(id: string, body: postType): boolean{
        const post = posts.find(bl => bl.id === id);
        if(post){
            post.title = body.title;
            post.shortDescription = body.shortDescription;
            post.content = body.content;
            post.blogId = body.blogId;
            return true
        }else{
            return false
        }
    },
    deleteAllPosts(): void{
        posts.length = 0;
    }
}