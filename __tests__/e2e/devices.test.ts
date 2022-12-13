import {blogsRepositoryInDB} from "../../src/repositories/blogs-repository";
import request from "supertest";
import {app} from "../../src";
import {sessionsInfoCollection} from "../../src/repositories/db";


describe('Devices', () => {
    const testingUrl = '/testing/all-data'
    const usersUrl = '/users'
    const authUrl = '/auth'
    const loginUrl  = `${authUrl}/login`

    const users = {
        user1: {
            id: '',
            email: 'user1@gmail.com',
            login: 'user1',
            password: 'user1password',
            createdAt: '',
            accessToken: '',
            refreshToken: ''
        }
    }


    beforeAll(async () => {
        it('return 204 status code', async () => {
            const response = await request(app)
                .delete(testingUrl)

            expect(response.statusCode).toBe(204)
            const sessions = await  sessionsInfoCollection.find({}).toArray()
            expect(sessions.length).toBe(0)
        })
    })


    describe('create 4 users for test', () => {
        it('should return new user', async () => {
            const response = await request(app)
                .post(usersUrl)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    email: users.user1.email,
                    login: users.user1.login,
                    password: users.user1.password,
                })

            const user = response.body

            expect(response.statusCode).toBe(201)
            expect(user).toStrictEqual({
                id: expect.any(String),
                login: users.user1.login,
                email: users.user1.email,
                createdAt: expect.any(String)
            })

            users.user1.id = user.id
            users.user1.createdAt = user.createdAt

        })
    })

    describe('login 4 users', () => {
        it('should return access and refresh tokens', async () => {
            const sessionsBeforeLogin = await  sessionsInfoCollection.find({}).toArray()
            expect(sessionsBeforeLogin.length).toBe(0)

            const response = await request(app)
                .post(loginUrl)
                .send({
                    loginOrEmail: users.user1.login,
                    password: users.user1.password,
                })

            const accessToken = response.body.accessToken

            expect(response.statusCode).toBe(200)
            expect(accessToken).toBeDefined()

            const cookie = response.get('Set-Cookie')
            const refreshToken = cookie[0].split('=')[1].split(';')[0]
            expect(refreshToken).toBeDefined()
            users.user1.accessToken = accessToken
            users.user1.refreshToken = refreshToken

            const sessionsAfterLogin = await  sessionsInfoCollection.find({}).toArray()
            expect(sessionsAfterLogin.length).toBe(1)

    })
})})
