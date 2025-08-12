import demoUser from '../static/demoUser.json';
import axios from 'axios';

const getBaseUrl = () => {
    return process.env.VISUALIZER_API_URL || 'http://localhost:4000';
}

const getHeaders = (authToken: string) => {
    return {
        Authorization: `Bearer ${authToken}`
    }
}

const getSeedUserUrl = () => {
    return `${getBaseUrl()}/api/v1/seed/demo-user`;
}

const getLoginUrl = () => {
    return `${getBaseUrl()}/api/v1/auth/login`;
}

export const seedUser = async () => {
    await axios.post(getSeedUserUrl());
}

export const getUserWithToken = async () => {
    const response = await axios.post(getLoginUrl(), {
        email: demoUser.email,
        password: demoUser.password,
    });
    return response.data;
}

const getConversationsUrl = () => {
    return `${getBaseUrl()}/api/v1/chat`;
}

export const getConversations = async (authToken: string): Promise<string[]> => {
    const response = await axios.get(getConversationsUrl(), {
        headers: getHeaders(authToken)
    });
    return response.data.data.conversations.map((conversation: any) => conversation._id);
}

export const createConversation = async (authToken: string, prompt: string) => {
    const response = await axios.post(getConversationsUrl() + '/create', {
        prompt
    }, {
        headers: getHeaders(authToken)
    });
    return response.data.data._id;
}

const visualizerUIBaseUrl = () => {
    return process.env.VISUALIZER_UI_URL || 'http://localhost:3000';
}

export const getVisualizerConversationUrl = (conversationId: string) => {
    return `${visualizerUIBaseUrl()}/project/${conversationId}?need_streaming=true`;
}