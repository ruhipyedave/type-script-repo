import { AccountsModel, AccountClass } from "./model";
import { ValidUser, validateUser } from "../users/module";
import { USER } from "../users/model";

// create new account
export async function createAccount(user: ValidUser, bal: number, type: number, custId?: string) {
    let account: AccountClass;
    // if customer create his own account
    if (user.role === USER.roles.customer) {
        account = await new AccountClass(user._id, bal, type);
    } // if staff then create customers account
    else {
        // check if user is active then only create account
        await validateUser(custId);
        account = await new AccountClass(user._id, bal, type);
    }
    return await AccountsModel.create(account);
}

// get account details by id
export async function getAccountDetails(query: object, select: object,
    options: object = { lean: true }) {
    return await AccountsModel.findOne(query, select, options);
}