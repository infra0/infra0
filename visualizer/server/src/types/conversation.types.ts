import { BaseResponseWithData } from "./base";


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