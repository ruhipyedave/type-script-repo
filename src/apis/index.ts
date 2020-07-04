import authRouter from "./auth/router";
import express = require("express");
const app: express.Application = express();

app.use("/auth", authRouter);

export = app;