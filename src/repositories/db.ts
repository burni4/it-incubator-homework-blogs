import * as dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import mongoose from "mongoose";
import {
    BlogSchema,
    CommentSchema,
    PostSchema,
    SessionInfoSchema,
    UserPasswordRecoverySchema,
    UserSchema
} from "./mongoose-schemas";

dotenv.config()
mongoose.set('strictQuery', false)

const mongoURILocalhost: string = "mongodb://0.0.0.0:27017"

const dbName: string = "it-incubator-homework-blogs"

const mongoUri = process.env.mongoURIAtlas || mongoURILocalhost;

export const UsersModelClass = mongoose.model('users', UserSchema);
export const UserPasswordRecoveryCodesModelClass = mongoose.model('userPasswordRecoveryCodes', UserPasswordRecoverySchema);
export const BlogsModelClass = mongoose.model('blogs', BlogSchema);
export const PostsModelClass = mongoose.model('posts', PostSchema);
export const CommentsModelClass = mongoose.model('comments', CommentSchema);
export const SessionsInfosModelClass = mongoose.model('sessionsInfo', SessionInfoSchema);

export async function runDb(){

    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to mongo server with mongoose successful")

    }catch {
        console.log("Can't connect to mongo server!!!")
        await mongoose.disconnect();
    }
}
