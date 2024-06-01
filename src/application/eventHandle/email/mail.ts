import EventHandle from "..";
import NewDate from "../../../util/NewDate";
import { EH_SEND_TYPE } from "../logs/types";

export const SEND_MAIL_EVENT = async (event: string, data: EH_SEND_TYPE) => {
    data.timestamp = NewDate.toUTC();
    EventHandle.emit(event, data);
};
