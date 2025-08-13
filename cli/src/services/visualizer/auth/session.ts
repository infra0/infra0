import { Infra0ProjectTokensData } from "../../../types";
import Auth from "./auth";
import { SESSION_CREATION_PATH, SESSION_STATUS_PATH } from "../constants";
import { NetworkResponse } from "../../network/types";

type CreateSessionNetworkResponse = NetworkResponse & {
    data: {
        sessionId: string;
    }
}

type SessionStatusNetworkResponse = NetworkResponse & {
    data: {
        status: 'ready' | 'failed' | 'in_progress';
        tokens: Infra0ProjectTokensData;
    }
}

class SessionAuth extends Auth {

    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async getTokens(): Promise<Infra0ProjectTokensData> {
        const sessionResponse = await this.networkLayer.getAPI(SESSION_CREATION_PATH) as CreateSessionNetworkResponse;
        const sessionId = sessionResponse.data.sessionId;
        console.log(`Session ID: ${sessionId}`);
        console.log(`Login here: https://app.infra0.dev/auth/signin?sessionId=${sessionId}`);

        const maxAttempts = 15;
        const interval = 4000;

        let attempts = 0;
        while (attempts < maxAttempts) {
            const statusResponse = await this.networkLayer.postAPI(SESSION_STATUS_PATH, { sessionId });
            const statusData = (statusResponse as SessionStatusNetworkResponse).data;
            if (statusData.status === 'ready' && statusData.tokens) {
                return statusData.tokens;
            }
            await new Promise(res => setTimeout(res, interval));
            attempts++;
            console.log(`Polling for session token... Attempt ${attempts} of ${maxAttempts}`);
        }

        throw new Error('Session token polling timed out.');
    }
}

export default SessionAuth;