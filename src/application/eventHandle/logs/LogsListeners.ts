import signale from "signale";
import EventHandle from "..";
import prismaClient from "../../../infra/database/PrismaClient";
import NewDate from "../../../util/NewDate";
import { LIST_EVENTS } from "../Events";
import { EH_SEND_TYPE } from "../logs/types";

export class LogsListeners {
    listen() {
        const connection = prismaClient;
        EventHandle.on(LIST_EVENTS.SAVE_LOG, async (data: EH_SEND_TYPE) => {
            if (process.env.DATABASE_ACTIVE != "true") return;
            if (data.action || data.created_by) {
                await connection.log_Atividade.create({
                    data: {
                        ...data,
                        entity: data.entity ?? "Log",
                        timestamp: data.timestamp ?? NewDate.toUTC()
                    }
                });
            }
        });
        EventHandle.on(LIST_EVENTS.SAVE_LOG, async (data: EH_SEND_TYPE) => {
            signale.info("Log: ", data);
        });
    }
}
