import {
    TransactionsModel, TransactionClass, TRANSACTION
} from "./model"
import { getAccountDetails } from "../accounts/module";
import { APIError, TRANSACTIONS_ERRORS, AUTH_ERRORS } from "../../utils/error";
import { ACCOUNT, AccountsModel } from "../accounts/model";
import { ValidUser } from "../users/module";
import { ReqParams } from "../../utils";
import { USER } from "../users/model";
import { UNAUTHORIZED } from "http-status-codes";
import { ObjectId } from "bson";
import { accountDebitedTemplate } from "../../utils/email-templates";
import { EmailOptions, sendEmail } from "../../utils/email";


// Credit money to account, this transaction can be performed after account is verified by staff
export async function credit(user: ValidUser, accountId: string, amount: number) {
    const account = await validateAccount(accountId, amount, user);
    // mark account as processing
    const transaction = await TransactionsModel.create(new TransactionClass(accountId, amount, TRANSACTION.type.credit, user._id));

    // increment account balance
    account.balance += amount;
    await account.save();

    // mark transaction as success
    transaction.status = TRANSACTION.status.success;
    await transaction.save();
    return true;
}


// Only client can debit, send email after money is deducted.
export async function debit(user: ValidUser, accountId: string, amount: number) {
    const account = await validateAccount(accountId, amount, user);

    // check if transaction is in progress
    if (account.transactionInProgress) {
        throw new APIError(TRANSACTIONS_ERRORS.inProgress.key, TRANSACTIONS_ERRORS.inProgress.msg);
    }

    // check if amount can be debited
    if (account.balance < amount) {
        throw new APIError(TRANSACTIONS_ERRORS.insufficientBalance.key, TRANSACTIONS_ERRORS.insufficientBalance.msg);
    }

    // mark transaction in progress so that same user is not performing same action from different device
    account.transactionInProgress = true;
    await account.save();

    // mark account as processing
    const transaction = await TransactionsModel.create(new TransactionClass(accountId, amount, TRANSACTION.type.debit, user._id));

    // decrement account balance
    account.balance -= amount;
    await account.save();

    // mark transaction as success
    transaction.status = TRANSACTION.status.success;
    await transaction.save();
    const content = accountDebitedTemplate(account.user.name, account._id, amount);
    sendEmail(new EmailOptions(content.subject, content.html, null, account.user.email));
    return true;
}


// validate if account is exist and is verified by staff member
async function validateAccount(accountId: string, amount: number, user: ValidUser) {
    if (!amount || isNaN(amount)) {
        throw new APIError(TRANSACTIONS_ERRORS.invalidAmount.key, TRANSACTIONS_ERRORS.invalidAmount.msg);
    }

    const query: any = {
        _id: accountId,
    };

    // customer can access only his account
    if (user.role === USER.roles.customer) {
        query.user = user._id;
    }
    // get account details
    const account: any = await getAccountDetails(query, {}, { lean: false });
    if (!account) {
        throw new APIError(TRANSACTIONS_ERRORS.invalidAccId.key, TRANSACTIONS_ERRORS.invalidAccId.msg);
    }

    // check if account is active
    if (account.status !== ACCOUNT.status.active) {
        throw new APIError(TRANSACTIONS_ERRORS.notActive.key, TRANSACTIONS_ERRORS.notActive.msg);
    }
    return account;
}

export async function listTransactions(user: ValidUser, q: ReqParams) {
    let query: any = {};
    if (q.filter) {
        query = {
            ...query,
        }
    };

    if (q.filter) {
        query.type = Number(q.filter.type)
    }
    switch (user.role) {
        // customer can view only his account trsancations
        case USER.roles.customer:
            // get users account numbers
            const accountIds = AccountsModel.distinct("_id", { user: user._id });
            query.account = accountIds;
            break;
        case USER.roles.staff:
            break;

        default:
            throw new APIError(AUTH_ERRORS.unauthorised.key, AUTH_ERRORS.unauthorised.msg, UNAUTHORIZED);
    }

    // get list of transactions
    const [data, count] = await Promise.all([
        TransactionsModel.find(query, {}, { ...q.options }).populate(
            { path: "account", populate: { path: "user", select: 'name email phone role status' } }),
        TransactionsModel.countDocuments(query),
    ]);

    // TransactionsModel.
    //     find({ name: 'Val' }).
    //     populate({
    //         path: 'friends',
    //         // Get friends of friends - populate the 'friends' array for every friend
    //         populate: { path: 'friends' }
    //     });

    return {
        data, count
    }

}
export async function getTransactionById(user: ValidUser, id: string) {
    const query: any = {};
    switch (user.role) {
        // customer can view only his account trsancations
        case USER.roles.customer:
            // get users account numbers
            const accountIds = AccountsModel.distinct("_id", { user: user._id });
            query.account = accountIds;
            break;
        case USER.roles.staff:
            break;

        default:
            throw new APIError(AUTH_ERRORS.unauthorised.key, AUTH_ERRORS.unauthorised.msg, UNAUTHORIZED);
    };

    const result = TransactionsModel.findOne(query, {}, { lean: true }).populate(
        { path: "account", populate: { path: "user", select: 'name email phone role status' } });

    return result;
}

// credit or debut transactions
export async function performTransaction(user: ValidUser, mode: number, accountId: string, amount: number) {
    switch (mode) {

        // alloed to staff and customer both
        case TRANSACTION.type.credit:
            await credit(user, accountId, amount);
            break;

        // The only coustomer can debit money from their account, send email notification after amout is debited
        case TRANSACTION.type.debit:
            await debit(user, accountId, amount);
            if (user.role !== USER.roles.customer) {
                throw new APIError(AUTH_ERRORS.unauthorised.key, AUTH_ERRORS.unauthorised.msg, UNAUTHORIZED);
            }
            break;

        default:
            throw new APIError(TRANSACTIONS_ERRORS.invalidMode.key, TRANSACTIONS_ERRORS.invalidMode.msg);
    }
    return "Transaction processed successfully."
}