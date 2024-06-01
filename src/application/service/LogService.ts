import { SEND_LOG_EVENT } from "../eventHandle/logs/logs";
import { EH_SEND_TYPE } from "../eventHandle/logs/types";

export interface ILogService {
    send(data: EH_SEND_TYPE): void;
}

export class LogService implements ILogService {
    send(data: EH_SEND_TYPE) {
        SEND_LOG_EVENT(data);
    }
}

export class LogServiceMock implements ILogService {
    send(data: EH_SEND_TYPE) {
        console.log("Log enviado mock:", data);
    }
}

export default new LogService();
