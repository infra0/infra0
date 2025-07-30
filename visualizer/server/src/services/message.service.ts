import { MessageModel, MessageRole } from "../model/Message.model";
import { ObjectId } from "mongoose";
import { Infra0 } from "../types/infra";


export interface InputMessage {
    role: MessageRole;
    content: string;
    infra0?: Infra0;
    conversation: string;
}

const createMessage = async (payload : InputMessage) => {
    const message = await MessageModel.create(payload);
    return message;
}


const createMessages = async (messages: InputMessage[]) => {
    const messages_ = await MessageModel.insertMany(messages);
    return messages;
}

export { createMessage, createMessages };