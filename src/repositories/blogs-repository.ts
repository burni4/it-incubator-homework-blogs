type blogType = {
    "id"?: string,
    "name": string,
    "youtubeUrl": string
}

const blogs: blogType[] = [];

export const blogsRepository = {
    findAllBlogs(){
        return blogs;
    },
    findBlogByID(id: string){
        return blogs.find(bl => bl.id === id);
    },
    createBlog(data: blogType): blogType{
        const newBlog: blogType = {
            id: new Date().toISOString(),
            name: data.name,
            youtubeUrl: data.youtubeUrl
        }
        blogs.push(newBlog)
        return newBlog
    },
    deleteAllBlogs(){
        blogs.length = 0;
    }
}