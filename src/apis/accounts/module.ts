import { AccountsModel, AccountClass } from "./model";


export async function createAccount(userId: string, bal: number, type: number) {
    return await AccountsModel.create(new AccountClass(userId, bal, type))
}