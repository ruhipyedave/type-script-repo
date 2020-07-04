import nodemailer from 'nodemailer';
import { logEmailSent } from '../apis/email-logs/module';
let testAccount: nodemailer.TestAccount;
export class EmailOptions {
    from: string;
    to: string;
    replyto: string;
    subject: string;
    bcc: string;
    html: string;
    attachments: any;

    constructor(
        subject: string,
        html: string,
        attachments: any,
        to: string,
        replyto: string = null,
        bcc: string = "",
        from: string = "",
    ) {
        this.from = from;
        this.to = to;
        this.replyto = replyto;
        this.subject = subject;
        this.bcc = bcc;
        this.html = html;
        this.attachments = attachments;
    }
}

export async function sendEmail(mailOptions: EmailOptions): Promise<any> {
    try {
        const transporter = await generateAccount();
        mailOptions.from = testAccount.user;
        const info = await transporter.sendMail(mailOptions);
        logEmailSent(mailOptions, info);
    } catch (error) {
        console.log(error);
        logEmailSent(mailOptions, {}, error);
        throw error;
    }
}

// Generate test SMTP service account from ethereal.email
// create reusable transporter object using the default SMTP transport
async function generateAccount() {
    if (!testAccount) {
        testAccount = await nodemailer.createTestAccount();
    }
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });;
}