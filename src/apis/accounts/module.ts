import { AccountClass} from "./model";
import { ValidUser, findUser } from "../users/module";
import { USER, UserClass } from "../users/model";
import { ReqParams, checkIfEmpty } from "../../utils";
import { USERS_ERRORS, APIError, AUTH_ERRORS, ACCOUNTS_ERRORS } from "../../utils/error";
import { UNAUTHORIZED } from "http-status-codes";
import { accounts } from "../../objects/accounts";

// create new account
export async function createAccount(user: UserClass, custEmail: string, currency: string) {
    switch (user.role) {

        // if staff then create customers account
        case USER.roles.staff:
            if (checkIfEmpty(custEmail)) {
                throw new APIError(USERS_ERRORS.missingCustEmail.key, USERS_ERRORS.missingCustEmail.msg);
            }
            // check if customer exist
            const customer = await findUser(custEmail);

            // if customer not exist create new ciustomer with default password
            if (customer == null) {
                throw new APIError(USERS_ERRORS.notFound.key, USERS_ERRORS.notFound.msg);
            }

            // create account for customer
            return new AccountClass(custEmail, 0, currency, user.email);

        default:
            throw new APIError(AUTH_ERRORS.unauthorised.msg, AUTH_ERRORS.unauthorised.key, UNAUTHORIZED);
    }
}

// get current users account details
export async function getAccountDetails(user: UserClass){
    return accounts[user.email];
}


// view selected accounts details
export function getAccountDetailsById(user: ValidUser, accId: string) {
    const query: any = {
        _id: accId,
    }
    // customer can view only his account
    if (user.role === USER.roles.customer) {
        query.user = user._id;
    }
    return {}
}

// list accounts
export function listAccounts(user: ValidUser, q: ReqParams) {
    let query: any = {};
    if (q.filter) {
        query = {
            ...query,
            ...q.filter,
        }
    }
    // customer can view only his accounts
    if (user.role === USER.roles.customer) {
        query.user = user._id;
    }


    return {
        data: [""], count: 0
    }
}

