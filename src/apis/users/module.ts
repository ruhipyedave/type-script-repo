import { UsersModel, User, UserClass, USER } from "./model";
import { sendEmail, EmailOptions } from "../../utils/email";
import { checkIfEmpty, ReqParams } from "../../utils";
import { USERS_ERRORS, APIError, ACCOUNTS_ERRORS, AUTH_ERRORS } from "../../utils/error";
import { generateToken } from "../../utils/auth";
import { ACCESS_TOKEN_LIFETIME } from "../auth/module";
import { accountVerifyTemplate } from "../../utils/email-templates";
import { UNAUTHORIZED } from "http-status-codes";
import { ObjectId } from "bson";

export async function findUser(
    query: object, select: object = {},
    options: object = { lean: true }
): Promise<User> {
    return await UsersModel.findOne(query, select, options);
}

export async function createCustomer(email: string, pwd: string, name: string, createdBy?: ObjectId) {
    if (checkIfEmpty(name)) {
        throw new APIError(USERS_ERRORS.missingName.key, USERS_ERRORS.missingName.msg);
    }

    // check if customer exists
    const customer = await findUser({ email });

    // if custoer does not exist create a new account for the customer
    if (!customer) {
        name = name.toString().trim();
        const user = await UsersModel.create(new UserClass(email, pwd, USER.roles.customer, name, null, createdBy));
        user.token = await generateToken(user._id.toString(), ACCESS_TOKEN_LIFETIME.verify);
        user.save();
        const content = accountVerifyTemplate(name, user.token);
        sendEmail(new EmailOptions(content.subject, content.html, null, user.email));
        return content.html;
    }

    switch (customer.status) {
        case USER.status.active:
            throw new APIError(USERS_ERRORS.userExists.key, USERS_ERRORS.userExists.msg);

        case USER.status.pending:
            customer.token = await generateToken(customer._id.toString(),
                ACCESS_TOKEN_LIFETIME.verify);
            const content = accountVerifyTemplate(name, customer.token);
            sendEmail(new EmailOptions(content.subject, content.html, null, customer.email));
            return content.html;

        case USER.status.deleted:
            throw new APIError(USERS_ERRORS.deleted.key, USERS_ERRORS.deleted.msg);
    }
    throw new APIError(USERS_ERRORS.invalid.key, USERS_ERRORS.invalid.msg);
}


export interface ValidUser {
    _id: ObjectId;
    role: number;
}

// validate user for authorization
export async function validateUser(userId: string) {
    const user = await UsersModel.findById(userId);

    if (!user) {
        throw new APIError(USERS_ERRORS.notFound.key, USERS_ERRORS.notFound.msg);
    }

    switch (user.status) {
        case USER.status.active:
            return { role: user.role, _id: user._id }

        case USER.status.pending:
            throw new APIError(USERS_ERRORS.notVerified.key, USERS_ERRORS.notVerified.msg);

        case USER.status.deleted:
            throw new APIError(USERS_ERRORS.deleted.key, USERS_ERRORS.deleted.msg);

        default:
            throw new APIError(USERS_ERRORS.invalid.key, USERS_ERRORS.invalid.msg);
    }
}


// function to get logged in userś profile
export async function getUserProfile(user: ValidUser) {
    return await findUser({ _id: user._id, status: USER.status.active }, {
        name: 1,
        phone: 1,
        email: 1,
        role: 1,
        status: 1,
    });
}


export async function listUsers(user: ValidUser, q: ReqParams) {
    const query = {
        role: USER.roles.customer,
        ...q.filter
    }

    const select = {
        name: 1,
        email: 1,
        role: 1,
        status: 1
    }

    if (!q.options.sort) {
        q.options.sort = {
            name: "asc"
        }
    }
    const options = {
        ...q.options,
        lean: true
    }
    if (user.role === USER.roles.staff) {
        // get list of customers
        const [users, count] = await Promise.all([
            UsersModel.find(query, select, options),
            UsersModel.countDocuments(query),
        ]);

        return {
            data: users, count
        }
    }
    throw new APIError(AUTH_ERRORS.unauthorised.key, AUTH_ERRORS.unauthorised.key, UNAUTHORIZED);
}