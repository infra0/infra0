import axios, { AxiosError, AxiosResponse } from 'axios';
import { NetworkResponse, NetworkError } from './types';

class NetworkLayer {
    private caller: axios.AxiosInstance;

    constructor(baseURL: string) {
        this.caller = axios.create({ baseURL });
    }

    private networkLayerError(error: AxiosError): NetworkError {
        if (error.response) {
            return new NetworkError(error.response.status, error.response?.data as string);
        }
        return this.unhandledNetworkLayerError();
    }

    private unhandledNetworkLayerError(): NetworkError {
        throw new NetworkError(500, 'Unknown error');
    }

    async postAPI(url: string, body?: object, headers?: object): Promise<NetworkResponse> {
        try {
            const response = await this.caller.post(url, body, { headers });
            return {
                status: response.status,
                data: response.data.data,
                headers: response.headers
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                throw this.networkLayerError(error);
            }
            throw this.unhandledNetworkLayerError();
        }
    }

    async getAPI(url: string, headers?: object): Promise<NetworkResponse> {
        try {
            const response = await this.caller.get(url, { headers });
            return {
                status: response.status,
                data: response.data.data,
                headers: response.headers
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                throw this.networkLayerError(error);
            }
            throw this.unhandledNetworkLayerError();
        }
    }
}

export default NetworkLayer;