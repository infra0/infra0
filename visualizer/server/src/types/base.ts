export enum Status {
    SUCCESS = 'success',
    ERROR = 'error',
  }
  
  export interface BaseResponse {
    status: Status;
    message: string;
  }
  
  export interface BaseResponseWithData<T> extends BaseResponse {
    data: T;
  }

