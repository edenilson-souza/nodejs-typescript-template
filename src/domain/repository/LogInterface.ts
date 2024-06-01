export interface ILogRepository {
    deleteOldLogs(): Promise<void>;
}
