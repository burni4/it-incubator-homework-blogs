import nodemailer from 'nodemailer'

export const emailAdapter = {
    async sendEmailFromGmail(email: string, subject: string, message: string){
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail_login,
                pass: process.env.gmail_password
            },
        });

        let info = await transporter.sendMail({
            from: 'Incubator Homework <process.env.gmail_login>',
            to: email,
            subject: subject,
            html: message
        })
        return info
    }
}