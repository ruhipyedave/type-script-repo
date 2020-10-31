import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { APIResponse, processResponse } from "../../utils/response";
import { parseRequestParams } from "../../utils";
import { currencies } from "../../objects/currencies";
// get currencies
router.get('/', async (req, res, next) => {
    try {
        processResponse(res, new APIResponse(currencies, 1));
    } catch (error) {
        processError(res, error)
    }
});




export = router;