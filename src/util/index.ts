//istanbul ignore file
import { randomUUID } from "crypto";
import { validate } from "uuid";
// import { v4 as uuidv4, validate } from "uuid";

export type TDataFilter = {
    limit?: number;
    skip?: number;
    search?: string;
    columnSearch?: string;
    operatorSearch?: "contains" | "startsWith" | "endsWith" | "equals";
    filter?: string[];
    columnFilter?: string;
    orderBy?: string;
    columnOrderBy?: string;
};

export function createRandomUUID(): string {
    // function s4(): string {
    //     return Math.floor((1 + Math.random()) * 0x10000)
    //         .toString(16)
    //         .substring(1);
    // }
    // return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4();
    // return uuidv4();
    return randomUUID();
}

export function checkIfIsUUID(uuid: string): boolean {
    return validate(uuid);
}

export function ConverterParaReal(numero: string): Number {
    const numeroStr: string = numero.toString(); // Expressão regular para verificar o formato com vírgula como separador decimal
    const formatoBrasileiro = /^\d{1,3}(,\d{3})*(\.\d+)?$/; // Expressão regular para verificar o formato com ponto como separador decimal
    const formatoAmericano = /^\d{1,3}(\.\d{3})*(\,\d+)?$/;
    if (formatoAmericano.test(numeroStr)) {
        return Number(numeroStr);
    } else if (formatoBrasileiro.test(numeroStr)) {
        return Number(numeroStr.replace(".", "").replace(",", "."));
    } else {
        return Number(numeroStr);
    }
}

export function CriarUsernameAleatorio(tamanho: number) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let username = "";
    for (let i = 0; i < tamanho; i++) {
        username += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return username;
}

export function CriarSenhaAleatoria(tamanho: number) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789@#$";
    let senha = "";
    for (let i = 0; i < tamanho; i++) {
        senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
}

export function getExtensaoFile(mimeType: string) {
    if (mimeType == "application/pdf") return ".pdf";
    else if (mimeType == "image/jpeg" || mimeType == "image/pjpeg") return ".jpeg";
    else if (mimeType == "image/jpg") return ".jpg";
    else if (mimeType == "image/png") return ".png";
    else if (mimeType == "image/bmp") return ".bmp";
    else if (mimeType == "image/tiff" || mimeType == "image/tif") return ".tiff";
    else if (mimeType == "image/webp") return ".webp";
    else if (mimeType == "application/csv") return ".csv";
    else if (mimeType == "application/vnd.ms-excel") return ".xls";
    else return "";
}

export function getMimeType(fileName: string) {
    if (fileName.endsWith(".pdf")) return "application/pdf";
    else if (fileName.endsWith(".jpeg")) return "image/jpeg";
    else if (fileName.endsWith(".jpg")) return "image/jpg";
    else if (fileName.endsWith(".png")) return "image/png";
    else if (fileName.endsWith(".bmp")) return "image/bmp";
    else if (fileName.endsWith(".tiff")) return "image/tiff";
    else if (fileName.endsWith(".tif")) return "image/tif";
    else if (fileName.endsWith(".webp")) return "image/webp";
    else return "application/octet-stream";
}
