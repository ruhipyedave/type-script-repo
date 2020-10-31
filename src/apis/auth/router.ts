import { Router } from "express";
import { processError } from "../../utils/error";
const router = Router();
import { login, customerSignUp, verifyUser, logOut } from "./module";
import { APIResponse, processResponse } from "../../utils/response";

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
        const result = await customerSignUp(req.body.email, req.body.password, req.body.name,
        req.body.lname, res.locals.email, req.body.pinCode);
        processResponse(res, new APIResponse({ message: "Customer Created Successfully." }, 1));
    } catch (error) {
        processError(res, error)
    }
});

// any user who signups by default gets role of customer
router.get('/verify', async (req, res, next) => {
    try {
        const message: string = await verifyUser(req.query.token.toString());
        processResponse(res, new APIResponse({ message }, 1));
    } catch (error) {
        processError(res, error)
    }
});

// any user who signups by default gets role of customer
router.get('/logout', async (req, res, next) => {
    try {
        const message: string = await logOut(req.query.token.toString());
        processResponse(res, new APIResponse({ message }, 1));
    } catch (error) {
        processError(res, error)
    }
});

export = router;