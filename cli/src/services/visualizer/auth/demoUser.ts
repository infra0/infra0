import { Infra0ProjectTokensData } from "../../../types";
import demoUser from '../../../static/demoUser.json';
import Auth from "./auth";
import NetworkLayer from "../../network";
import { BASE_URL, LOGIN_PATH, SEED_DEMO_USER_PATH } from "../constants";
import { NetworkResponse } from "../../network/types";

type TokensNetworkResponse = NetworkResponse & {
    data: {
        tokens: Infra0ProjectTokensData;
    }
}

class DemoUserAuth extends Auth {

    constructor(baseUrl: string) {
        super(baseUrl);
    }

    private async ingestUser(): Promise<NetworkResponse> {
        return await this.networkLayer.postAPI(SEED_DEMO_USER_PATH);
    }

    async getTokens(): Promise<Infra0ProjectTokensData> {
        await this.ingestUser();

        const tokenResponse = await this.networkLayer.postAPI(LOGIN_PATH, {
            contact: demoUser.email,
            password: demoUser.password,
        });
        
        return (tokenResponse as TokensNetworkResponse).data.tokens;
    }
}

export default DemoUserAuth;