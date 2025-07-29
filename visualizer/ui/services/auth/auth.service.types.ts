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
  
  type GoogleOAuthLoginPayload = {
    provider: 'google';
    metaData: {
      gAccessToken: string;
    };
  };
  
  type FacebookOAuthLoginPayload = {
    provider: 'facebook';
    metaData: {
      fUserId: string;
      fAccessToken: string;
    };
  };

//   type EmailLoginPayload = {
//     provider: 'email';
//     metaData: {
//       email: string;
//       password: string;
//     };
//   };
  
//   export type LoginPayload =
//     | GoogleOAuthLoginPayload
//     | FacebookOAuthLoginPayload
//     | EmailLoginPayload;


export type LoginPayload = {
    contact: string;
    password: string;
}
  
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