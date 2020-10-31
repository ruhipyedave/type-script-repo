import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { performTransaction, listTransactions } from "./module";
import { APIResponse, processResponse } from "../../utils/response";
import { parseRequestParams } from "../../utils";

// list transactions
router.get('/', async (req, res, next) => {
    try {
        const query = parseRequestParams(req);
        const result = await listTransactions(res.locals.user, query);
        processResponse(res, new APIResponse(result.data, result.count));
    } catch (error) {
        processError(res, error)
    }
});



// make transaction can be either credit or debit
router.post('/', async (req, res, next) => {
    try {
        const message = await performTransaction(res.locals.user, req.body.mode, req.body.accId, req.body.amount);
        processResponse(res, new APIResponse({ message }, 1));
    } catch (error) {
        processError(res, error)
    }
});

export = router;