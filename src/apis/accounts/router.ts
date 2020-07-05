import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { createAccount, getAccountDetailsById, listAccounts, changeStatusOfAccount } from "./module";
import { APIResponse, processResponse } from "../../utils/response";
import { parseRequestParams } from "../../utils";

// create account
router.post('/', async (req, res, next) => {
    try {
        const result = await createAccount(res.locals.user, req.body.type, req.body.email);
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});

// get account details by account id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await getAccountDetailsById(res.locals.user, req.params.id);
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});

// list accounts
router.get('/', async (req, res, next) => {
    try {
        const query = parseRequestParams(req);
        const result = await listAccounts(res.locals.user, query);
        processResponse(res, new APIResponse(result.data, result.count));
    } catch (error) {
        processError(res, error)
    }
});

// accept or reject account or delete account, send email notification to customer in case
// account is deleted
router.patch('/:id', async (req, res, next) => {
    try {
        const message = await changeStatusOfAccount(res.locals.user, req.params.id, req.body.status);
        processResponse(res, new APIResponse({ message }, 1));
    } catch (error) {
        processError(res, error)
    }
});



export = router;