import express, { Request, Response } from "express"
import bodyParser from 'body-parser'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {blogsRepository} from "./repositories/blogs-repository";
import {postsRepository} from "./repositories/posts-repository";
import {runDb} from "./repositories/db";

export const app = express()
const port = process.env.PORT || 3000
const parserMiddleware = bodyParser()

app.use(parserMiddleware);

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Homework [Blogs] from Artem Narchuk");
})


app.delete("/testing/all-data", async (req: Request, res: Response) => {

    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()

    res.sendStatus(204)

})

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
