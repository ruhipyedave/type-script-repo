import { OK } from "http-status-codes";
import { Response } from "express";

export class APIResponse {
    public success: boolean;
    public data: object[] | object;
    public count: number;
    public limit: number;
    public offset: number;
    public page: number;
    public pages: number;
    constructor(
        data: object[] | object,
        count: number = 1,
        limit?: number,
        offset?: number,
        page?: number,
        pages?: number
    ) {
        this.success = true;
        this.data = data;
        this.count = count;
        if (limit) {
            this.limit = limit;
        }

        if (offset) {
            this.offset = offset;
        }

        if (page) {
            this.page = page;
        }

        if (pages) {
            this.pages = pages;
        }
    }
}

export interface PaginationResult {
    docs: []; // Array of documents
    total: number; // Total number of documents in collection that match a query
    limit: number; // Limit that was used
    page: number; // Only if specified or default page/offset values were used
    pages: number; // Only if page specified or default page/offset values were used
    offset: number; // Only if specified or default page/offset values were used
}

// export class FindResult {
//     data: object[];
//     count?: number;
//     limit?: number;
//     offset?: number;
//     page?: number;
//     pages?: number;

//     constructor(
//         data: object[],
//         count: number,
//         limit?: number,
//         offset?: number,
//         page?: number,
//         pages?: number
//     ) {
//         this.data = data;
//         this.count = count;

//         if (limit) {
//             this.limit = limit;
//         }

//         if (offset) {
//             this.offset = offset;
//         }

//         if (page) {
//             this.page = page;
//         }

//         if (pages) {
//             this.pages = pages;
//         }
//     }
// }


export async function processResponse(res: Response, result: APIResponse) {
    res.status(OK).send(result);
}