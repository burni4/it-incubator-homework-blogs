import mongoose from "mongoose";
import {
    blogDBType,
    commentDBType, NewestLikesType, PostDBType,
    PostDBTypeOutputType,
    sessionInfoTypeInDB,
    userDBType,
    UserPasswordRecoveryCodeTypeInDB
} from "../projectTypes";

export const UserPasswordRecoverySchema = new mongoose.Schema<UserPasswordRecoveryCodeTypeInDB>({
    userId: {type: String, required: true},
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
});

export const UserSchema = new mongoose.Schema<userDBType>({
    id: {type: String, required: true},
    accountData: {
        login: {type: String, required: true},
        passwordHash: {type: String, required: true},
        passwordSalt: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: String, required: true}
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: String
    }
});

export const BlogSchema = new mongoose.Schema<blogDBType>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
});

export const PostSchema = new mongoose.Schema<PostDBType>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likedUsers: [{
        type: {
            addedAt: {type: String, required: true},
            userId: {type: String, required: true},
            login: {type: String, required: true}
        }
    }],
    dislikedUsers: [{
        type: {
            addedAt: {type: String, required: true},
            userId: {type: String, required: true},
            login: {type: String, required: true}
        }
    }]
});



export const CommentSchema = new mongoose.Schema<commentDBType>({
    id: {type: String, required: true},
    content: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    createdAt: {type: String, required: true},
    postId: {type: String, required: true},
    likedUsersId: [{type: String}],
    dislikedUsersId: [{type: String}]
});

export const SessionInfoSchema = new mongoose.Schema<sessionInfoTypeInDB>({
    ip: {type: String, required: true},
    title: {type: String, required: true},
    expireDate: Date,
    lastActiveDate: Date,
    deviceId: {type: String, required: true},
    userId: {type: String, required: true}
});