import request from 'supertest'
import {app} from "../../src";
import {blogsRepositoryInDB} from "../../src/repositories/blogs-repository";
import {postsRepositoryInDB} from "../../src/repositories/posts-repository";

describe('/blogs', () => {

    beforeAll(async () => {
        await blogsRepositoryInDB.deleteAllBlogs()
    })

    let createdBlog: any = null;

    it('return 200 Empty blogs array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('return 401 Unauthorized user', async () => {
        await request(app)
            .post('/blogs')
            .expect(401)
    })

    it('return 404 blog not existing ', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(404)
    })

    it('return 400 blog not create with empty input data', async () => {
        await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({})
            .expect(400)
    })

    it('return 201 create blog with correct input data', async () => {
        const createResponse = await request(app)
            .post('/blogs')
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
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog]
            })
    })

    it('return 404 (not exist), blog not update with incorrect input data', async () => {
        await request(app)
            .put('/blogs/1')
            .auth('admin', 'qwerty')
            .send({
                name: "1Craft (Update)",
                youtubeUrl: "https://www.youtube.com/channel/UCh0J99rt9U7MHt8-LGCy93A"
            })
            .expect(404)
    })

    it('return 400 blog not update with incorrect input data', async () => {
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
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdBlog]
            })
    })

    it('return 204 update blog with correct input data', async () => {
        await request(app)
            .put('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send({
                name: "1Craft (Update)",
                youtubeUrl: "https://www.youtube.com/"
            })
            .expect(204)

        await request(app)
            .get('/blogs/' + createdBlog.id)
            .expect(200, {
                ...createdBlog,
                name: "1Craft (Update)",
                youtubeUrl: "https://www.youtube.com/"
            })
    })

    it('return 204 delete blog', async () => {
        await request(app)
            .delete('/blogs/' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(204)
    })

    it('return 404 blog not deleted (not exist)', async () => {
        await request(app)
            .delete('/blogs' + createdBlog.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(404)
    })


})

describe('/posts', () => {

    let createdPost: any = null;
    let createdBlogForPost: any = null;

    beforeAll(async () => {

        await postsRepositoryInDB.deleteAllPosts()

        const createResponseBlog = await request(app)
            .post('/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: "1Craft",
                youtubeUrl: "https://www.youtube.com/channel/UCh0J99rt9U7MHt8-LGCy93A"
            })
            .expect(201)

        createdBlogForPost = createResponseBlog.body;

        expect(createdBlogForPost).toEqual({
            id: expect.any(String),
            name: "1Craft",
            youtubeUrl: "https://www.youtube.com/channel/UCh0J99rt9U7MHt8-LGCy93A",
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/blogs')
            .expect(200, [createdBlogForPost])
    })


    it('return 200 Empty posts array', async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('return 401 Unauthorized user', async () => {
        await request(app)
            .post('/posts')
            .expect(401)
    })

    it('return 404 post not existing ', async () => {
        await request(app)
            .get('/posts/1')
            .expect(404)
    })

    it('return 400 post not create with empty input data', async () => {
        await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({})
            .expect(400)
    })

    it('return 201 create post with correct input data', async () => {

        const createResponse = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: "First comment",
                shortDescription: "First comment shortDescription",
                content: "First comment content",
                blogId: createdBlogForPost.id
            })
            .expect(201)

        createdPost = createResponse.body;

        expect(createdPost).toEqual({
            id: expect.any(String),
            title: "First comment",
            shortDescription: "First comment shortDescription",
            content: "First comment content",
            blogId: createdBlogForPost.id,
            blogName: createdBlogForPost.name,
            createdAt: expect.any(String)
        })
        await request(app)
            .get('/posts')
            .expect(200, [createdPost])
    })

    it('return 404, post not exist', async () => {
        await request(app)
            .put('/posts/1')
            .auth('admin', 'qwerty')
            .send({
                title: "First comment",
                shortDescription: "First comment shortDescription",
                content: "First comment content",
                blogId: createdBlogForPost.id
            })
            .expect(404)
    })

    it('return 400 post not update with incorrect input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .auth('admin', 'qwerty')
            .send({
                title: "",
            })
            .expect(400)

        await request(app)
            .get('/posts')
            .expect(200, [createdPost])
    })

    it('return 204 update post with correct input data', async () => {
        await request(app)
            .put('/posts/' + createdPost.id)
            .auth('admin', 'qwerty')
            .send({
                title: "First comment (Update)",
                shortDescription: "First comment shortDescription (Update)",
                content: "First comment content (Update)",
                blogId: createdBlogForPost.id
            })
            .expect(204)

        await request(app)
            .get('/posts/' + createdPost.id)
            .expect(200, {
                ...createdPost,
                title: "First comment (Update)",
                shortDescription: "First comment shortDescription (Update)",
                content: "First comment content (Update)"
            })
    })

    it('return 204 delete post', async () => {
        await request(app)
            .delete('/posts/' + createdPost.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(204)
    })

    it('return 404 post not deleted (not exist)', async () => {
        await request(app)
            .delete('/posts' + createdPost.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(404)
    })

    afterAll(async () => {
        await request(app)
            .delete('/blogs/' + createdBlogForPost.id)
            .auth('admin', 'qwerty')
            .send()
            .expect(204)
    })
})