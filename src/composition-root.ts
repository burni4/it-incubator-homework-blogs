import {BlogsRepositoryInDB} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./routers/blogs-controller";

const blogsRepositoryInDB = new BlogsRepositoryInDB()
const blogsService = new BlogsService(blogsRepositoryInDB)
export const blogsController = new BlogsController(blogsService)