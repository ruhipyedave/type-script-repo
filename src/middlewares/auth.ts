import { verifyToken } from "../utils/auth";
import { APIError, AUTH_ERRORS, processError } from "../utils/error";
import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from "http-status-codes";
import { validateUser } from "../apis/users/module";
import { ObjectId } from "bson";
const ALLOWED_ROUTES = [
    "/login",
    "/signup",
    "/verify"
]

const ROUTES_WITH_AUTH = [
    "/auth/verify",
    "/users",
    "/accounts",
    "/transactions"
]

// authentication middleware
export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    if (ALLOWED_ROUTES.includes(path)) {
        return next();
    }
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.replace("Bearer", '').trim();
            const userId = await verifyToken(token);
            res.locals.user = await validateUser(userId);
            return next();
        } catch (error) {
            return processError(res, error, UNAUTHORIZED);
        }
    }
    return processError(res, new APIError(AUTH_ERRORS.accquireToken.key,
        AUTH_ERRORS.accquireToken.msg), UNAUTHORIZED);
}