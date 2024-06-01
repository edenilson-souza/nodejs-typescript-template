import { Channel } from "amqplib";
import { sendMessages } from "./Connection";

export default class HabbitMQ {
    constructor(readonly connection: Channel) {}

    async send(queue: string, message: string): Promise<any> {
        try {
            const conn = this.connection;
            if (!conn) {
                return false;
            }
            await sendMessages(conn, queue, message);
        } catch (e) {
            console.log(e);
        }
    }
}
