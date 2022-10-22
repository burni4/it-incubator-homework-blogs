type blogType = {
    "id"?: string,
    "name": string,
    "youtubeUrl": string
}

const blogs: blogType[] = [];

export const blogsRepository = {
    findAllBlogs(): blogType[]{
        return blogs;
    },
    findBlogByID(id: string): blogType | undefined{
        return blogs.find(bl => bl.id === id)
    },
    createBlog(data: blogType): blogType{
        const newBlog: blogType = {
            id: String(+new Date()),
            name: data.name,
            youtubeUrl: data.youtubeUrl
        }
        blogs.push(newBlog)
        return newBlog
    },
    deleteBlogByID(id: string): boolean{
        for (let i =  0; i < blogs.length; i++){
            if(blogs[i].id === id){
                blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    updateBlogByID(id: string, body: blogType): boolean{
        const blog = blogs.find(bl => bl.id === id);
        if(blog){
            blog.name = body.name;
            blog.youtubeUrl = body.youtubeUrl;
            return true
        }else{
            return false
        }
    },
    deleteAllBlogs(): void{
        blogs.length = 0;
    }
}