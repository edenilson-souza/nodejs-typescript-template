import { Counter, Gauge, Histogram, collectDefaultMetrics } from "prom-client";

const prefix = "";

const config = {
    timeout: 5000,
    prefix: prefix
};

collectDefaultMetrics(config);

export const REQUEST_COUNTER_TOTAL = new Counter({
    name: prefix + "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "path", "status", "worker", "pid"]
});

// export const REQUEST_RATE_SECONDS = new Gauge({
//     name: prefix + "http_request_rate_seconds",
//     help: "Current HTTP request rate (req/s)",
//     labelNames: ["method", "path", "status", "worker", "pid"]
// });

export const REQUEST_COUNTER_BY_MINUTE = new Gauge({
    name: prefix + "http_total_requests_per_minute",
    help: "Total number of HTTP requests per minute",
    labelNames: ["method", "path", "status", "worker", "pid"]
});

export const REQUEST_ACTIVE_COUNTER = new Gauge({
    name: prefix + "http_total_active_requests",
    help: "Total number of active HTTP requests",
    labelNames: ["method", "path", "status", "worker", "pid"]
});

export const RESQUEST_RESPONSE_TIME = new Histogram({
    name: prefix + "http_response_time",
    help: "Response time in seconds for all routes",
    labelNames: ["method", "path", "status", "worker", "pid"],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
});
