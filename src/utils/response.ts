import { OK } from "http-status-codes";
import { Response } from "express";

export class APIResponse {
    public success: boolean;
    public data: object[] | object;
    public count: number;
    constructor(
        data: object[] | object,
        count: number = 1,
    ) {
        this.success = true;
        this.data = data;
        this.count = count;
    }
}

export async function processResponse(res: Response, result: APIResponse) {
    res.status(OK).send(result);
}