import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { createAccount, getAccountDetailsById, listAccounts, getAccountDetails } from "./module";
import { APIResponse, processResponse } from "../../utils/response";
import { parseRequestParams } from "../../utils";

// create account
router.post('/', async (req, res, next) => {
    try {
        const result = await createAccount(res.locals.user, req.body.email, req.body.currency);
        processResponse(res, new APIResponse({
            data: result,
            message: "Account created successfully"
        }, 1));
    } catch (error) {
        processError(res, error)
    }
});

// get account details
router.get('', async (req, res, next) => {
    try {
        const result = await getAccountDetails(res.locals.user);
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});






export = router;