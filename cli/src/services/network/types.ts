export interface NetworkResponse {
    status: number;
    data: object;
    headers: object;
}

export class NetworkError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}