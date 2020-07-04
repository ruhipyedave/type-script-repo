import { EmailLogs, EmailLogsModel } from "./model";
import { EmailOptions } from "../../utils/email";

export async function logEmailSent(options: EmailOptions, info: object, error?: Error) {
    return await EmailLogsModel.create(new EmailLogs(options, info, error))
}