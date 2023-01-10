import mongoose from "mongoose";
import {userDBType, UserPasswordRecoveryCodeTypeInDB} from "../projectTypes";

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