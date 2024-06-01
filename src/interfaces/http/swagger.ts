import dotenv from "dotenv";
import swaggerAutogen from "swagger-autogen";
import { getCommonNetworkInterface } from "../../util/os";

// const envFileName = `.env.${process.env.NODE_ENV ?? "development"}`;
// dotenv.config({ path: envFileName });

dotenv.config();

export default function startSwagger() {
    const port = process.env.PORT || 3031;

    const ips = getCommonNetworkInterface();
    const base_address = ips[0] || process.env.ADDRESS || "localhost";

    const doc = {
        info: {
            title: "Sistema de Gestão e Monitoramento de Agrotôxicos"
        },
        host: `${base_address}:${port}/api/v1`,
        schemes: ["http"],
        securityDefinitions: {
            Bearer: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
                description: "Bearer <token>"
            }
        },
        explorer: true
    };

    const outputFile = "./swagger-output.json";
    const endpointsFiles = ["./src/interfaces/http/routes/index.ts"];

    const options = {
        lang: "pt-BR",
        autoHeaders: true,
        autoQuery: true,
        autoBody: true
    };

    swaggerAutogen(options)(outputFile, endpointsFiles, doc);
}

startSwagger();
