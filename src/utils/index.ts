import { Request } from "express";
import _ from "underscore";
// function to convert string to number if its a valid number
export function convertToNumber(str: string | number) {
    const num = parseInt(str.toString(), 10);
    if (!num || isNaN(num)) {
        return false;
    }
    return num;
}

// return true if value is null or empty or undefined
export function checkIfEmpty(value: string) {
    if (value === undefined || value == null || /^\s*$/.test(value)) {
        return true;
    }
    return false;
}


// get current unix time stamp
export function getCurrentUnixTimeStamp() {
    return Math.floor(Date.now() / 1000)
}


export class ReqParams {
    filter?: { [key: string]: string; };
    search?: string;
    options: {
        sort?: { [key: string]: string; };
        limit?: number;
        skip?: number;
    }
}

// get pagination params
export function parseRequestParams(req: Request) {
    const q = req.query;

    let limit = parseInt(q.limit.toString(), 10);
    let skip = parseInt(q.offset.toString(), 10);
    if (isNaN(limit)) {
        limit = 10;
    }
    if (isNaN(skip)) {
        skip = 0;
    }

    const result: ReqParams = {
        options: {
            limit, skip
        }
    }

    const filter = req.query.filter.toString().split(",");
    if (filter.length) {
        result.filter = {};
        _.each(filter, (ele) => {
            const [attr, val] = ele.split(":");
            result.filter[attr.trim()] = val.trim();
        })
    }

    const sortArr = req.query.filter.toString().split(",");
    if (sortArr.length) {
        const sort: {
            [key: string]: string;
        } = {};
        _.each(sort, (ele) => {
            const [attr, val] = ele.split(":");
            if (val === "asc" || val === "desc") {
                sort[attr.trim()] = val.trim();
            }
        });

        if (Object.keys(sort).length > 0) {
            result.options.sort = sort;
        }
    }



    if (req.query.search && checkIfEmpty(req.query.search.toString())) {
        result.search = req.query.search.toString().trim();
    }

    return result;
}