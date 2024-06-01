import { Request, Response } from "express";

import * as yup from "yup";
import { ITodoService } from "../../../application/service/TodoService";
import { TodoDTO } from "../../../domain/entity/Todo";
import { ErrorEvent } from "../../../util/errorHandle";
import { StatusHandle } from "../statusHandle/StatusHandle";

export interface ITodoController {
    create(req: Request, res: Response): Promise<Response>;
    getAll(req: Request, res: Response): Promise<Response>;
    update(req: Request, res: Response): Promise<Response>;
    delete(req: Request, res: Response): Promise<Response>;
}

export class TodoController implements ITodoController {
    constructor(private readonly todoService: ITodoService) {}

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const data = await schemaCreateTodo
                .validate(req.body)
                .then(valid => valid)
                .catch(error => {
                    return new ErrorEvent({ message: "Erro de validação", data: error, level: "warning", entity: "TodoController" }).throw();
                });

            const todo = await this.todoService.create(data as TodoDTO, req.body.userLogged);
            return StatusHandle(res, { message: "Todo cadastrado com sucesso", data: todo });
        } catch (error) {
            return StatusHandle(res, { data: error });
        }
    }
    async getAll(req: Request, res: Response): Promise<Response> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "TodoController" }).throw();
    }
    async update(req: Request, res: Response): Promise<Response> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "TodoController" }).throw();
    }
    async delete(req: Request, res: Response): Promise<Response> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "TodoController" }).throw();
    }
}

const schemaCreateTodo = yup.object().shape({
    id_external: yup.string().required("O campo id_external é obrigatório"),
    name: yup.string().required("O campo name é obrigatório"),
    description: yup.string().required("O campo description é obrigatório"),
    status: yup.string().required("O campo status é obrigatório")
});
