import { PrismaClient } from "@prisma/client";
import signale from "signale";
import Connection from "./Connection";
import prismaClient from "./PrismaClient";

export class PostgreSQLAdapter implements Connection {
    connection: PrismaClient;

    constructor() {
        this.connection = prismaClient;
    }

    async connect(): Promise<PrismaClient> {
        if (process.env.DATABASE_ACTIVE === "false") {
            signale.warn("Database is disabled");
            return this.connection;
        }
        await this.connection
            .$connect()
            .then(() => {
                signale.success("Connected to database");
            })
            .catch((error: any) => {
                signale.error("Error connecting to database");
                signale.error(error);
                process.exit(1);
            });
        return this.connection;
    }

    async close(): Promise<void> {
        await this.connection.$disconnect().then(() => {
            signale.success("Disconnected from database");
        });
    }
}

export default new PostgreSQLAdapter();
