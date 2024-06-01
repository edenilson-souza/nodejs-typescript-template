import { TTodoDataFilter } from "../../application/service/TodoService";
import { TodoDTO } from "../entity/Todo";

export interface ITodoRepository {
    create(todo: TodoDTO, created_by: string): Promise<void>;
    getByID(id_todo: string): Promise<TodoDTO | null>;
    getAll(filters: TTodoDataFilter): Promise<TodoDTO[]>;
    update(todo: TodoDTO, updated_by: string): Promise<void>;
    delete(id_todo: string, deleted_by: string): Promise<void>;
    count(filters: TTodoDataFilter, customFilter?: any): Promise<number>;
}
