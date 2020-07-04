import * as bcrypt from "bcryptjs";
import { checkIfEmpty, getCurrentUnixTimeStamp } from ".";
import { APIError, AUTH_ERRORS } from "./error";
import jwt from 'jsonwebtoken';
const SECRET: string = "fCa_BRPu9r9UK-UP^w6rTUjL4IkoW0iT";

// validate password
export const validateAndHashPwd = async (pwd: string) => {
    pwd = pwd.toString().trim();
    if (checkIfEmpty(pwd)) {
        throw Error("Password should not contain spaces.");
    }
    const { length } = pwd;
    if ((length < 4) || (length > 20)) {
        throw Error("Password must me 4 to 20 characters long.");
    }
    pwd = await hashPwd(pwd);
    return pwd;
};

//  generate password hash
export async function hashPwd(pwd: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await bcrypt.hash(pwd, 10);
            resolve(hash);
        } catch (err) {
            throw err;
        }
    })
}

// return true if passward hashes match
export async function comparePasswords(pwd: string, pwdHash: string): Promise<boolean> {
    try {
        return await bcrypt.compare(pwd, pwdHash);
    } catch (error) {
        throw new APIError(AUTH_ERRORS.invalidPassword.key, AUTH_ERRORS.invalidPassword.msg);
    }
}


// generate token with expiry if user is valid
export async function generateToken(data: string, exp: number)
    : Promise<string> {
    exp = getCurrentUnixTimeStamp() + exp;
    return await jwt.sign({
        data, exp
    }, SECRET)
}

// verify token validity
export async function verifyToken(token: string)
    : Promise<string> {
    try {
        const result: any = await jwt.verify(token, SECRET);
        const data = result.data;
        if (checkIfEmpty(data)) {
            throw new APIError(AUTH_ERRORS.invalidToken.key, AUTH_ERRORS.invalidToken.msg);
        }
        if (getCurrentUnixTimeStamp() > result.exp) {
            throw new APIError(AUTH_ERRORS.expieredToken.key, AUTH_ERRORS.expieredToken.msg);
        }
        return data;
    } catch (error) {
        throw new APIError(AUTH_ERRORS.invalidToken.key, AUTH_ERRORS.invalidToken.msg);
    }
}
