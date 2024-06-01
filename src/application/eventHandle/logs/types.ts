export type EH_SEND_TYPE = {
    message: string;
    level: "info" | "error" | "warning" | "debug" | "success" | "critical" | "alert" | "emergency";
    status?: number;
    entity?: string;
    data?: any;
    action?: string
    timestamp?: Date;
    created_by?: string;
    system?: string;
    stack?: string;
};
