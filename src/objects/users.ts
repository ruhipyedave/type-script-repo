import { UserClass } from "../apis/users/model";
import { USER } from "../apis/users/model";



export let staff: { [key: string]: UserClass} = {
    "one@staff.com": new UserClass("one@staff.com", "one@customer.com", USER.roles.staff, "One Staff"),
    "two@staff.com": new UserClass("two@staff.com", "one@customer.com", USER.roles.staff, "Two Staff"),
};

export let customers: { [key: string]: UserClass} = {
    "one@customer.com": new UserClass("one@customer.com", "one@customer.com", USER.roles.customer, "One Customer"),
    "two@customer.com": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com1": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com2": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com3": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com4": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com6": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com7": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com8": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com10": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com11": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com12": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com13": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com14": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com15": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com16": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com17": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
    "two@customer.com18": new UserClass("two@customer.com", "one@customer.com", USER.roles.customer, "Two Customer"),
};

export let users: { [key: string]: UserClass } = {
    ...staff, ...customers
};