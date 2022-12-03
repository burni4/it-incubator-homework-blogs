import {emailAdapter} from "../adapters/email-adapter";
import {userServiceType} from "../projectTypes";

export const emailManager = {
    async sendEmailConfirmationMessage(user: userServiceType) {

        const message: string = `<h1>Thank for your registration</h1> 
                    <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
                    </p>`
        const subject: string = 'Thank for your registration on Incubator Homework'

        return await emailAdapter.sendEmailFromGmail(user.accountData.email, subject, message)
    }
}