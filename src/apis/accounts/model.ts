
import { currencies } from "../../objects/currencies";
import { Schema, Document, model } from "mongoose";
import { ObjectId } from "bson";
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
export class AccountClass {
    no: number;
    user: string;
    balance: number;
    currency: string;
    status: number;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    transactionInProgress: boolean;
    constructor(email: string, balance: number, currency: string,
        createdById?: string) {
        this.no = Date.now() / 100; // account number
        this.user = email;
        this.balance = balance;
        this.currency = currencies[currency];
        this.createdBy = createdById;
        this.updatedBy = this.createdBy;
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }
}