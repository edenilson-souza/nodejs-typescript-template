import { TodoDTO } from "../../domain/entity/Todo";
import { TDataFilter } from "../../util";
import { ErrorEvent } from "../../util/errorHandle";
import { LIST_EVENTS } from "../eventHandle/Events";
import { ITodoUseCases } from "../useCases/TodoUseCases";
import { IEmailService } from "./EmailService";
import { ILogService } from "./LogService";

export type TTodoDataFilter = TDataFilter & {};

export interface ITodoService {
    create(todo: TodoDTO, created_by: string): Promise<TodoDTO>;
    getById(id_todo: string): Promise<TodoDTO>;
    getAll(filters: TTodoDataFilter): Promise<TodoDTO[]>;
    update(todo: TodoDTO, updated_by: string): Promise<TodoDTO>;
    delete(id_todo: string, deleted_by: string): Promise<TodoDTO>;
    count(filters: TTodoDataFilter, customFilter?: any): Promise<number>;
}

export class TodoService implements ITodoService {
    constructor(private readonly todoUseCases: ITodoUseCases, private readonly emailService: IEmailService, private readonly logService: ILogService) {}

    async create(todo: TodoDTO, created_by: string): Promise<TodoDTO> {
        const hasExist = await this.todoUseCases.getById(todo.id_external);
        if (hasExist) {
            return new ErrorEvent({ message: "Todo já existe", level: "error", entity: "Todo", status: 400 }).throw();
        }
        const todoCreated = await this.todoUseCases.create(todo, created_by);
        this.emailService.send(LIST_EVENTS.TODO_CREATED, { data: created_by, message: "Todo criado", entity: "Todo", level: "info" });
        this.logService.send({ data: todo, message: "Todo criado", entity: "Todo", level: "info" });
        return todoCreated;
    }
    async getById(id_todo: string): Promise<TodoDTO> {
        const todo = await this.todoUseCases.getById(id_todo!);
        if (!todo) {
            return new ErrorEvent({ message: "Todo não encontrado", level: "error", entity: "Todo", status: 404 }).throw();
        }
        return todo;
    }
    async getAll(filters: TTodoDataFilter): Promise<TodoDTO[]> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async update(todo: TodoDTO, updated_by: string): Promise<TodoDTO> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async delete(id_todo: string, deleted_by: string): Promise<TodoDTO> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async count(filters: TTodoDataFilter, customFilter?: any): Promise<number> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
}
