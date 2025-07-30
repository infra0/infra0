import axios from "@/lib/axios";
import { ICreateConversationRequest, ICreateConversationResponse, IGetConversationsResponse } from "./conversation.service.types";

export const getConversations = async () => {
    const { data } = await axios.get<IGetConversationsResponse>('/v1/chat');
    return data;
}


export const createConversation = async (payload : ICreateConversationRequest) => {
    const { data } = await axios.post<ICreateConversationResponse>('/v1/chat/create', payload);
    return data;
}