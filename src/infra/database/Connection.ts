import { PrismaClient } from "@prisma/client";

export default interface Connection {
    connect(): Promise<PrismaClient>;
    close(): Promise<void>;
}
