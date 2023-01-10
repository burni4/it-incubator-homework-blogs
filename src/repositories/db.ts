import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import mongoose from "mongoose";
import {
    blogType,
    commentDBType,
    postType,
    sessionInfoTypeInDB,
    userDBType
} from "../projectTypes";
import {UserPasswordRecoverySchema, UserSchema} from "./mongoose-schemas";

dotenv.config()
mongoose.set('strictQuery', false)

const mongoURILocalhost: string = "mongodb://0.0.0.0:27017"

const dbName: string = "it-incubator-homework-blogs"

const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;
export const client = new MongoClient(mongoUri)

export const db = client.db(dbName)
export const blogsCollection = db.collection<blogType>("blogs")
export const postsCollection = db.collection<postType>("posts")
export const usersCollection = db.collection<userDBType>("users")
export const commentsCollection = db.collection<commentDBType>("comments")
export const sessionsInfoCollection = db.collection<sessionInfoTypeInDB>("sessionsInfo")
export const UserPasswordRecoveryCodesModelClass = mongoose.model('userPasswordRecoveryCodes', UserPasswordRecoverySchema);
export const UsersModelClass = mongoose.model('users', UserSchema);
export async function runDb(){

    try {
        await client.connect()
        await client.db("it-incubator-homework-blogs").command({ping: 1})
        console.log("Connected successfully to mongo server")
        await mongoose.connect(mongoUri+dbName);
        console.log("Connected to mongo server with mongoose successful")

    }catch {
        console.log("Can't connect to mongo server!!!")
        await client.close()
        await mongoose.disconnect();
    }
}
