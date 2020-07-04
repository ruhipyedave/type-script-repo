import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { createAccount } from "./module";
import { APIResponse, processResponse } from "../../utils/response";

// create account
router.post('/', async (req, res, next) => {
    try {
        const result = await createAccount(res.locals.user, req.body.email, req.body.password);
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});

export = router;