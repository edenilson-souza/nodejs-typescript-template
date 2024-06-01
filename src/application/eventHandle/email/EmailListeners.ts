import EventHandle from "..";
import { sendMail } from "../../../infra/email/sendMail";
import { LIST_EVENTS } from "../Events";
import { EH_SEND_TYPE } from "../logs/types";

export class EmailListeners {
    listen() {
        EventHandle.on(LIST_EVENTS.SEND_MAIL, async (data: EH_SEND_TYPE) => {
            if (process.env.SMTP_ACTIVE !== "true") return;
            const { to, subject, text } = data.data;
            await sendMail(to, subject, text);
        });
        EventHandle.on(LIST_EVENTS.TODO_CREATED, (data: EH_SEND_TYPE) => {
            console.log("EMAIL DE TODO CRIADO:", data);
        });
    }
}
