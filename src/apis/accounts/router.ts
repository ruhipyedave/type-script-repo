import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { createAccount, getAccountDetailsById, listAccounts } from "./module";
import { APIResponse, processResponse } from "../../utils/response";
import { parseRequestParams } from "../../utils";

// create account
router.post('/', async (req, res, next) => {
    try {
        const result = await createAccount(res.locals.user, req.body.type);
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});

// list accounts
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
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});



export = router;