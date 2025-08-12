import { BaseResponseWithData } from "./base";
import { IUser } from "../model/user.model";
import { ProviderType } from "../constants/auth";
import { ISession } from "../model/session.model";


export type OAuthMetaData = {
  gIdToken?: string;
  gAccessToken?: string;
  email?: string;
  password?: string;
  sessionId?: string;
};

export type LoginRequest = {
  provider: ProviderType;
  metaData: OAuthMetaData;
};

export enum TokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh'
}

export type JWT_PAYLOAD_TYPE = {
  sub: string,
  iat: number,
  exp: number,
  type : TokenTypes
}
export interface Tokens {
  access: {
    token: string;
    expires: Date;
  }
  refresh: {
    token: string;
    expires: Date;
  }
}

export interface LoginResponse extends BaseResponseWithData<{
  user: IUser;
  tokens : Tokens
} | null> {}


export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export interface RegisterResponse extends BaseResponseWithData<{
  user: IUser;
  tokens : Tokens
} | null> {}

export type RefreshTokenRequest = {
  refreshToken: string;
};

export interface RefreshTokenResponse extends BaseResponseWithData<{
  tokens : Tokens
} | null> {}


export type SessionStatusRequest = {
  sessionId: string;
};

export interface SessionResponse extends BaseResponseWithData<ISession> {}