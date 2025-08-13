import NetworkLayer from "../../network";
import { USER_DATA_PATH } from "../constants";
import { NetworkResponse } from "../../network/types";
import Auth from "../auth/auth";

type UserNetworkResponse = NetworkResponse & {
    data: {
        _id: string;
    }
}

export class User {
    private networkLayer: NetworkLayer;

    constructor(baseUrl: string) {
        this.networkLayer = new NetworkLayer(baseUrl);
    }

    async getUser(token: string): Promise<UserNetworkResponse> {
        return await this.networkLayer.getAPI(USER_DATA_PATH, Auth.getAuthHeaders(token)) as UserNetworkResponse;
    }
}   