import {
    TransactionsModel, TransactionClass, TRANSACTION
} from "./model"
import { getAccountDetails } from "../accounts/module";
import { APIError, TRANSACTIONS_ERRORS } from "../../utils/error";
import { ACCOUNT } from "../accounts/model";


// Credit money to account, this transaction can be performed after account is verified by staff
export async function credit(accountId: string, amount: number, userId: string) {
    const account = await validateAccount(accountId, amount, userId);
    // mark account as processing
    const transaction = await TransactionsModel.create(new TransactionClass(accountId, amount, TRANSACTION.type.credit, userId));

    // increment account balance
    account.balance += amount;
    await account.save();

    // mark transaction as success
    transaction.status = TRANSACTION.status.success;
    await transaction.save();
    return true;
}


// Debit money from account, this transaction can be performed after account is verified by staff
export async function debit(accountId: string, amount: number, userId: string) {
    const account = await validateAccount(accountId, amount, userId);

    // check if transaction is in progress
    if (account.transactionInProgress) {
        throw new APIError(TRANSACTIONS_ERRORS.inProgress.key, TRANSACTIONS_ERRORS.inProgress.msg);
    }

    // check if amount can be debited
    if (account.balance < amount) {
        throw new APIError(TRANSACTIONS_ERRORS.insufficientBalance.key, TRANSACTIONS_ERRORS.insufficientBalance.msg);
    }

    // mark account as processing
    const transaction = await TransactionsModel.create(new TransactionClass(accountId, amount, TRANSACTION.type.debit, userId));

    // decrement account balance
    account.balance -= amount;
    await account.save();

    // mark transaction as success
    transaction.status = TRANSACTION.status.success;
    await transaction.save();
    return true;
}


// validate if account is exist and is verified by staff member
async function validateAccount(accountId: string, amount: number, userId: string) {
    if (!amount || isNaN(amount)) {
        throw new APIError(TRANSACTIONS_ERRORS.invalidAmount.key, TRANSACTIONS_ERRORS.invalidAmount.msg);
    }
    // get account details
    const account = await getAccountDetails({ _id: accountId, user: userId, status: ACCOUNT.status.active }, {}, { lean: false });
    if (!account) {
        throw new APIError(TRANSACTIONS_ERRORS.invalidAccId.key, TRANSACTIONS_ERRORS.invalidAccId.msg);
    }
    return account;
}