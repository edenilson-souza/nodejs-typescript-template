import { createClient } from "redis";
import signale from "signale";
import { ErrorEvent } from "../../util/errorHandle";

export class RedisServer {
    redisClient: any;

    constructor() {}

    async start() {
        try {
            if (!process.env.REDIS_ACTIVE) return;
            if (process.env.REDIS_ACTIVE == "false") return;
            if (!process.env.REDIS_URL) return;
            if (this.redisClient) return;

            const redisClient = createClient({
                url: process.env.REDIS_URL
            });

            if (!redisClient) return undefined;

            await redisClient.connect();

            this.redisClient = redisClient;

            signale.success("Redis connected");
        } catch (error: any) {
            this.stop();
            if (error.code == "ECONNREFUSED") {
                return new ErrorEvent({ message: "Redis offline", data: error, level: "warning", entity: "Redis" }).throw();
            }
            return new ErrorEvent({ message: error.message, level: "warning", entity: "Redis" }).throw();
        }
    }

    async stop() {
        if (!this.redisClient) return;
        await this.redisClient.disconnect();
        this.redisClient = undefined;
        signale.success("Redis disconnected");
    }

    async saveDataToRedis(cacheKey: string, data: { data: any; totalCount?: number }, time: number = 30) {
        try {
            const redisClient = this.redisClient;
            if (!redisClient) await this.start();
            if (redisClient) {
                await redisClient.setEx(cacheKey, time, JSON.stringify(data));
            }
        } catch (error) {
            return;
        }
    }
}

export default new RedisServer();
