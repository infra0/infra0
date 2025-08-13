import { Infra0ProjectTokensData } from "../../../types";
import demoUser from '../../../static/demoUser.json';
import NetworkLayer from "../../network";
import { CREATE_CONVERSATION_PATH, GET_CONVERSATIONS_PATH } from "../constants";
import { NetworkResponse } from "../../network/types";
import Auth from "../auth/auth";

type ConversationData = {
    _id: string;
}

type CreateConversationNetworkResponse = NetworkResponse & {
    data: ConversationData
}

type CreateConversationRequest = {
    prompt: string;
}

type GetConversationsNetworkResponse = NetworkResponse & {
    data: {
        conversations: ConversationData[];
    }
}

export class Conversation {
    private networkLayer: NetworkLayer;

    constructor(baseUrl: string) {
        this.networkLayer = new NetworkLayer(baseUrl);
    }

    async createConversation(conversationData: CreateConversationRequest, token: string): Promise<CreateConversationNetworkResponse> {
        return await this.networkLayer.postAPI(CREATE_CONVERSATION_PATH, conversationData, Auth.getAuthHeaders(token)) as CreateConversationNetworkResponse;
    }

    async getConversations(token: string): Promise<GetConversationsNetworkResponse> {
        return await this.networkLayer.getAPI(GET_CONVERSATIONS_PATH, Auth.getAuthHeaders(token)) as GetConversationsNetworkResponse;
    }
}