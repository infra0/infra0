import { BaseResponseWithData } from "./base";
import { Infra0 } from "./infra";
import { MessageRole } from "../model/Message.model";


export interface CreateConversationRequest {
    prompt : string;
    pulumiCode?: string;
}


export interface ConversationData {
    _id : string;
    title : string;
    total_messages_count : number;
    createdAt : Date;
    updatedAt: Date;
}

export interface InitialConversationResponse extends BaseResponseWithData<ConversationData | null> {}  


export interface InitialConversationsResponse extends BaseResponseWithData<{
    conversations : ConversationData[];
} | null> {}


export interface IAddAssistantMessageRequest {
    conversation_id : string;
    message : string;
    infra0: Infra0;
}

export interface IAddAssistantMessageResponse extends BaseResponseWithData<{
    _id: string;
    message : string;
    infra0: Infra0;
} | null> {}


export interface IGetAllMessagesRequest {
    conversation_id : string;
}

export interface ResponseMessageData{
    _id : string;
    role : MessageRole;
    content : string;
    infra0 : Infra0 | null;
    createdAt : string;
    updatedAt : string;
}



export interface IGetAllMessagesResponse extends BaseResponseWithData<{
    _id : string;
    title: string;
    total_messages_count : number;
    messages : ResponseMessageData[];
} | null> {}