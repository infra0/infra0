import { User } from "@/types/user";
import { IBaseResponse } from "../base-response.type";

export interface IGetNewAuthTokensReturnValues {
    tokens: {
      access: Token;
      refresh: Token;
    };
  }
  
  export interface Token {
    token: string;
    expires: string;
  }

export enum Provider {
  GOOGLE = 'google',
  EMAIL = 'email',
}
  
export type EmailLoginPayload = {
  email: string;
  password: string;
  sessionId?: string;
  };

export type GoogleOAuthLoginPayload = {
  gAccessToken: string;
  sessionId?: string;
  };
  

export type LoginPayload = {
  provider: Provider;
  metaData: EmailLoginPayload | GoogleOAuthLoginPayload;
};
  
export interface LoginResponse extends IBaseResponse<{
    user: User;
    tokens: {
      access: Token;
      refresh: Token;
    };
}> {}


export interface UserResponse extends IBaseResponse<{
    user: User;
}> {}