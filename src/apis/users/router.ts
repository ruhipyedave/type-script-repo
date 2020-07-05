import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { getUserProfile, listUsers } from "./module";
import { APIResponse, processResponse } from "../../utils/response";
import { parseRequestParams } from "../../utils";

// get user profile
router.get('/profile', async (req, res, next) => {
    try {
        const result = await getUserProfile(res.locals.user);
        processResponse(res, new APIResponse(result, 1));
    } catch (error) {
        processError(res, error)
    }
});


// get user profile
router.get('/', async (req, res, next) => {
    try {
        const query = parseRequestParams(req);
        const result = await listUsers(res.locals.user, query);
        processResponse(res, new APIResponse(result.data, result.count));
    } catch (error) {
        processError(res, error)
    }
});

export = router;