import express, { Request, Response } from "express"
import bodyParser from 'body-parser'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {blogsRepository} from "./repositories/blogs-repository";
import {postsRepository} from "./repositories/posts-repository";

const app = express()
const port = process.env.PORT || 3000
const parserMiddleware = bodyParser()

app.use('/api/blogs', blogsRouter);
app.use('/api/posts', postsRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Homework [Blogs] from Artem Narchuk");
})


app.delete("/api/testing/all-data", (req: Request, res: Response) => {

    blogsRepository.deleteAllBlogs()
    postsRepository.deleteAllPosts()

    res.status(204)

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})