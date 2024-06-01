import EventEmitter from "node:events";
import signale from "signale";
import { EventHandleListeners } from "./listeners";

export interface EventHandleInterface {
    on(event: string, callback: (data: any) => void): void;
    emit(event: string, data: any): boolean;
    off(event: string, callback: (data: any) => void): void;
    close(): void;
}

export interface SendEvent {
    (data: Object): any;
}

export class EventHandle extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(10);
    }

    close(event?: string, callback?: any): void {
        this.off(event!, callback!);
    }

    listen(): void {
        EventHandleListeners();
        this.countListeners();
    }

    countListeners() {
        signale.info({ event: "countListeners", count: this.eventNames().length });
        signale.info({ event: "countMaxListeners", count: this.getMaxListeners() });
    }
}

export default new EventHandle();
