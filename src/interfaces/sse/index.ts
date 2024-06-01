import { Request, Response } from "express";
import signale from "signale";
import { EventHandle, EventHandleInterface, SendEvent } from "../../application/eventHandle";
import { PacientesControllerSSE, RoutesSSE } from "./routes";

export interface SSEServerInterface {
    start(app: any): void;
    getHandle(): EventHandleInterface;
}

export class SSEServer implements SSEServerInterface {
    private eventHandleSSE: EventHandleInterface;

    constructor() {
        this.eventHandleSSE = new EventHandle();
        // this.eventHandleSSE = eventHandle;
    }

    start(app: any): void {
        app.get("/sse", (req: Request, res: Response) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");

            const heartbeatInterval = setInterval(() => {
                res.write(":heartbeat\n\n");
            }, 5000);

            const event = req.query.event as string;
            const routesSSE = new RoutesSSE(this.eventHandleSSE);

            const sendEvent: SendEvent = (data: Object) => {
                let id = "";
                const digits = "0123456789";
                for (let i = 0; i < 8; i++) {
                    id += digits.charAt(Math.floor(Math.random() * digits.length));
                }
                res.write(`id: ${id}\n`);
                res.write(`event: ${event}\n`);
                res.write(`data: ${JSON.stringify(data)} \n\n`);
            };

            routesSSE.createListeners(event, sendEvent);

            return res.on("close", () => {
                clearInterval(heartbeatInterval);
                routesSSE.removeListeners(event, sendEvent);
                return res.end();
            });
        });

        app.get("/test", (req: Request, res: Response) => {
            const pacientesController = new PacientesControllerSSE(this.eventHandleSSE);
            pacientesController.GetPaciente();
            res.send("ok");
        });

        signale.success(`SSE Server Running on Port ${process.env.PORT ?? ""}`);
    }

    getHandle(): EventHandleInterface {
        return this.eventHandleSSE;
    }
}

export default new SSEServer();
