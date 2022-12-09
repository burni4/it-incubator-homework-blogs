import express, { Request, Response } from "express"
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";
import {blogsRepositoryInDB} from "./repositories/blogs-repository";
import {postsRepositoryInDB} from "./repositories/posts-repository";
import {usersRepositoryInDB} from "./repositories/users-repository";
import {commentsRepositoryInDB} from "./repositories/comments-repository";
import {runDb} from "./repositories/db";

export const app = express()
const port = process.env.PORT || 3000
const bodyParserMiddleware = bodyParser()
const cookieParserMiddleware = cookieParser()

app.set('trust proxy', true)

app.use(bodyParserMiddleware);
app.use(cookieParserMiddleware);

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Homework [Blogs] from Artem Narchuk");
})

app.delete("/testing/all-data", async (req: Request, res: Response) => {

    await blogsRepositoryInDB.deleteAllBlogs()
    await postsRepositoryInDB.deleteAllPosts()
    await usersRepositoryInDB.deleteAllUsers()
    await commentsRepositoryInDB.deleteAllComments()

    res.sendStatus(204)

})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()