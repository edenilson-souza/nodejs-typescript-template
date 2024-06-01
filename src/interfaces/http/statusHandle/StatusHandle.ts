import { Response } from "express";
export interface StatusHandleProps {
    data?: any;
    message?: string;
    status?: number;
    totalCount?: number;
    extra?: any;
}
export const JSONParse = (data: any) => {
    try {
        if (typeof data === "string") {
            const parse = JSON.parse(data);
            return parse;
        } else if (typeof data.message === "string") {
            const parse = JSON.parse(data.message);
            return parse;
        } else if (data instanceof Error) {
            const parse = JSON.parse(data.message);
            return parse;
        } else if (data.message instanceof Error) {
            const parse = JSON.parse(data.message.message);
            return parse;
        } else if (typeof data === "object") {
            return data;
        } else if (typeof data.message === "object") {
            return data.message;
        }
        return data;
    } catch (error) {
        return data;
    }
};
export function StatusHandle(res: Response, result: StatusHandleProps): Response {
    if (result.data instanceof TypeError) {
        return res.status(500).json({ message: "Erro interno", data: result.data.message });
    }
    if (result.data instanceof Error) {
        const responseMessage = JSONParse(result.data);

        if (responseMessage instanceof Error) {
            const messageError = JSONParse(responseMessage);
            return res.status(messageError.status ?? result.status ?? 500).json(messageError);
        }

        if (typeof responseMessage.status !== "number") {
            if (result.status) {
                responseMessage.status = result.status;
            } else {
                responseMessage.status = 500;
            }
        }

        return res.status(responseMessage.status ?? result.status ?? 500).json(responseMessage);
    } else if (result.data instanceof Array && result.data.length === 0) {
        return res
            .status(result.status ?? 200)
            .json({ message: result.message ?? "Nenhum dado encontrado.", data: result.data ?? [], totalCount: result.totalCount, extra: result.extra });
    } else {
        return res.status(result.status ?? 200).json({ message: result.message, data: result.data, totalCount: result.totalCount, extra: result.extra });
    }
}
