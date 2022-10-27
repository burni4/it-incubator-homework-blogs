import {blogType} from "./db";

const blogs: blogType[] = [];

export const blogsRepository = {
    async findAllBlogs(): Promise<blogType[]>{
        return blogs;
    },
    async findBlogByID(id: string): Promise<blogType | undefined>{
        return blogs.find(bl => bl.id === id)
    },
    async createBlog(data: blogType): Promise<blogType>{
        const newBlog: blogType = {
            id: String(+new Date()),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: new Date().toISOString()
        }
        blogs.push(newBlog)
        return newBlog
    },
    async deleteBlogByID(id: string): Promise<boolean>{
        for (let i =  0; i < blogs.length; i++){
            if(blogs[i].id === id){
                blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    async updateBlogByID(id: string, body: blogType): Promise<boolean>{
        const blog = blogs.find(bl => bl.id === id);
        if(blog){
            blog.name = body.name;
            blog.youtubeUrl = body.youtubeUrl;
            return true
        }else{
            return false
        }
    },
    async deleteAllBlogs(): Promise<boolean>{
        blogs.length = 0;
        return true
    }
}