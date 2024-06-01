import { PrismaClient } from "@prisma/client";
import express from "express";

import todoRoutes, { TodoRoutes } from "./TodoRoutes";

const router = express.Router();

export function setConnection(connection: PrismaClient) {
    router.use("/", () => {});
    new TodoRoutes(connection).getRoutes();
}

router.use("/todo", todoRoutes);

export default router;
