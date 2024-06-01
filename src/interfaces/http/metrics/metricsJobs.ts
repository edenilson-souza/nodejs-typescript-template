import { Request, Response } from "express";
import { REQUEST_ACTIVE_COUNTER, REQUEST_COUNTER_BY_MINUTE, REQUEST_COUNTER_TOTAL, RESQUEST_RESPONSE_TIME } from "./metrics";

var cluster = require("cluster");

let workerID: string | number = "master";
let pid: any;

if (cluster.isMaster) {
    workerID = "master";
} else if (cluster.isWorker) {
    workerID = cluster.worker.id;
}

export function MetricsJobs(req: Request, res: Response, next: any) {
    const start = Date.now();

    if (pid == undefined) {
        pid = "pid" in process ? process.pid : "null";
    }

    const labels = { method: req.method, path: req.path, status: res.statusCode.toString(), worker: workerID, pid: pid };

    REQUEST_ACTIVE_COUNTER.inc(labels);
    REQUEST_COUNTER_TOTAL.inc(labels);
    REQUEST_COUNTER_TOTAL.inc();
    REQUEST_COUNTER_BY_MINUTE.inc(labels);

    res.on("finish", () => {
        const elapsedTime = (Date.now() - start) / 1000;
        const status = res.statusCode.toString();
        RESQUEST_RESPONSE_TIME.labels(req.method, req.path, status, workerID.toString(), pid).observe(elapsedTime);
        REQUEST_ACTIVE_COUNTER.dec(labels);
    });

    next();
}

setInterval(async () => {
    // const request_counter_total = await REQUEST_COUNTER_TOTAL.get();
    // const request_value_total = request_counter_total.values.length > 0 ? request_counter_total.values[0].value : 0;
    // const rate_request = request_value_total / (process.uptime() || 1);

    // REQUEST_RATE_SECONDS.set(rate_request);

    REQUEST_COUNTER_BY_MINUTE.reset();
}, 1000 * 60);
