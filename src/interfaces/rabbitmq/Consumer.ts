import { Channel, Message } from "amqplib";
import { connectionMQ } from "./Connection";
import { ErrorEvent } from "../../util/errorHandle";

export default class RabbitMQConsumer {
    private channel: Channel | undefined;

    constructor(private readonly queueName: string) {}

    async startConsuming(execute: Function): Promise<void> {
        try {
            this.channel = await connectionMQ();

            if (!this.channel) {
                return new ErrorEvent({ message: "Channel is not available", level: "critical", entity: "RabbitMQ" }).throw();
            }

            await this.channel.assertQueue(this.queueName, { durable: false });

            console.log(`[*] Waiting for messages in queue '${this.queueName}'. To exit press CTRL+C`);

            this.channel.consume(this.queueName, (msg: Message | null) => {
                if (msg !== null) {
                    console.log(`[x] Received message: ${msg.content.toString()}`);
                    execute(msg.content.toString());
                    // Acknowledge the message
                    this.channel!.ack(msg);
                }
            });
        } catch (error) {
            console.error("Error occurred while consuming messages:", error);
        }
    }

    async stopConsuming(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
    }
}

// // Usage example:
// const consumer = new RabbitMQConsumer("example_queue");
// consumer.startConsuming().catch(console.error);
