import EventHandle from "..";
import { LIST_EVENTS } from "../Events";
import { EmailListeners } from "../email/EmailListeners";
import { LogsListeners } from "../logs/LogsListeners";
import { EH_SEND_TYPE } from "../logs/types";

export function EventHandleListeners() {
    new JobsListeners().listen();
    new LogsListeners().listen();
    new EmailListeners().listen();
    // new MetricsListerners().listen();
}

class JobsListeners {
    listen() {
        EventHandle.on(LIST_EVENTS.CHECK_TODO, (data: EH_SEND_TYPE) => {
            console.log("CHECK TODO:", data);
        });
    }
}

// class MetricsListerners {
//     listen() {
//         EventHandle.on(LIST_EVENTS.SAVE_METRICS, (data: EH_SEND_TYPE) => {
//             console.log("METRICA SALVA:", data);
//         });
//     }
// }
