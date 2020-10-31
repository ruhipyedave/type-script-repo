import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from "cors";
export const DEFAULT_ROUTER = "/api/v1";
import { swaggerDocument } from "./doc/swagger";
import * as swaggerUi from "swagger-ui-express";
import apiRouter from "./apis";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(cors());
        this.express.use(logger("dev"));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        this.express.use(`${DEFAULT_ROUTER}`, apiRouter);
        this.express.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        this.express.use("/", (req, res, next) => {
            res.status(404).send({ message: "Hello World!" });
        });
    }
}

export default new App().express;