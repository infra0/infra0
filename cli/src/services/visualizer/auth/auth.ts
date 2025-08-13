import { Infra0ProjectTokensData } from '../../../types';
import NetworkLayer from '../../network';
import { NetworkResponse } from '../../network/types';
import { VALIDATE_TOKEN_PATH, REFRESH_TOKEN_PATH } from '../constants';

abstract class Auth {

    protected networkLayer: NetworkLayer;

    constructor(baseUrl: string) {
        this.networkLayer = new NetworkLayer(baseUrl);
    }

    async isTokenValid(token: string): Promise<boolean> {
        const response = await this.networkLayer.getAPI(VALIDATE_TOKEN_PATH, Auth.getAuthHeaders(token));
        return response.status === 200;
    }

    async refreshTokens(refreshToken: string): Promise<Infra0ProjectTokensData> {
        const response = await this.networkLayer.postAPI(REFRESH_TOKEN_PATH, { refreshToken }, Auth.getAuthHeaders(refreshToken));
        return (response as NetworkResponse & { data: Infra0ProjectTokensData }).data;
    }

    static getAuthHeaders(token: string): object {
        return {
            Authorization: `Bearer ${token}`
        }
    }

    abstract getTokens(): Promise<Infra0ProjectTokensData>

}

export default Auth;