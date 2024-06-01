import client, { Channel, Connection } from "amqplib";

// Function to send some messages before consuming the queue
export async function sendMessages(channel: Channel, queue: string, message: string) {
    await channel.assertQueue(queue, { autoDelete: false });
    channel.sendToQueue(queue, Buffer.from(message));
}

// consumer for the queue.
// We use currying to give it the channel required to acknowledge the message
/* s */

export async function connectionMQ(): Promise<Channel> {
    if (process.env.RABBITMQ_ACTIVE != "true") {
        return null as any;
    }
    const connection: Connection = await client.connect(process.env.RABBITMQ_URL ?? "amqp://localhost:5672");

    // Create a channel
    const channel: Channel = await connection.createChannel();
    return channel;
    // Makes the queue available to the client

    // Send some messages to the queue
    /*   sendMessages(channel) */
    // Start the consumer
    /* await channel.consume('myQueue', consumer(channel)) */
}
