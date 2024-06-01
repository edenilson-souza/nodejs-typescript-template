import { SEND_MAIL_EVENT } from "../eventHandle/email/mail";
import { EH_SEND_TYPE } from "../eventHandle/logs/types";

export interface IEmailService {
    send(event: string, data: EH_SEND_TYPE): void;
}

export class EmailService implements IEmailService {
    send(event: string, data: EH_SEND_TYPE) {
        console.log("Email enviado");
        SEND_MAIL_EVENT(event, data);
    }
}

export class EmailServiceMock implements IEmailService {
    send(event: string, data: EH_SEND_TYPE) {
        console.log("Email enviado mock:", event, data);
    }
}

export default new EmailService();
