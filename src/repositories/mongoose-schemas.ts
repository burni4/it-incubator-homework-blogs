import mongoose from "mongoose";
import {UserPasswordRecoveryCodeTypeInDB} from "../projectTypes";

export const UserPasswordRecovery = new mongoose.Schema<UserPasswordRecoveryCodeTypeInDB>({
    userId: {type: String, required: true},
    recoveryCode: {type: String, required: true},
    expirationDate: {type: Date, required: true}
});