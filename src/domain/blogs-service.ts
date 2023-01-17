import {BlogsRepositoryInDB} from "../repositories/blogs-repository";
import {blogDBType, outputBlogsWithPaginatorType, outputPostsWithPaginatorType, postDBType, queryBlogParams, queryPostParams} from "../projectTypes";
import {queryPostParamsPaginator} from "./posts-service";
import {postsService} from "../composition-root";

export class BlogsService {
    constructor(protected blogsRepositoryInDB: BlogsRepositoryInDB) {}
    async findAllBlogs(queryParams: queryBlogParams): Promise<outputBlogsWithPaginatorType>{
        return this.blogsRepositoryInDB.findAllBlogs(queryBlogParamsPaginator(queryParams));
    }
    async findAllPostsByBlogID(id: string, queryParams: queryPostParams): Promise<outputPostsWithPaginatorType | null>{

        const foundBlog = await this.blogsRepositoryInDB.findBlogByID(id)

        if(!foundBlog){
            return null
        }

        return postsService.findAllPosts(queryPostParamsPaginator(queryParams), id);
    }
    async findBlogByID(id: string): Promise<blogDBType | null>{
        return await this.blogsRepositoryInDB.findBlogByID(id)
    }
    async deleteBlogByID(id: string): Promise<boolean>{
        return await this.blogsRepositoryInDB.deleteBlogByID(id)
    }
    async createBlog(data: blogDBType): Promise<blogDBType>{
        const newBlog: blogDBType = {
            id: String(+new Date()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: new Date().toISOString()
        }
        const createdBlog: blogDBType = await this.blogsRepositoryInDB.createBlog(newBlog)
        return createdBlog
    }
    async createPostByBlogID(id: string, data: postDBType): Promise<postDBType | null>{

        const foundBlog = await this.blogsRepositoryInDB.findBlogByID(id)

        if(!foundBlog){
          return null
        }
        data.blogId = id

        return await postsService.createPost(data)
    }
    async updateBlogByID(id: string, body: blogDBType): Promise<boolean>{
        return this.blogsRepositoryInDB.updateBlogByID(id, body)
    }
    async deleteAllBlogs(): Promise<boolean>{
        return this.blogsRepositoryInDB.deleteAllBlogs()
    }
}
const queryBlogParamsPaginator = (queryParams: queryBlogParams):queryBlogParams => {
    return {
        searchNameTerm: queryParams.searchNameTerm || null,
        pageNumber: +queryParams.pageNumber || 1,
        pageSize: +queryParams.pageSize || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc'
    }
}