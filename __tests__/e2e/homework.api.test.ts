import request from 'supertest'
import {app} from "../../src";
import {blogsRepositoryInDB} from "../../src/repositories/blogs-repository";
import {postsRepositoryInDB} from "../../src/repositories/posts-repository";

describe('/blogs', () => {

    beforeAll(async () => {
        await blogsRepositoryInDB.deleteAllBlogs()
    })

    it('return 200 Empty blogs array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })
})

describe('/posts', () => {

    beforeAll(async () => {

        await postsRepositoryInDB.deleteAllPosts()

    })

    it('return 200 Empty posts array', async () => {
        await request(app)
            .get('/posts')
            .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

})