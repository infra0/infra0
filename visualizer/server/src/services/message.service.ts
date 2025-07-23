import { MessageModel, MessageRole } from "../model/Message.model";
import { ObjectId } from "mongoose";
import { Infra0 } from "../types/infra";


export interface InputMessage {
    role: MessageRole;
    content: string;
    infra0?: Infra0;
    conversation: ObjectId;
}

const createMessage = async (conversation: ObjectId, infra0: Infra0) => {
    const message = await MessageModel.create({ conversation, infra0 });
    return message;
}


const createMessages = async (messages: InputMessage[]) => {
    const messages_ = await MessageModel.insertMany(messages);
    return messages;
}

export { createMessage, createMessages };