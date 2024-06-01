import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError
} from "@prisma/client/runtime/library";
import { ErrorEvent, ErrorHandle } from "./errorHandle";

describe("ErrorHandle", () => {
    it("deve lançar erro ao receber Prisma.PrismaClientValidationError", () => {
        const error = new PrismaClientValidationError("Erro de validação", { clientVersion: "1.0.0" });
        expect(() => ErrorHandle(error)).toThrow("Erro ao validar os dados");
    });

    it("deve lançar erro ao receber Prisma.PrismaClientKnownRequestError", () => {
        const error = new PrismaClientKnownRequestError("Erro de operação", { code: "code", clientVersion: "1.0.0" });
        expect(() => ErrorHandle(error)).toThrow("Erro ao realizar a operação no banco de dados");
    });

    it("deve lançar erro ao receber Prisma.PrismaClientUnknownRequestError", () => {
        const error = new PrismaClientUnknownRequestError("Erro de operação", { clientVersion: "1.0.0" });
        expect(() => ErrorHandle(error)).toThrow("Erro ao validar os dados");
    });

    it("deve lançar erro ao receber Prisma.PrismaClientInitializationError", () => {
        const error = new PrismaClientInitializationError("Erro de operação", "1.0.0");
        expect(() => ErrorHandle(error)).toThrow("Erro ao realizar a operação no banco de dados");
    });

    it("deve lançar erro ao receber Prisma.PrismaClientRustPanicError", () => {
        const error = new PrismaClientRustPanicError("Erro de operação", "1.0.0");
        expect(() => ErrorHandle(error)).toThrow("Erro ao realizar a operação no banco de dados");
    });

    it("deve lançar erro ao receber instância de Error", () => {
        const error = new Error("Erro geral");
        expect(() => ErrorHandle(error)).toThrow("Erro geral");
    });

    it("deve lançar erro ao receber string", () => {
        const errorMessage = "Erro de aplicação";
        expect(() => ErrorHandle(errorMessage)).toThrow("Erro de aplicação");
    });

    it("deve lançar erro ao receber objeto", () => {
        const errorObj = { message: "Erro objeto" };
        expect(() => ErrorHandle(errorObj)).toThrow("Erro objeto");
    });

    it("deve lançar erro desconhecido ao receber valor não reconhecido", () => {
        const unknownError = 123; // valor não reconhecido
        expect(() => ErrorHandle(unknownError)).toThrow("Erro desconhecido");
    });
});

describe("ErrorHandle - Class", () => {
    it("deve lançar erro ao chamar errorHandle", () => {
        const error = new ErrorEvent({
            message: "Erro de aplicação",
            level: "critical",
            entity: "ErrorHandle"
        });
        expect(() => error.throw()).toThrow(JSON.stringify(error.getError()));
    });
    it("deve lançar erro ao chamar errorHandle", () => {
        const error = new ErrorEvent({
            message: "Erro de aplicação",
            level: "critical",
            entity: "ErrorHandle",
            status: 400
        });
        expect(() => error.throw()).toThrow(JSON.stringify(error.getError()));
    });
});
