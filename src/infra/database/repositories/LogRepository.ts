import { PrismaClient } from "@prisma/client";
import { ILogService } from "../../../application/service/LogService";
import { ILogRepository } from "../../../domain/repository/LogInterface";
import NewDate from "../../../util/NewDate";

export class LogRepository implements ILogRepository {
    constructor(private readonly connection: PrismaClient = new PrismaClient(), private readonly LogService: ILogService = LogService) {}

    async deleteOldLogs(): Promise<void> {
        const threeMonthsAgo = NewDate.toUTC();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        try {
            await this.connection.log_Atividade.deleteMany({
                where: {
                    timestamp: {
                        lte: threeMonthsAgo
                    }
                }
            });

            this.LogService.send({
                message: "Logs mais antigos do que três meses foram deletados com sucesso.",
                entity: "LogRepository",
                level: "info",
                action: "deleteOldLogs"
            });
        } catch (error: any) {
            this.LogService.send({
                message: `Erro ao deletar logs antigos: ${error.message}`,
                entity: "LogRepository",
                level: "error",
                action: "deleteOldLogs"
            });
            throw error;
        }
    }
}
