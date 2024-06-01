import signale from "signale";
import elasticSearch from "../infra/elasticSearch";
import RedisServer from "../infra/redis";

export async function gracefulShutdown(signal: any, HttpServer: any, appListen: any, connectionAdapter: any) {
    if (signal) signale.info(`Received signal ${signal}`);
    signale.success("Gracefully closing http server");

    try {
        await connectionAdapter.close();
        await RedisServer.stop();
        await elasticSearch.stop();
        HttpServer.close(function (err: any) {
            if (err) {
                signale.error("There was an error", err.message);
                process.exit(1);
            } else {
                signale.success("http server closed successfully. Exiting!");
                process.exit(0);
            }
        });

        if (appListen.closeAllConnections) appListen.closeAllConnections();
        else setTimeout(() => process.exit(0), 5000);
    } catch (err: any) {
        signale.error("There was an error", err.message);
        setTimeout(() => process.exit(1), 500);
    }
}
