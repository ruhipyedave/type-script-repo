import { UsersModel, User, UserClass, USER } from "./model";
import { sendEmail, EmailOptions } from "../../util/email";
import { checkIfEmpty } from "../../util";
import { USERS_ERRORS, APIError, ACCOUNTS_ERRORS } from "../../util/error";
import { generateToken } from "../../util/auth";
import { ACCESS_TOKEN_LIFETIME } from "../auth/module";
import { accountVerifyTemplate } from "../../util/email-templates";
import { createAccount } from "../accounts/module";

function listUsers(
    query: object,
    select: object = {},
    options: object = { lean: true }
) {
    UsersModel.find(query, select, options);
}


export async function findUser(
    query: object, select: object = {},
    options: object = { lean: true }
): Promise<User> {
    return await UsersModel.findOne(query, select, options);
}

export async function createCustomer(email: string, pwd: string, name: string, account: {
    type: number,
    balance: number,
}) {
    if (checkIfEmpty(name)) {
        throw new APIError(USERS_ERRORS.missingName.key, USERS_ERRORS.missingName.msg);
    }
    // if (!account) {
    //     throw new APIError(ACCOUNTS_ERRORS.missingFields.key, ACCOUNTS_ERRORS.missingFields.msg);
    // }

    // if (isNaN(account.type)) {
    //     throw new APIError(ACCOUNTS_ERRORS.invalidType.key, ACCOUNTS_ERRORS.invalidType.msg);
    // }

    // if (isNaN(account.balance)) {
    //     account.balance = 0;
    // }

    // check if customer exists
    const customer = await findUser({ email });

    // if custoer does not exist create a new account for the customer
    if (!customer) {
        name = name.toString().trim();
        const user = await UsersModel.create(new UserClass(email, pwd, USER.roles.customer, name));
        user.token = await generateToken(user._id.toString(), ACCESS_TOKEN_LIFETIME.verify);

        // create customers new account
        // await createAccount(user._id, account.type, account.balance);
        user.save();
        const content = accountVerifyTemplate(name, user.token);
        sendEmail(new EmailOptions(content.subject, content.html, null, user.email));
        return true;
    }

    switch (customer.status) {
        case USER.status.active:
            throw new APIError(USERS_ERRORS.userExists.key, USERS_ERRORS.userExists.msg);

        case USER.status.pending:
            throw new APIError(USERS_ERRORS.notVerified.key, USERS_ERRORS.notVerified.msg);

        case USER.status.deleted:
            throw new APIError(USERS_ERRORS.deleted.key, USERS_ERRORS.deleted.msg);
    }
    throw new APIError(USERS_ERRORS.invalid.key, USERS_ERRORS.invalid.msg);
}