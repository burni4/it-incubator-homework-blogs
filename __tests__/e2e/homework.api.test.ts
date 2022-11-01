import request from 'supertest'
import {app} from "../../src";
import {blogsRepository} from "../../src/repositories/blogs-repository";
import {postsRepository} from "../../src/repositories/posts-repository";

describe('/blogs', ()=>{

    beforeAll(async () => {
        await blogsRepository.deleteAllBlogs()
    })

    let createdBlog: any = null;

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

    it('should not create blog with empty input data, return 400',async () => {
        await request(app)
            .post('/blogs/')
            .auth('admin', 'qwerty')
            .send({})
            .expect(400)
    })

    it('should create blog with correct input data',async () => {
        const createResponse = await request(app)
            .post('/blogs/')
            .auth('admin', 'qwerty')
            .send({
                name: "1Craft",
                youtubeUrl: "https://www.youtube.com/channel/UCh0J99rt9U7MHt8-LGCy93A"
            })
            .expect(201)

        createdBlog = createResponse.body;

        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: "1Craft",
            youtubeUrl: "https://www.youtube.com/channel/UCh0J99rt9U7MHt8-LGCy93A",
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/blogs')
            .expect(200, [createdBlog])
    })

    it('should not update blog with incorrect input data, and return 404 (not exist)',async () => {
        await request(app)
            .put('/blogs/1')
            .auth('admin', 'qwerty')
            .send({
                name: "1Craft (Update)",
                youtubeUrl: "https://www.youtube.com/channel/UCh0J99rt9U7MHt8-LGCy93A"
            })
            .expect(404)
    })

    it('should not update blog with incorrect input data, and return 400',async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send({
                name: "",
                youtubeUrl: ""
            })
            .expect(400)

        await request(app)
            .get('/blogs')
            .expect(200, [createdBlog])
    })

    it('should update blog with correct input data, and return 204',async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send({
                name: "1Craft (Update)",
                youtubeUrl: "https://www.youtube.com/"
            })
            .expect(204)

        await request(app)
            .get('/blogs/'+ createdBlog.id)
            .expect(200, {
                ...createdBlog,
                name: "1Craft (Update)",
                youtubeUrl: "https://www.youtube.com/"
            })
    })

    it('should delete blog return 204',async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(204)
    })

    it('should not delete blog (not exist) return 404',async () => {
        await request(app)
            .delete('/delete/'+ createdBlog.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(404)
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