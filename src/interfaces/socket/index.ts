import signale from "signale";
import WebSocket from "ws";
import { createRandomUUID } from "../../util";
import RoutesSocket from "./routes";

export interface EventSocketInterface {
    start(serverHttp: any): void;
    on(event: string, callback: (data: any, socket?: WebSocket) => void): void;
    emit(event: string, data: any): Promise<void>;
    off(event: string, callback: (data: any, socket?: WebSocket) => void): void;
    broadcast(event: string, data: any): void;
    close(): void;
}

export class SocketServer implements EventSocketInterface {
    private readonly server: WebSocket.Server;
    private readonly eventCallbacks = new Map<string, Array<(data: any, socket?: WebSocket) => void>>();

    constructor() {
        this.server = new WebSocket.Server({ noServer: true });
    }

    start(serverHttp: any): void {
        this.listenEvents();
        this.attachToHttpServer(serverHttp);
        RoutesSocket.start();
        signale.success(`WebSocket Server Running on Port ${process.env.PORT ?? ""}`);
    }

    on(event: string, callback: (data: any, socket?: WebSocket) => void): void {
        if (!this.eventCallbacks.has(event)) {
            this.eventCallbacks.set(event, []);
        }
        this.eventCallbacks.get(event)?.push(callback);
    }

    async emit(event: string, data: any, socket?: WebSocket): Promise<void> {
        const callbacks = this.eventCallbacks.get(event);
        if (callbacks != null) {
            callbacks.forEach(callback => {
                callback(data, socket);
            });
        }
    }

    off(event: string, callback: (data: any) => void): void {
        const callbacks = this.eventCallbacks.get(event);
        if (callbacks != null) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    close(): void {
        this.server.close();
    }

    private attachToHttpServer(serverHttp: any): void {
        serverHttp.on("upgrade", (request: any, socket: any, head: any) => {
            this.server.handleUpgrade(request, socket, head, socket => {
                this.server.emit("connection", socket, request);
                this.onConnection(socket);
            });
        });
    }

    private onConnection(socket: WebSocket): void {
        const clientId = this.generateUniqueID();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        socket.clientId = clientId;
        signale.success("New client connected! ✅", clientId);
        this.listen(socket);
        socket.on("close", () => {
            signale.success("user disconnected");
        });
    }

    private listen(socket: WebSocket): void {
        socket.on("message", message => {
            try {
                const parsedMessage = JSON.parse(message.toString());

                const event = parsedMessage.event;
                const data = parsedMessage.data;

                this.emit(event, data, socket);
            } catch (error: any) {
                signale.error(error);
                socket.send(JSON.stringify({ event: "error", data: error.message }));
            }
        });
    }

    private listenEvents(): void {
        this.on("enviarMessagem", data => {
            signale.error(data);
        });
    }

    broadcast(event: string, data: any): void {
        const message = JSON.stringify({ event, data });
        this.server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    private generateUniqueID(): string {
        return createRandomUUID();
    }
}

export default new SocketServer();
