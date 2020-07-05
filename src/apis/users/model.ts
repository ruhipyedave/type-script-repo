import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import _ from "underscore";
import { ObjectId } from "bson";
import { USERS_ERRORS, APIError } from "../../utils/error";
const SALT_WORK_FACTOR = 10;

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

usersSchema.pre<User>('save', function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('pwdHash')) {
        return next();
    }
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) return next(error);
        // hash the password using our new salt
        bcrypt.hash(user.pwdHash, salt, (err, hash) => {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.pwdHash = hash;
            next();
        });
    });
});

export interface User extends Document {
    name: string;
    email: string;
    phone: number;
    pwdHash: string;
    status: number;
    role: number;
    token: string;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
}

export class UserClass {
    name: string;
    email: string;
    phone: number;
    pwdHash: string;
    status: number;
    role: number;
    token: string;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    constructor(email: string, pwd: string, role: number = USER.roles.staff,
        name?: string, phone?: number, createdBy?: ObjectId
    ) {
        if (name) {
            this.name = name;
        }

        if (phone) {
            this.phone = phone;
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

const DEFAULT_USERS = [
    new UserClass("one@staff.com", "one@staff", USER.roles.staff, "One Staff", 1234567890),
    new UserClass("two@staff.com", "two@staff", USER.roles.staff, "Two Staff", 1234567890),
    new UserClass("one@customer.com", "one@customer", USER.roles.customer, "One Customer", 1234567890),
    new UserClass("two@customer.com", "two@customer", USER.roles.customer, "Two Customer", 1234567890),
];

export let UsersModel = model<User>("users", usersSchema);

// Self executing anonymous function to add default users if not exists
((users) => {
    // Whatever is here will be executed as soon as the script is loaded.
    UsersModel.countDocuments({}).then((count) => {
        if (!count) {
            UsersModel.create(users).then(() => {
                UsersModel.updateMany({}, { status: USER.status.active }).exec();
            });
        }
    })
})(DEFAULT_USERS);

