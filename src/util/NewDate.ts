import { ErrorHandle, ErrorMessage } from "./errorHandle";

export default class NewDate extends Date {
    private constructor(date: Date | number | string = new Date()) {
        super(date);
    }

    static toUTC(local_date?: Date | string | number): NewDate {
        if (local_date === undefined) return new NewDate();
        if (typeof local_date === "number") return new NewDate(local_date);
        if (typeof local_date === "string" && local_date.length == 10) {
            local_date = new Date(converterFormatoData(local_date));
            return new NewDate(local_date.getTime() + local_date.getTimezoneOffset() * 60 * 1000);
        }
        if (typeof local_date === "string") {
            return new NewDate(local_date);
        }
        return new NewDate(local_date);
    }

    static toLOCAL(utc_date?: Date | string | number): NewDate {
        if (utc_date === undefined) return new NewDate(Date.now() - new Date().getTimezoneOffset() * 60 * 1000);
        if (typeof utc_date === "number") return new NewDate(utc_date);
        if (typeof utc_date === "string" && utc_date.length == 10) {
            utc_date = new Date(converterFormatoData(utc_date));
            return new NewDate(utc_date.getTime());
        }
        if (typeof utc_date === "string") {
            utc_date = new Date(utc_date);
            return new NewDate(utc_date.getTime() - 2 * utc_date.getTimezoneOffset() * 60 * 1000);
        }
        return new NewDate(utc_date);
    }
}

export function getDataBrasil(): Date {
    const dataAtual = new Date();
    const fusoHorarioBrasil = "America/Sao_Paulo";
    const brasilData = new Date(dataAtual.toLocaleString("en-US", { timeZone: fusoHorarioBrasil }));
    return brasilData;
}

export function formatarData(data: Date): string {
    return data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function converterFormatoData(date: string): string {
    if (date.includes("T")) date = date.split("T")[0];
    if (date.includes("-")) {
        const [ano, mes, dia] = date.split("-");
        verificarFormato(ano, mes, dia);
        return date;
    }
    if (date.includes("/")) {
        const [dia, mes, ano] = date.split("/");
        verificarFormato(ano, mes, dia);
        return `${ano}-${mes}-${dia}`;
    }
    ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
}

export function converterFormatoDataBR(date: string): string {
    if (date.includes("T")) date = date.split("T")[0];
    if (date.includes("-")) {
        const [ano, mes, dia] = date.split("-");
        verificarFormato(ano, mes, dia);
        return `${dia}/${mes}/${ano}`;
    }
    if (date.includes("/")) {
        const [dia, mes, ano] = date.split("/");
        verificarFormato(ano, mes, dia);
        return date;
    }
    ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
}

function verificarFormato(ano: string, mes: string, dia: string) {
    if (ano.length !== 4) ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
    if (mes.length !== 2) ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
    if (dia.length !== 2) ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
    if (parseInt(mes) > 12 || parseInt(mes) <= 0) ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
    if (parseInt(dia) > 31 || parseInt(dia) <= 0) ErrorHandle(ErrorMessage({ message: "Data inválida", level: "info", status: 400 }));
}
