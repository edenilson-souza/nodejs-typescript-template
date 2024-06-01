import { Request, Response } from "express";
import RedisServer from ".";
import { StatusHandle } from "../../interfaces/http/statusHandle/StatusHandle";

export async function saveDataToRedis(cacheKey: string, data: { data: any; totalCount?: number }, time: number = 30) {
    try {
        const redisClient = RedisServer.redisClient;
        if (!redisClient) await RedisServer.start();
        if (redisClient) {
            await redisClient.setEx(cacheKey, time, JSON.stringify(data));
            // await RedisServer.stop();
        }
    } catch (error) {
        return;
    }
}

async function redisSubscribe(req: Request, res: Response, next: any) {
    try {
        const { preferred_username: username } = req.body.userInfo;
        const cacheKey = req.baseUrl + req.path + JSON.stringify(req.query) + JSON.stringify(req.params) + username;

        const redisClient = RedisServer.redisClient;
        if (!redisClient) await RedisServer.start();
        if (!redisClient) return await next(req, res);

        const value = await redisClient.get(cacheKey);
        // await RedisServer.stop();

        if (value == null) {
            return await next(req, res);
        }

        return StatusHandle(res, JSON.parse(value));
    } catch (error) {
        //SAVE LOG ERROR
        return await next(req, res);
    }
}

// Middleware para verificar o cache antes de executar uma rota
export const cacheMiddleware = async (req: Request, res: Response, next: any) => {
    try {
        return redisSubscribe(req, res, next);
    } catch (error: any) {
        if (error.message == "Socket already opened") {
            return redisSubscribe(req, res, next);
        }

        return next(req, res);
    }
};
