import { EventHandleInterface, SendEvent } from "../../application/eventHandle";

export class RoutesSSE {
    constructor(readonly eventHandleSSE: EventHandleInterface) {}

    createListeners(event: string, sendEvent: SendEvent) {
        this.eventHandleSSE.on(event, sendEvent);
    }

    removeListeners(event: string, sendEvent: SendEvent) {
        this.eventHandleSSE.off(event, sendEvent);
    }
}

export class PacientesControllerSSE {
    constructor(readonly eventHandle: EventHandleInterface) {}

    async GetPaciente() {
        const pacientes = await useCaseTodo(this.eventHandle);
        this.eventHandle.emit("pacientes", pacientes);
        return;
    }
}

async function useCaseTodo(eventHandle: EventHandleInterface) {
    const todos = [
        {
            id: 1
        },
        {
            id: 2
        }
    ];
    return todos;
}
