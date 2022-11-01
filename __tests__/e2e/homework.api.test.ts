import request from 'supertest'
import {app} from "../../src";
import {blogsRepository} from "../../src/repositories/blogs-repository";
import {postsRepository} from "../../src/repositories/posts-repository";

describe('/blogs', ()=>{

    beforeAll(async () => {
        await blogsRepository.deleteAllBlogs()
    })

    it('should return 200 and empty blogs array',async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('should return 404 for not existing blog',async () => {
        await request(app)
            .get('/blogs/1')
            .expect(404)
    })

    it('should return 401 Unauthorized user',async () => {
        await request(app)
            .post('/blogs/')
            .expect(401)
    })

    it('should not create blog with incorrect input data',async () => {
        await request(app)
            .post('/blogs/')
            .auth('admin', 'qwerty')
            .send({})
            .expect(400)
    })

})

describe('/posts', ()=>{

    beforeAll(async () => {
        await postsRepository.deleteAllPosts()
    })

    it('should return 200 and empty posts array',async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('should return 404 for not existing post',async () => {
        await request(app)
            .get('/post/1')
            .expect(404)
    })

    it('should return 401 Unauthorized user',async () => {
        await request(app)
            .post('/posts/')
            .expect(401)
    })

    it('should not create post with incorrect input data',async () => {
        await request(app)
            .post('/posts/')
            .auth('admin', 'qwerty')
            .send({})
            .expect(400)
    })

})