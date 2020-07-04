import authRouter from "./auth/router";
// import usersRouter from "./users/router";
import accountsRouter from "./accounts/router";
// import transactionsRouter from "./transactions/router";
import express = require("express");
import { authenticate } from "../middlewares/auth";
const app: express.Application = express();

app.use("/auth", authenticate, authRouter);
app.use("/accounts", authenticate, accountsRouter);

export = app;