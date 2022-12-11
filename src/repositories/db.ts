import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {blogType, commentDBType, postType, userDBType} from "../projectTypes";

dotenv.config()

const mongoURILocalhost: string = "mongodb://0.0.0.0:27017"

const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;
export const client = new MongoClient(mongoUri)

export const db = client.db("it-incubator-homework-blogs")
export const blogsCollection = db.collection<blogType>("blogs")
export const postsCollection = db.collection<postType>("posts")
export const usersCollection = db.collection<userDBType>("users")
export const commentsCollection = db.collection<commentDBType>("comments")
export const sessionsInfoCollection = db.collection<commentDBType>("sessionsInfo")
export async function runDb(){

    try {
        await client.connect()
        await client.db("it-incubator-homework-blogs").command({ping: 1})
        console.log("Connected successfully to mongo server")
    }catch {
        console.log("Can't connect to mongo server!!!")
        await client.close()
    }
}
