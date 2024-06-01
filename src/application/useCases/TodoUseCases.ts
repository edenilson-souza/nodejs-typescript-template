import { Todo, TodoDTO } from "../../domain/entity/Todo";
import { ITodoRepository } from "../../domain/repository/TodoInterface";
import { ErrorEvent } from "../../util/errorHandle";

export interface ITodoUseCases {
    create(todo: TodoDTO, created_by: string): Promise<TodoDTO>;
    getById(id: string): Promise<TodoDTO | null>;
    getAll(filters: any): Promise<TodoDTO[]>;
    update(todo: TodoDTO, updated_by: string): Promise<TodoDTO>;
    delete(id: string, deleted_by: string): Promise<TodoDTO>;
    count(filters: any): Promise<number>;
}

export class TodoUseCases implements ITodoUseCases {
    constructor(private readonly todoRepository: ITodoRepository) {}

    async create(todo: TodoDTO, created_by: string): Promise<TodoDTO> {
        const todoObj: TodoDTO = Todo.create(todo);
        await this.todoRepository.create(todoObj, created_by);
        return todoObj;
    }
    async getById(id: string): Promise<TodoDTO | null> {
        const todo = await this.todoRepository.getByID(id);
        return todo;
    }
    async getAll(filters: any): Promise<TodoDTO[]> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async update(produto: TodoDTO, updated_by: string): Promise<TodoDTO> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async delete(id: string, deleted_by: string): Promise<TodoDTO> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async count(filters: any): Promise<number> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
}
