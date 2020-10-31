import { UserClass, USER } from "./model";
import { checkIfEmpty, ReqParams } from "../../utils";
import { USERS_ERRORS, APIError, ACCOUNTS_ERRORS, AUTH_ERRORS } from "../../utils/error";
import { generateToken } from "../../utils/auth";
import { ACCESS_TOKEN_LIFETIME } from "../auth/module";
import { UNAUTHORIZED } from "http-status-codes";
import { ObjectId } from "bson";

import { users, customers } from "../../objects/users";

export async function findUser(email: string): Promise<UserClass> {
    return users[email];
}

export async function createCustomer(email: string, pwd: string, name: string,
    lname: string, createdBy?: string, postCode?: string) {
    if (checkIfEmpty(name)) {
        throw new APIError(USERS_ERRORS.missingName.key, USERS_ERRORS.missingName.msg);
    }

    // check if customer exists
    const customer = await findUser(email);

    // if custoer does not exist create a new account for the customer
    if (!customer) {
        const user = new UserClass(email, pwd, USER.roles.customer, name, lname, null, createdBy, postCode);
        user.token = await generateToken(user.email, ACCESS_TOKEN_LIFETIME.verify);
        customers[user.email] = user;
        return user;
    }

    throw new APIError(USERS_ERRORS.userExists.key, USERS_ERRORS.userExists.msg);
}


export interface ValidUser {
    _id: ObjectId;
    role: number;
}




// function to get logged in userś profile
export async function getUserProfile(user: UserClass) {
    return {
        name: user.name,
        email: user.email,
        role: user.role,
        status: 1,

    }
    // return await findUser({ _id: user._id, status: USER.status.active }, {
    //     name: 1,
    //     phone: 1,
    //     email: 1,
    //     role: 1,
    //     status: 1,
    // });
}



export function listCustomers(user: UserClass, q: ReqParams) {
    const result = Object.values(customers);
    return {
        data: result,
        count: result.length
    }
}

export function listUsers(user: UserClass, q: ReqParams) {
    return listCustomers(user, q);

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
        // const [users, count] = await Promise.all([
        //     UsersModel.find(query, select, options),
        //     UsersModel.countDocuments(query),
        // ]);

        // return {
        //     data: users, count
        // }
    }
    throw new APIError(AUTH_ERRORS.unauthorised.key, AUTH_ERRORS.unauthorised.msg, UNAUTHORIZED);
}