type blogType = {
    "id": string,
    "name": string,
    "youtubeUrl": string
}

const blogs: blogType[] = [];

export const blogsRepository = {
    findBlogByID(id: string){
        return blogs.find(bl => bl.id === id);
    }
}