//istanbul ignore file
import dotenv from "dotenv";
import signale from "signale";
dotenv.config();

//SERVERS
import HttpServer from "./interfaces/http/server";
import SocketServer from "./interfaces/socket";
import SSEServer from "./interfaces/sse";

//INFRA
import PostgreSQLAdapter from "./infra/database";
import elasticSearch from "./infra/elasticSearch";
import RedisServer from "./infra/redis";

//APPLICATION
import EventHandle from "./application/eventHandle";
import { SEND_LOG_EVENT } from "./application/eventHandle/logs/logs";
import WorkerJobs from "./application/workers/jobs";
import { getCommonNetworkInterface } from "./util/os";
import { gracefulShutdown } from "./util/shutdown";

process.env.TZ = "America/Sao_Paulo";

async function main() {
    try {
        //DATABASE CONNECTION
        const connection = await PostgreSQLAdapter.connect();

        //WORKER CRON
        WorkerJobs.start();

        //EVENTS SERVER
        await elasticSearch.start();
        EventHandle.listen();

        //REDIS SERVER
        RedisServer.start();

        //HTTP SERVER
        const httpApp = new HttpServer(connection);
        const app = httpApp.start();

        //HTTP LISTEN
        const port = process.env.PORT ?? "3031";
        var httpserver = app.listen(port, () => {
            signale.success(`HTTP Server running at http://localhost:${port}`);
        });

        // // SSE SERVER
        const sseServer = SSEServer;
        sseServer.start(app);

        // // SOCKET SERVER
        const socketServer = SocketServer;
        socketServer.start(httpserver);

        SEND_LOG_EVENT({
            message: "Servidor iniciado com sucesso",
            data: {
                ips: getCommonNetworkInterface()
            },
            entity: "Server",
            level: "success"
        });

        process.on("SIGINT", () => gracefulShutdown("SIGINT", httpserver, httpserver, PostgreSQLAdapter));
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM", httpserver, httpserver, PostgreSQLAdapter));
    } catch (error) {
        console.log(error);
        await SEND_LOG_EVENT({ message: "Erro ao iniciar servidor", entity: "Server", data: { error }, level: "error" });
        process.exit(1);
    }
}

main();
