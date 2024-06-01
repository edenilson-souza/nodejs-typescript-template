import { createRandomUUID } from "../../util";
import NewDate from "../../util/NewDate";
import { ErrorEvent } from "../../util/errorHandle";

export class Todo {
    id_todo?: string;
    id_external: string;
    name: string;
    description: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;

    private constructor(todo: TodoDTO) {
        checkRequiredFields(todo);
        this.id_todo = todo.id_todo;
        this.id_external = todo.id_external;
        this.name = todo.name;
        this.description = todo.description;
        this.status = todo.status;
        this.created_at = todo.created_at;
        this.updated_at = todo.updated_at;
        this.deleted_at = todo.deleted_at;
    }

    static create(todo: TodoDTO): Todo {
        todo.id_todo = createRandomUUID();

        const dataAtual = NewDate.toUTC();
        todo.created_at = dataAtual;
        todo.updated_at = dataAtual;

        return new Todo(todo);
    }

    static restore(todo: TodoDTO): Todo {
        if (todo.deleted_at) return new ErrorEvent({ message: "Todo foi deletado", level: "error", entity: "Todo" }).throw();
        return new Todo(todo);
    }

    update = (todo: TodoDTO): void => {
        checkRequiredFields(todo);
        if (this.deleted_at) return new ErrorEvent({ message: "Todo foi deletado", level: "error", entity: "Todo" }).throw();
        if (todo.name) this.name = todo.name;
        if (todo.description) this.description = todo.description;
        if (todo.status) this.status = todo.status;
        this.updated_at = NewDate.toUTC();
    };
}

export type TodoDTO = {
    id_todo?: string;
    id_external: string;
    name: string;
    description: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
};

function checkRequiredFields(todo: any): void {
    if (!todo.id_external) return new ErrorEvent({ message: "Campo id_external é obrigatório", level: "error", entity: "Todo" }).throw();
    if (!todo.name) return new ErrorEvent({ message: "Campo name é obrigatório", level: "error", entity: "Todo" }).throw();
    if (!todo.description) return new ErrorEvent({ message: "Campo description é obrigatório", level: "error", entity: "Todo" }).throw();
    if (!todo.status) return new ErrorEvent({ message: "Campo status é obrigatório", level: "error", entity: "Todo" }).throw();
    if (!todo.created_at) return new ErrorEvent({ message: "Campo created_at é obrigatório", level: "error", entity: "Todo" }).throw();
    if (!todo.updated_at) return new ErrorEvent({ message: "Campo updated_at é obrigatório", level: "error", entity: "Todo" }).throw();
}
