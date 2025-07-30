import { BaseResponseWithData } from "./base";
import { Infra0 } from "./infra";


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
    message : string;
} | null> {}