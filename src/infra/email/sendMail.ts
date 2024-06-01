import nodemailer from "nodemailer";
import signale from "signale";
import { SEND_LOG_EVENT } from "../../application/eventHandle/logs/logs";

export async function sendMailWithRetry(destinatario: string, assunto: string, corpo: string, maxRetentativas: number, tempoEsperaSegs: number): Promise<void> {
    let tentativas = 0;

    while (tentativas < maxRetentativas) {
        try {
            if (process.env.SMTP_ACTIVE !== "true") return;
            await sendMail(destinatario, assunto, corpo);
            return;
        } catch (error) {
            signale.error(`Erro ao enviar o e-mail. Tentativa ${tentativas + 1}/${maxRetentativas}`);
            tentativas++;

            if (tentativas < maxRetentativas) {
                signale.info(`Aguardando ${tempoEsperaSegs} segundos antes de tentar novamente...`);
                await aguardar(tempoEsperaSegs * 1000);
            }
        }
    }

    signale.error("Falha ao enviar o e-mail após várias tentativas.");
}

export async function sendMail(destinatario: string, assunto: string, corpo: string): Promise<void> {
    try {
        if (process.env.SMTP_ACTIVE !== "true") return;

        let transporter = nodemailer.createTransport(
            process.env.SMTP_HOST! == "localhost"
                ? {
                      host: process.env.SMTP_HOST!,
                      port: parseInt(process.env.SMTP_PORT ?? "1025")
                  }
                : {
                      service: "Gmail",
                      auth: {
                          user: process.env.SMTP_EMAIL,
                          pass: process.env.SMTP_PASSWORD
                      }
                  }
        );

        let emailOptions = {
            from: process.env.SMTP_EMAIL,
            to: destinatario,
            subject: assunto,
            html: corpo
        };
        let info = await transporter.sendMail(emailOptions);
        signale.success("E-mail enviado: ", info.response);
        SEND_LOG_EVENT({
            data: { to: destinatario, subject: assunto, text: corpo },
            message: "E-mail enviado: " + info.response,
            level: "info",
            entity: "Email",
            action: "SEND_MAIL"
        });
    } catch (error: any) {
        signale.error("Erro ao enviar o e-mail: ", error);
        SEND_LOG_EVENT({
            data: { to: destinatario, subject: assunto, text: corpo },
            message: error.message,
            level: "critical",
            entity: "Email"
        });
        //SALVAR NA FILA PARA TENTAR NOVAMENTE MAIS TARDE
    }
}

function aguardar(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
