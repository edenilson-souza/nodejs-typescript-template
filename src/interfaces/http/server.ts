import express, { Request, Response } from "express";
import { register } from "prom-client";

import swaggerDocument from "./swagger-output.json";

import { PrismaClient } from "@prisma/client";
import { MetricsJobs } from "./metrics/metricsJobs";
import routes, { setConnection } from "./routes";

const app = express();

export default class HttpServer {
    constructor(readonly connection: PrismaClient) {}

    start() {
        //CORS
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
            res.header("Access-Control-Allow-Methods", "*"); // GET, PUT, POST, DELETE, OPTIONS
            res.header("Access-Control-Allow-Headers", "*"); // Origin, X-Requested-With, Content-Type, Accept, Authorization
            next();
        });

        //BODY PARSER
        app.use(express.json());

        //METRICS
        app.use((req, res, next) => MetricsJobs(req, res, next));

        //SWAGGER
        const swaggerUi = require("swagger-ui-express");
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        //ROUTES
        setConnection(this.connection);
        app.use("/api/v1", routes);

        //METRICS
        app.get("/metrics", checkAuthToken, async (req, res) => {
            /*
                #swagger.tags = ['Métricas']
            */
            res.set("Content-Type", register.contentType);
            res.end(await register.metrics());
        });

        return app;
    }

    getAppServer(): express.Application {
        return app;
    }
}

const authToken = process.env.METRICS_TOKEN;
function checkAuthToken(req: Request, res: Response, next: any) {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${authToken}`) {
        return next();
    } else {
        return res.status(401).send("Acesso não autorizado");
    }
}
