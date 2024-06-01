import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import EmailService from "../../../application/service/EmailService";
import LogService from "../../../application/service/LogService";
import { TodoService } from "../../../application/service/TodoService";
import { TodoUseCases } from "../../../application/useCases/TodoUseCases";
import { TodoRepository } from "../../../infra/database/repositories/TodoRepository";
import { ITodoController, TodoController } from "../controllers/TodoController";
import middleware from "../middleware/middleware";

const router = express.Router();

export class TodoRoutes {
    todoController: ITodoController;
    constructor(private readonly connection: PrismaClient) {
        const todoRepository = new TodoRepository(this.connection);
        const todoUseCases = new TodoUseCases(todoRepository);
        const todoService = new TodoService(todoUseCases, EmailService, LogService);
        this.todoController = new TodoController(todoService);
    }

    getRoutes(): express.Router {
        router.post("/", (req, res) => {
            /*  #swagger.tags = ['Todo']
                #swagger.security = [{
                    "Bearer": []
                }]
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    type: 'object',
                    schema: {
                        $id_todo: "1"
                    }
                }
            */
            return middleware(req, res, ["public"], (req: Request, res: Response) => this.todoController.create(req, res));
        });
        router.get("/", (req, res) => {
            /*
                #swagger.tags = ['Todo']
                #swagger.security = [{
                    "Bearer": []
                }]
                #swagger.parameters['limit'] = {
                    in: 'query',
                    description: 'Limit',
                    required: false,
                    type: 'number'
                }
                #swagger.parameters['skip'] = {
                    in: 'query',
                    description: 'Skip',
                    required: false,
                    type: 'number'
                }
                #swagger.parameters['search'] = {
                    in: 'query',
                    description: 'Search',
                    required: false,
                    type: 'string'
                }
                #swagger.parameters['columnSearch'] = {
                    in: 'query',
                    description: 'Coluna para pesquisa',
                    required: false,
                    type: 'string'
                }
                #swagger.parameters['operatorSearch'] = {
                    in: 'query',
                    description: 'Operador de pesquisa: contains, startsWith, endsWith, equals',
                    required: false,
                    type: 'string'
                }
                #swagger.parameters['filter'] = {
                    in: 'query',
                    description: 'Filtro por coluna',
                    required: false,
                    type: 'array'
                }
                #swagger.parameters['columnFilter'] = {
                    in: 'query',
                    description: 'Coluna para filtro',
                    required: false,
                    type: 'string'
                }
                #swagger.parameters['orderBy'] = {
                    in: 'query',
                    description: 'Ordenação',
                    required: false,
                    type: 'string'
                }
                #swagger.parameters['columnOrderBy'] = {
                    in: 'query',
                    description: 'Coluna para ordenação',
                    required: false,
                    type: 'string'
                }
            */
            return middleware(req, res, ["public"], (req: Request, res: Response) => this.todoController.getAll(req, res));
        });
        router.put("/:id", (req, res) => {
            /*
                #swagger.tags = ['Todo']
                #swagger.security = [{
                    "Bearer": []
                }]
                #swagger.parameters['id_todo'] = {
                    in: 'path',
                    description: 'Todo ID',
                    required: true,
                    type: 'string'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema:
                    {
                        $name: "nome",
                        $description: "descricao"
                    }
                }
            */
            return middleware(req, res, ["public"], (req: Request, res: Response) => this.todoController.update(req, res));
        });
        router.delete("/:id", (req, res) => {
            /*
                #swagger.tags = ['Todo']
                #swagger.security = [{
                    "Bearer": []
                }]
                #swagger.parameters['id_todo'] = {
                    in: 'path',
                    description: 'Todo ID',
                    required: true,
                    type: 'string'
                }
            */
            return middleware(req, res, ["public"], (req: Request, res: Response) => this.todoController.delete(req, res));
        });

        return router;
    }
}

export default router;
