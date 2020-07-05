import { AccountsModel, AccountClass } from "./model";
import { ValidUser, validateUser } from "../users/module";
import { USER } from "../users/model";
import { ReqParams } from "../../utils";

// create new account
export async function createAccount(user: ValidUser, type: number, custId?: string) {
    let account: AccountClass;
    // if customer create his own account
    if (user.role === USER.roles.customer) {
        account = await new AccountClass(user._id, 0, type);
    } // if staff then create customers account
    else {
        // check if user is active then only create account
        await validateUser(custId);
        account = await new AccountClass(user._id, 0, type);
    }
    return await AccountsModel.create(account);
}

// get account details by id
export async function getAccountDetails(query: object, select: object,
    options: object = { lean: true }) {
    return await AccountsModel.findOne(query, select, options);
}


// view selected accounts details
export async function getAccountDetailsById(user: ValidUser, accId: string) {
    const query: any = {
        _id: accId,
    }
    // customer can view only his account
    if (user.role === USER.roles.customer) {
        query.user = user.role;
    }
    return await AccountsModel.findOne(query, {}, { lean: true });
}

// list accounts
export async function listAccounts(user: ValidUser, q: ReqParams) {
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
    return await AccountsModel.find(query, {}, { lean: true, ...q.options });
}