import { Schema, Document, model } from "mongoose";
import { ObjectId } from "bson";
import { APIError } from "../../utils/error";
import { ACCOUNTS_ERRORS } from "../../utils/error";
import { checkIfEmpty } from "../../utils";

export const ACCOUNT = {
    type: {
        saving: 1, // deposit account with limited transactions
        current: 2 // for daily transactions
    },
    status: {
        pending: 1, // default status
        active: 2, // on approval of account status changes from pending to active
        inactive: 3, // on reject status changes from pending to inactive
        deleted: 4 // when account is deleted status changes to deleted
    }
}

const accountsSchema = new Schema(
    {
        user: {  // user to which this account belongs to
            type: ObjectId,
            ref: "users",
            default: null
        },
        balance: {
            type: Number, // account balance
            require: true,
            default: 0
        },
        type: {
            type: Number,
            require: true,
            enum: Object.values(ACCOUNT.type),
            default: ACCOUNT.type.current
        },
        status: {
            type: Number,
            enum: Object.values(ACCOUNT.status),
            default: ACCOUNT.status.pending
        },
        createdBy: {
            type: ObjectId,
            ref: "users",
            default: null
        },
        updatedBy: {
            type: ObjectId,
            ref: "users",
            default: null
        },
        transactionInProgress: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export interface Account extends Document {
    user: ObjectId;
    balance: number;
    type: number;
    status: number;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    transactionInProgress: boolean;
}

export let AccountsModel = model<Account>("accounts", accountsSchema);

export class AccountClass {
    user: ObjectId;
    balance: number;
    type: number;
    status: number;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    transactionInProgress: boolean;
    constructor(userId: ObjectId | string, balance: number, type: number,
        status?: number, createdById?: ObjectId | string) {
        this.user = new ObjectId(userId);
        this.balance = balance;
        switch (type) {
            case ACCOUNT.type.current:
            case ACCOUNT.type.saving:
                this.type = type;
                break;
            default:
                throw new APIError(ACCOUNTS_ERRORS.invalidType.key, ACCOUNTS_ERRORS.invalidType.msg);
        }
        if (status) {
            this.status = status;
        }
        this.createdBy = createdById && checkIfEmpty(createdById.toString()) ? this.user : new ObjectId(createdById);
        this.updatedBy = this.createdBy;
    }
}