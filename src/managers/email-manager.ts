import {emailAdapter} from "../adapters/email-adapter";
import {userServiceType} from "../projectTypes";

export const emailManager = {
    async sendEmailConfirmationMessage(confirmationCode:string, email:string) {

        const message: string = `<h1>Thank for your registration</h1> 
                    <p>To finish registration please follow the link below:
                        <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                    </p>`
        const subject: string = 'Thank for your registration on Incubator Homework'

        return await emailAdapter.sendEmailFromGmail(email, subject, message)
    },
    async sendEmailRecoveryPasswordMessage(recoveryCode: string, email: string){

        const message: string = `<h1>Password recovery</h1>
                    <p>To finish password recovery please follow the link below:
                         <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
                     </p>`
        const subject: string = 'Thank for your registration on Incubator Homework'

        return await emailAdapter.sendEmailFromGmail(email, subject, message)
    }
}