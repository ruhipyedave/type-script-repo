import { currencies } from "./currencies";


// import { currencies } from "./currencies";
import { AccountClass } from "../apis/accounts/model";



export let accounts: { [key: string]: AccountClass } = {
    "one@customer.com": new AccountClass("one@customer.com", 3000, currencies.inr, "one@staff.com"),
    "two@customer.com": new AccountClass("two@customer.com", 10000, currencies.inr,  "one@staff.com"),
};