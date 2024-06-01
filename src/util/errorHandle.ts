import { Prisma } from "@prisma/client";
import OrError, { TOrError } from "orerror";
import { SEND_LOG_EVENT } from "../application/eventHandle/logs/logs";
import { EH_SEND_TYPE } from "../application/eventHandle/logs/types";
import NewDate from "./NewDate";

export class ErrorEvent extends OrError {
    constructor(data: TOrError) {
        super(data);
    }
}

export function ErrorHandle(error: Error | string | number | object | null | undefined): never {
    if (!error) {
        SEND_LOG_EVENT({ message: "Erro desconhecido", data: { error }, level: "critical", entity: "ErrorHandle" });
        throw new Error(ErrorMessage({ message: "Erro desconhecido", level: "critical", status: 500 }));
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        SEND_LOG_EVENT({
            message: "Erro do tipo PrismaClientValidationError",
            data: { ...error, message: error },
            level: "critical",
            entity: "ErrorHandle"
        });
        throw new Error(ErrorMessage({ message: "Erro ao validar os dados", level: "critical", status: 500 }));
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        SEND_LOG_EVENT({
            message: "Erro do tipo PrismaClientUnknownRequestError",
            data: { ...error, message: error },
            level: "critical",
            entity: "ErrorHandle"
        });
        throw new Error(ErrorMessage({ message: "Erro ao validar os dados", level: "critical", status: 500 }));
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        SEND_LOG_EVENT({
            message: "Erro do tipo PrismaClientKnownRequestError",
            data: { ...error, message: error },
            level: "critical",
            entity: "ErrorHandle"
        });
        throw new Error(ErrorMessage({ message: "Erro ao realizar a operação no banco de dados", level: "critical", status: 500 }));
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
        SEND_LOG_EVENT({
            message: "Erro do tipo PrismaClientInitializationError",
            data: { ...error, message: error },
            level: "critical",
            entity: "ErrorHandle"
        });
        throw new Error(ErrorMessage({ message: "Erro ao realizar a operação no banco de dados", level: "critical", status: 500 }));
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
        SEND_LOG_EVENT({
            message: "Erro do tipo PrismaClientRustPanicError",
            data: { ...error, message: error },
            level: "critical",
            entity: "ErrorHandle"
        });
        throw new Error(ErrorMessage({ message: "Erro ao realizar a operação no banco de dados", level: "critical", status: 500 }));
    } else if (error instanceof Error) {
        SEND_LOG_EVENT({ message: "Erro do tipo Error", data: { ...error, message: error }, level: "error", entity: "ErrorHandle" });
        throw new Error(error.message);
    } else if (typeof error === "string" || error instanceof String) {
        SEND_LOG_EVENT({ message: "Erro do tipo String", data: { error }, level: "error", entity: "ErrorHandle" });
        throw new Error(String(error));
    } else if (typeof error === "object") {
        const jsonString = JSON.stringify(error).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
        if (jsonString !== "{}") {
            SEND_LOG_EVENT({ message: "Erro do tipo Object", data: { error }, level: "error", entity: "ErrorHandle" });
            throw new Error(jsonString);
        }
    }

    //ERROR DESCONHECIDO
    SEND_LOG_EVENT({ message: "Erro desconhecido", data: { error }, level: "critical", entity: "ErrorHandle" });
    throw new Error(ErrorMessage({ message: "Erro desconhecido", level: "critical", status: 500 }));
}

export function ErrorMessage(data: EH_SEND_TYPE): string {
    const debugFlag = process.env.DEBUG === "true" ? true : false;
    return JSON.stringify({ ...data, timestamp: NewDate.toUTC(), ...(debugFlag && { stack: new Error().stack }) });
}

export const MessageError = {
    CREATED_AT_REQUIRED: { message: "Data de criação é obrigatória", level: "error", status: 400 } as EH_SEND_TYPE,
    UPDATED_AT_REQUIRED: { message: "Data de atualização é obrigatória", level: "error", status: 400 } as EH_SEND_TYPE,
    DATA_INVALID: { message: "Dados inválidos", level: "error", status: 400 } as EH_SEND_TYPE,
    DATE_REQUIRED: { message: "Data é obrigatória", level: "error", status: 400 } as EH_SEND_TYPE,
    DATE_INVALID: { message: "Data inválida", level: "error", status: 400 } as EH_SEND_TYPE,
    DATE_START_LT_DATE_END: { message: "Data de início não pode ser maior que a data de fim", level: "error", status: 400 } as EH_SEND_TYPE,
    VALUE_IS_NOT_NUMBER: { message: "Valor não é um número", level: "error", status: 400 } as EH_SEND_TYPE,
    DELETED: { message: "Registro deletado", level: "error", status: 400 } as EH_SEND_TYPE,
    ID_REQUIRED: { message: "ID é obrigatório", level: "error", status: 400 } as EH_SEND_TYPE,
    UNIDADE_MEDIDA_REQUIRED: { message: "Unidade de medida é obrigatório", level: "error", status: 400 } as EH_SEND_TYPE,
    DESCRICAO_REQUIRED: { message: "Descrição é obrigatório", level: "error", status: 400 } as EH_SEND_TYPE,
    DESCRICAO_INVALID: { message: "Descrição inválida", level: "error", status: 400 } as EH_SEND_TYPE
};
