import { Schema, Document, model } from "mongoose";
import { ObjectId } from "bson";
import { APIError, TRANSACTIONS_ERRORS } from "../../utils/error";
import { ACCOUNTS_ERRORS } from "../../utils/error";
import { checkIfEmpty } from "../../utils";

export const TRANSACTION = {
    type: {
        credit: 1, // withdraw money from bank
        debit: 2 // deposit money in bank
    },
    status: {
        processing: 1, // transaction in progress
        success: 2, // success completed transaction
        failed: 3, // transiction failed
    }
}

const transcrtionsSchema = new Schema(
    {
        account: {  // Account to which the amount should be credited or debited
            type: ObjectId,
            ref: "users",
            default: null,
            required: true,
        },
        amount: { // amount to be creadited or debited
            type: Number,
            required: true,
            default: 0
        },
        type: { // credit or debit
            type: Number,
            required: true,
            enum: Object.values(TRANSACTION.type),
            default: TRANSACTION.type.credit
        },
        status: { // transaction state
            type: Number,
            enum: Object.values(TRANSACTION.status),
            default: TRANSACTION.status.processing,
            required: true,
        },
        createdBy: {
            type: ObjectId,
            ref: "users",
            default: null,
        },
        updatedBy: {
            type: ObjectId,
            ref: "users",
            default: null,
        }
    },
    { timestamps: true }
);

export interface Tansaction extends Document {
    account: ObjectId;
    amount: number;
    type: number;
    status: number;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export let TransactionsModel = model<Tansaction>("transactions", transcrtionsSchema);

export class TransactionClass {
    account: ObjectId;
    amount: number;
    type: number;
    status: number;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    constructor(accountId: ObjectId | string, amount: number, type: number,
        createdById?: ObjectId | string) {
        this.account = new ObjectId(accountId);
        this.amount = amount;
        switch (type) {
            case TRANSACTION.type.credit:
            case TRANSACTION.type.debit:
                this.type = type;
                break;
            default:
                throw new APIError(TRANSACTIONS_ERRORS.invalidType.key, TRANSACTIONS_ERRORS.invalidType.msg);
        }
        this.status = TRANSACTION.status.processing;
        this.createdBy = new ObjectId(createdById);
        this.updatedBy = this.createdBy;
    }
}