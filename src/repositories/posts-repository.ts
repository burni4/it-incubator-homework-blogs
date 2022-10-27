import {postType} from "./db";

const posts: postType[] = [];

export const postsRepository = {
    async findAllPosts(): Promise<postType[]>{
        return posts;
    },
    async findPostByID(id: string): Promise<postType | undefined>{
        return posts.find(p => p.id === id);
    },
    async deletePostByID(id: string): Promise<boolean>{
        for (let i =  0; i < posts.length; i++){
            if(posts[i].id === id){
                posts.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    async createPost(data: postType): Promise<postType>{
        const newPost: postType = {
            id: String(+new Date()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: "",
            createdAt: new Date().toISOString()
        }
        posts.push(newPost)
        return newPost
    },
    async updatePostByID(id: string, body: postType): Promise<boolean>{
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
    async deleteAllPosts(): Promise<boolean>{
        posts.length = 0;
        return true
    }
}