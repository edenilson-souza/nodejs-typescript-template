import dotenv from "dotenv";
dotenv.config();

import { Client } from "@elastic/elasticsearch";
import { OrErrorEvent } from "orerror";
import signale from "signale";
import EventHandle from "../../application/eventHandle";
import { LIST_EVENTS } from "../../application/eventHandle/Events";
import { EH_SEND_TYPE } from "../../application/eventHandle/logs/types";
import { ErrorEvent } from "../../util/errorHandle";

export class ElasticSearch {
    client: Client | undefined;

    constructor() {
        this.client = undefined;
    }

    async start(): Promise<void> {
        try {
            if (!process.env.ELASTICSEARCH_ACTIVE || process.env.ELASTICSEARCH_ACTIVE != "true") return;
            if (!process.env.ELASTICSEARCH_URL || process.env.ELASTICSEARCH_URL == "") return;

            try {
                this.client = new Client({
                    node: process.env.ELASTICSEARCH_URL,
                    auth: {
                        username: process.env.ELASTICSEARCH_USER!,
                        password: process.env.ELASTICSEARCH_PASS!
                    }
                });
            } catch (error) {
                this.client = undefined;
                return;
            }

            if (this.client == undefined) {
                return;
            }

            await this.ping();

            await this.createIndices(this.client);

            EventHandle.on(LIST_EVENTS.SAVE_LOG, async (data: EH_SEND_TYPE) => {
                await this.ping();
                await this.saveLog(data);
            });

            OrErrorEvent.on("error", async (data: any) => {
                await this.ping();
                await this.saveLog(data);
            });

            return;
        } catch (error: any) {
            if (this.client == undefined) {
                signale.info("ElasticSearch Not Started");
            }

            EventHandle.off(LIST_EVENTS.SAVE_LOG, (data: EH_SEND_TYPE) => {
                this.saveLog(data);
            });

            if (error.meta.statusCode == 0 && error.meta.body == undefined) {
                signale.info("ElasticSearch Not Started");
                return;
            }

            if (error.meta.body.error.type != "resource_already_exists_exception") {
                return;
            }

            return;
        }
    }

    async ping() {
        if (this.client == undefined) return;
        const check = await this.client.ping();
        if (!check) {
            this.client = undefined;
            return new ErrorEvent({ message: "ElasticSearch Not Started", level: "warning", entity: "ElasticSearch" }).throw();
        }
        // signale.success("ElasticSearch started", check);
    }

    async createIndices(client: Client) {
        try {
            if (!process.env.ELASTICSEARCH_ACTIVE || process.env.ELASTICSEARCH_ACTIVE != "true") return;
            if (!process.env.ELASTICSEARCH_URL || process.env.ELASTICSEARCH_URL == "") return;
            await client.indices.createDataStream({
                name: "logs-service-default",
                error_trace: true
            });
        } catch (error) {
            return;
        }
    }

    async saveLog(data: EH_SEND_TYPE) {
        try {
            if (!process.env.ELASTICSEARCH_ACTIVE || process.env.ELASTICSEARCH_ACTIVE != "true") return;
            if (!process.env.ELASTICSEARCH_URL || process.env.ELASTICSEARCH_URL == "") return;
            if (this.client == undefined) return new ErrorEvent({ message: "ElasticSearch Not Started", level: "warning", entity: "ElasticSearch" }).throw();

            const stack = JSON.stringify(data.stack);
            // console.log(stack);
            await this.client.index({
                index: "logs-service-default",
                body: {
                    message: data.message,
                    data: JSON.stringify(data.data),
                    entity: data.entity,
                    level: data.level,
                    timestamp: data.timestamp,
                    system: data.system,
                    stack
                },
                error_trace: true
            });
        } catch (error) {
            return;
        }
    }

    async stop() {
        if (this.client == undefined) return;
        await this.client.close();
        this.client = undefined;
    }
}

// async function applyLifecyclePolicyToDataStream(client: any) {
//     try {
//         const policyDefinition = require("./data_stream_lifecycle_policy.json"); // Carregar o arquivo JSON da política de ciclo de vida
//         const { body } = await client.dataLifecycle.putLifecycle({
//             name: "my_data_stream_lifecycle_policy", // Nome da política de ciclo de vida
//             body: policyDefinition
//         });
//         console.log(body);
//     } catch (error) {
//         console.error("Erro ao aplicar a política de ciclo de vida:", error);
//     }
// }

export default new ElasticSearch();
