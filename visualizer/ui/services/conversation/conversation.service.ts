import axios from "@/lib/axios";
import { IAddAssistantMessageRequest, IAddAssistantMessageResponse, ICreateConversationRequest, ICreateConversationResponse, IGetAllMessagesRequest, IGetAllMessagesResponse, IGetConversationsResponse } from "./conversation.service.types";

export const getConversations = async () => {
    const { data } = await axios.get<IGetConversationsResponse>('/v1/chat');
    return data;
}


export const createConversation = async (payload : ICreateConversationRequest) => {
    const { data } = await axios.post<ICreateConversationResponse>('/v1/chat/create', payload);
    return data;
}

export const addAssistantMessage = async (payload : IAddAssistantMessageRequest) => {
    const { data } = await axios.post<IAddAssistantMessageResponse>('/v1/chat/add-assistant-message', payload);
    return data;
}


export const getAllMessages = async (payload : IGetAllMessagesRequest) => {
    const { data } = await axios.post<IGetAllMessagesResponse>('/v1/chat/get-all-messages', payload);
    return data;
}