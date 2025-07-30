import { IBaseResponse } from "../base-response.type";

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
