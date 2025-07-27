import { BaseResponseWithData } from "./base";
import { IUser } from "../model/user.model";


export type LoginRequest = {
  contact: string;
  password: string;
};

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends BaseResponseWithData<{
  user: IUser;
  tokens : Tokens
} | null> {}


export type RegisterRequest = {
  contact: string;
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

