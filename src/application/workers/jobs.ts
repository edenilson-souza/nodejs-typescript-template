import cron from "node-cron";
import signale from "signale";

//https://www.npmjs.com/package/node-cron
//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *

//EXAMPLES
// * * * * * - Run every minute
// */15 * * * * - Run every 15 minutes
// 0 1 * * * - Run every day at 1:00
// 1-5 * * * * - Run every minute from 1 to 5
// * * * Jan,Sep Sun - Run every minute in January and September on Sundays

export class WorkerJobs {
    constructor() {}

    start() {
        try {
            if (process.env.RUN_JOBS !== "true") return;
            cron.schedule(
                "*/5 * * * * *",
                async () => {
                    signale.info("Running Cron Job every 5 seconds");
                },
                {
                    scheduled: true,
                    timezone: "America/Sao_Paulo"
                }
            );
            signale.success(`Worker jobs is running`);
        } catch (error) {
            signale.error(`Worker jobs is not running`);
        }
    }
}

export default new WorkerJobs();
