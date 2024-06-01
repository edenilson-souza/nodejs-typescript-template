import EventHandle from "..";
import NewDate from "../../../util/NewDate";
import { LIST_EVENTS } from "../Events";
import { EH_SEND_TYPE } from "./types";

export const SEND_LOG_EVENT = async (data: EH_SEND_TYPE) => {
    if (!data.timestamp) data.timestamp = NewDate.toUTC();
    if (!data.system) data.system = process.env.SYSTEM_NAME ?? "SISTEMA";
    EventHandle.emit(LIST_EVENTS.SAVE_LOG, data);
};
