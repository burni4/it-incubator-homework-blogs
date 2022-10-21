import express, { Request, Response } from "express"
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 3000
const parserMiddleware = bodyParser()



app.get("/", (req: Request, res: Response) => {
    res.send("Hello Homework [Blogs] from Artem Narchuk");
})


app.delete("/testing/all-data", (req: Request, res: Response) => {

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})