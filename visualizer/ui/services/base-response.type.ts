export interface IBaseResponse<T> {
    data: T;
    message: string;
    status: string;
}