import { Router } from "express";
import { processError } from "../../util/error";
const router = Router();
import { login, customerSignUp } from "./module";
import { APIResponse, processResponse } from "../../util/response";

router.post('/login', async (req, res, next) => {
    try {
        const token: string = await login(req.body.email, req.body.password);
        processResponse(res, new APIResponse({ token }, 1));
    } catch (error) {
        processError(res, error)
    }
});

// any user who signups by default gets role of customer
router.post('/signup', async (req, res, next) => {
    try {
        const message: string = await customerSignUp(req.body.email, req.body.password, req.body.name);
        processResponse(res, new APIResponse({ message }, 1));
    } catch (error) {
        processError(res, error)
    }
});

export = router;