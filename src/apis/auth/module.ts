import { checkIfEmpty } from "../../utils";
import { APIError, AUTH_ERRORS } from "../../utils/error";
import { findUser, createCustomer } from "../users/module";
import { USER } from "../users/model";
import { generateToken, comparePasswords, verifyToken } from "../../utils/auth";
export const ACCESS_TOKEN_LIFETIME = {
    login: 60 * 60 * 24, // 24 hrs,
    verify: 60 * 60 // 1 hr
};
export async function login(email: string, pwd: string)
    : Promise<string> {
    if (checkIfEmpty(email)) {
        throw new APIError(AUTH_ERRORS.emptyEmail.key, AUTH_ERRORS.emptyEmail.msg);
    }
    email = email.toString().trim();
    if (checkIfEmpty(pwd)) {
        throw new APIError(AUTH_ERRORS.emptyPwd.key, AUTH_ERRORS.emptyPwd.msg);
    }
    pwd = pwd.toString().trim();
    const user = await findUser(email);
    if (!user) {
        throw new APIError(AUTH_ERRORS.authenticationFailed.key, AUTH_ERRORS.authenticationFailed.msg);
    }
    // compare password hash
    const success = await comparePasswords(pwd, user.pwdHash);
    if (success !== true) {
        throw new APIError(AUTH_ERRORS.authenticationFailed.key, AUTH_ERRORS.authenticationFailed.msg);
    }
    // 24 hr token expiry
    user.token = await generateToken(user.email, ACCESS_TOKEN_LIFETIME.login);
    // update token
    return user.token;
}

// create a customer account
export async function customerSignUp(email: string, pwd: string, name: string,
    lname: string, postCode: string, createdBy: string) {
    if (checkIfEmpty(email)) {
        throw new APIError(AUTH_ERRORS.emptyEmail.key, AUTH_ERRORS.emptyEmail.msg);
    }
    email = email.toString().trim();
    if (checkIfEmpty(pwd)) {
        throw new APIError(AUTH_ERRORS.emptyPwd.key, AUTH_ERRORS.emptyPwd.msg);
    }
    pwd = pwd.toString().trim();
    return createCustomer(email, pwd, name, lname, createdBy, postCode);
}

// activate users account so that user can login and user the application
export async function verifyUser(token: string) {
    const userId = await verifyToken(token);
    // const user = await findUser({ _id: userId, status: USER.status.pending }, {}, { lean: false });
    // if (!user) {
    //     throw new APIError(AUTH_ERRORS.expieredToken.key, AUTH_ERRORS.expieredToken.msg);
    // }
    // // Token is valid, so activate the user
    // user.status = USER.status.active
    // user.token = null;
    // user.save();
    return "Verfication is complete, Please login to start using the application.";
}


export async function logOut(token: string) {
    // blacklist used token
    return "Logged out successfully."
}