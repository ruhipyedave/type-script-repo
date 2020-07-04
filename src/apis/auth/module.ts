import { checkIfEmpty } from "../../utils";
import { APIError, AUTH_ERRORS } from "../../utils/error";
import { findUser, createCustomer } from "../users/module";
import { USER, UsersModel } from "../users/model";
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
    const user = await findUser({ email, status: [USER.status.active, USER.status.pending] }, {}, { lean: false });
    if (!user) {
        throw new APIError(AUTH_ERRORS.authenticationFailed.key, AUTH_ERRORS.authenticationFailed.msg);
    }

    if (user.status === USER.status.pending) {
        throw new APIError(AUTH_ERRORS.notVerifiedUser.key, AUTH_ERRORS.notVerifiedUser.msg);
    }
    // compare password hash
    const success = await comparePasswords(pwd, user.pwdHash);
    if (success !== true) {
        throw new APIError(AUTH_ERRORS.authenticationFailed.key, AUTH_ERRORS.authenticationFailed.msg);
    }
    // 24 hr token expiry
    user.token = await generateToken(user._id, ACCESS_TOKEN_LIFETIME.login);
    // update token
    user.save();
    return user.token;
}

// create a customer account
export async function customerSignUp(email: string, pwd: string, name: string,
    account?: { type: number, balance: number }
) {
    if (checkIfEmpty(email)) {
        throw new APIError(AUTH_ERRORS.emptyEmail.key, AUTH_ERRORS.emptyEmail.msg);
    }
    email = email.toString().trim();
    if (checkIfEmpty(pwd)) {
        throw new APIError(AUTH_ERRORS.emptyPwd.key, AUTH_ERRORS.emptyPwd.msg);
    }
    pwd = pwd.toString().trim();
    await createCustomer(email, pwd, name, account);
    return "Please check your email inbox to verify your account."
}

// activate users account so that user can login and user the application
export async function verifyUser(token: string) {
    const userId = await verifyToken(token);
    const user = await findUser({ _id: userId, status: USER.status.pending }, {}, { lean: false });
    if (!user) {
        throw new APIError(AUTH_ERRORS.expieredToken.key, AUTH_ERRORS.expieredToken.msg);
    }
    // Token is valid, so activate the user
    user.status = USER.status.active
    user.token = null;
    user.save();
    return "Verfication is complete, Please login to start using the application.";
}