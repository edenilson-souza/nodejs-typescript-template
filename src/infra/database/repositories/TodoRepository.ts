import { PrismaClient } from "@prisma/client";
import { TodoDTO } from "../../../domain/entity/Todo";
import { ITodoRepository } from "../../../domain/repository/TodoInterface";
import { TDataFilter } from "../../../util";
import { ErrorEvent } from "../../../util/errorHandle";

export class TodoRepository implements ITodoRepository {
    constructor(private readonly connection: PrismaClient) {}

    async create(todo: TodoDTO, created_by: string): Promise<void> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async getByID(id: string): Promise<TodoDTO | null> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async getAll(filters: TDataFilter): Promise<TodoDTO[]> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async update(todo: TodoDTO, updated_by: string): Promise<void> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async delete(id: string, deleted_by: string): Promise<void> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
    async count(filters: TDataFilter, customFilter?: any): Promise<number> {
        return new ErrorEvent({ message: "Method not implemented.", level: "critical", entity: "Todo" }).throw();
    }
}
