import {MongoClient} from "mongodb";

export type postType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type blogType = {
    id?: string,
    name : string,
    youtubeUrl: string
    createdAt: string
}

const mongoURILocalhost: string = "mongodb://0.0.0.0:27017"

const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;

export const client = new MongoClient(mongoUri)

export const db = client.db("it-incubator-homework-blogs")
export const blogsCollection = db.collection<blogType>("blogs");
export const postsCollection = db.collection<postType>("posts");

export async function runDb(){

    try {
        await client.connect()
        await client.db("products").command({ping: 1})
        console.log("Connected successfully to mongo server")
    }catch {
        console.log("Can't connect to mongo server!!!")
        await client.close()
    }
}
