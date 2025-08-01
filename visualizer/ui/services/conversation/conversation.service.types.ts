import { ChatRole } from "@/types/chat";
import { IBaseResponse } from "../base-response.type";
import { Infra0 } from "@/types/infrastructure";

export interface IConversation {
    _id: string;
    title: string;
    total_messages_count: number;
    createdAt: string;
    updatedAt: string;
}

export interface IGetConversationsResponse extends IBaseResponse<{
    conversations: IConversation[];
}> {}

export interface ICreateConversationRequest {
    prompt: string;
}

export interface ICreateConversationResponse extends IBaseResponse<{
    _id: string;
    title: string;
    total_messages_count: number;
    createdAt: string;
    updatedAt: string;
}> {}

export interface IAddAssistantMessageRequest {
    conversation_id: string;
    message: string;
}

export interface IAddAssistantMessageResponse extends IBaseResponse<{
    _id: string;
    message: string;
    infra0: Infra0;
}> {}

export interface IGetAllMessagesRequest {
    conversation_id: string;
}

export interface IResponseMessageData {
    _id: string;
    role: ChatRole;
    content: string;
    infra0: Infra0 | null;
    createdAt: string;
    updatedAt: string;
}

export interface IGetAllMessagesResponse extends IBaseResponse<{
    _id: string;
    title: string;
    total_messages_count: number;
    messages: IResponseMessageData[];
}> {}