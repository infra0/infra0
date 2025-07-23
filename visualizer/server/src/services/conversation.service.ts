import { ConversationModel } from "../model/conversation.model";
import { ObjectId } from "mongoose";

const createConversation = async (title: string, user: ObjectId) => {
    const conversation = await ConversationModel.create({ title, user });
    return conversation;
}

const getConversation = async (id: ObjectId) => {
    const conversation = await ConversationModel.findById(id);
    return conversation;
}

const getAllConversations = async (user: ObjectId) => {
    const conversations = await ConversationModel.find({ user }).populate('messageCount');
    return conversations;
}


const getConversationWithMessages = async (id: ObjectId) => {
    const conversation = await ConversationModel.findById(id).populate('messageList');
    return conversation;
}

export { createConversation, getConversation, getAllConversations, getConversationWithMessages };