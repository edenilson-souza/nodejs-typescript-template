import socketServer, { SocketServer } from ".";

//ENVIAR LOG VIA SOCKET

export class RoutesSocket {
    constructor(readonly socket: SocketServer) {}

    start() {
        //ENVIAR LOG VIA SOCKET
        // EventHandle.on(LIST_EVENTS.SAVE_LOG, (data: EH_SEND_TYPE) => {
        //     this.socket.emit("saveLog", data);
        // });
    }
}

export default new RoutesSocket(socketServer);
