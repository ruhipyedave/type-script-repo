import { Schema, Document, model } from "mongoose";
import { ObjectId } from "bson";
import { EmailOptions } from "../../util/email";

const accountsSchema = new Schema(
    {
        from: String,
        to: String,
        replyto: String,
        subject: String,
        bcc: String,
        html: String,
        attachments: Object,
        info: Object,
        error: Object,
        createdBy: {
            type: ObjectId,
            ref: "users",
            default: null
        },
        updatedBy: {
            type: ObjectId,
            ref: "users",
            default: null
        }
    },
    { timestamps: true }
);


export let EmailLogsModel = model("email_logs", accountsSchema);

export class EmailLogs {
    from: string;
    to: string;
    replyto: string;
    subject: string;
    bcc: string;
    html: string;
    attachments: any;
    info: object;
    error: Error;
    constructor(options: EmailOptions, info: object, error?: Error) {
        this.from = options.from;
        this.to = options.to;
        this.replyto = options.replyto;
        this.subject = options.subject;
        this.bcc = options.bcc;
        this.html = options.html;
        this.attachments = options.attachments;
        this.info = info;
        this.error = error;
    }
}