import {BlogsRepositoryInDB} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routers/blogs-controller";
import {PostsRepositoryInDB} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./routers/posts-controller";


// blogs
const blogsRepositoryInDB = new BlogsRepositoryInDB()
const blogsService = new BlogsService(blogsRepositoryInDB)
export const blogsController = new BlogsController(blogsService)

//posts
export const postsRepositoryInDB = new PostsRepositoryInDB()
export const postsService = new PostsService(postsRepositoryInDB)
export const postsController = new PostsController(postsService)