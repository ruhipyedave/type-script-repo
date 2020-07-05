import { AccountsModel, AccountClass, ACCOUNT } from "./model";
import { ValidUser, validateUser, findUser, createCustomer } from "../users/module";
import { USER } from "../users/model";
import { ReqParams, checkIfEmpty } from "../../utils";
import { USERS_ERRORS, APIError, AUTH_ERRORS, ACCOUNTS_ERRORS } from "../../utils/error";
import { UNAUTHORIZED } from "http-status-codes";
import { EmailOptions, sendEmail } from "../../utils/email";
import { accountDeletedTemplate } from "../../utils/email-templates";

// create new account
export async function createAccount(user: ValidUser, type: number, custEmail?: string) {
    let account: AccountClass;
    switch (user.role) {
        // if customer create his own account
        case USER.roles.customer:
            account = await new AccountClass(user._id, 0, type);
            break;

        // if staff then create customers account
        case USER.roles.staff:
            if (checkIfEmpty(custEmail)) {
                throw new APIError(USERS_ERRORS.missingCustEmail.key, USERS_ERRORS.missingCustEmail.msg);
            }
            // check if customer exist
            let customer = await findUser({ email: custEmail });

            // if customer not exist create new ciustomer with default password
            if (customer == null) {
                // create new user
                await createCustomer(custEmail, "password", custEmail, user._id);
                customer = await findUser({ email: custEmail });
            }

            // if customer exist and is deleted then throw error
            if (customer.status === USER.status.deleted) {
                throw new APIError(USERS_ERRORS.deleted.key, USERS_ERRORS.deleted.msg);
            }

            // create account for customer
            account = await new AccountClass(user._id, 0, type);
            break;

        default:
            throw new APIError(AUTH_ERRORS.unauthorised.msg, AUTH_ERRORS.unauthorised.key, UNAUTHORIZED);
    }
    return await AccountsModel.create(account);
}

// get account details by id
export async function getAccountDetails(query: object, select: object,
    options: object = { lean: true }) {
    return await AccountsModel.findOne(query, select, options).populate("user");
}


// view selected accounts details
export async function getAccountDetailsById(user: ValidUser, accId: string) {
    const query: any = {
        _id: accId,
    }
    // customer can view only his account
    if (user.role === USER.roles.customer) {
        query.user = user._id;
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
    // get list of accounts
    const [accounts, count] = await Promise.all([
        AccountsModel.find(query, {}, { lean: true, ...q.options }).populate({ path: "user", select: 'name email phone role status' }),
        AccountsModel.countDocuments(query),
    ]);

    return {
        data: accounts, count
    }
}

// this function allows staff memeber to accept ot reject or delete account
export async function changeStatusOfAccount(
    user: ValidUser, accId: string, status: number) {
    let message = "";

    if (user.role !== USER.roles.staff) {
        throw new APIError(AUTH_ERRORS.unauthorised.msg, AUTH_ERRORS.unauthorised.key, UNAUTHORIZED);
    }

    const account: any = await AccountsModel.findById(accId).populate({ path: "user", select: 'name email phone role status' })

    if (!account) {
        throw new APIError(ACCOUNTS_ERRORS.notFound.msg, ACCOUNTS_ERRORS.notFound.key);

    }

    switch (status) {
        // accept account application
        case ACCOUNT.status.active:
            account.status = status;
            message = "Account application accepted.";
            break;

        // reject account application
        case ACCOUNT.status.inactive:
            account.status = status;
            message = "Account application rejected.";
            break;

        // delete account application and send notification email to user
        case ACCOUNT.status.deleted:
            account.status = status;
            // send email
            const content = accountDeletedTemplate(account.user.name, account._id);
            sendEmail(new EmailOptions(content.subject, content.html, null, account.user.email));
            message = "Account application deleted.";
            break;

        default:
            throw new APIError(ACCOUNTS_ERRORS.invalidType.key, ACCOUNTS_ERRORS.invalidType.msg);

    }
    account.save();
    return message;
}