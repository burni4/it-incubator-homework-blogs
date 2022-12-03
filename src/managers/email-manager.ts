import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {
    async sendEmailConfirmationMessage(data: any) {
        return await emailAdapter.sendEmailFromGmail(data.email, data.subject, data.message)
    }
}