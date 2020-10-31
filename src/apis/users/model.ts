import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import _ from "underscore";
import { ObjectId } from "bson";
import { USERS_ERRORS, APIError } from "../../utils/error";

export const USER = {
    roles: {
        // admin: 1
        staff: 2,
        customer: 3
    },
    status: {
        pending: 1, // on signup status is pending
        active: 2, // after email verification status changes to active, only active users an login the application
        deleted: 3 // set status to deleted when user is deleted
    }
}

const usersSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            default: null
        },
        email: {
            type: String, trim: true,
            required: [true, "Email is required."],
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            unique: true
        },
        phone: {
            type: Number,
            min: 1000000000,
            max: 999999999999999,
            default: null
        },
        role: {
            type: Number,
            require: true,
            enum: Object.values(USER.roles),
            default: USER.roles.customer
        },
        token: {
            type: String,
            default: null,
        },
        pwdHash: {
            type: String, trim: true,
            required: [true, "Password is required."],
        },
        status: {
            type: Number,
            enum: Object.values(USER.status),
            default: USER.status.pending
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
        }
    },
    { timestamps: true }
);


usersSchema.index({ email: 1 }, { unique: true });



export class UserClass {
    name: string;
    lname: string;
    email: string;
    postCode: string;
    phone?: number;
    pwdHash: string;
    status: number;
    role: number;
    token: string;
    createdBy?: string;
    updatedBy?: string;
    constructor(email: string, pwd: string, role: number = USER.roles.staff,
        name?: string, lname?: string, phone?: number,
        createdBy?: string, postCode?: string
    ) {
        if (name) {
            this.name = name;
        }
        if (lname) {
            this.lname = lname;
        }

        if (phone) {
            this.phone = phone;
        }

        if (postCode) {
            this.postCode = postCode;
        }
        this.email = email;
        this.pwdHash = pwd;

        switch (role) {
            case USER.roles.customer:
                this.role = USER.roles.customer;
                this.status = USER.status.pending;
                break;

            case USER.roles.staff:
                this.role = USER.roles.staff;
                this.status = USER.status.active;
                break;
            default:
                throw new APIError(USERS_ERRORS.invalidRole.key, USERS_ERRORS.invalidRole.msg);
        }

        if (createdBy) {
            this.createdBy = createdBy;
            this.updatedBy = createdBy;
        }
    }
}




