import { BaseResponseWithData } from "./base";
import { IUser } from "../model/user.model";


export type LoginRequest = {
  contact: string;
  password: string;
};

export interface LoginResponse extends BaseResponseWithData<{
  token: string;
  user: IUser;
} | null> {}


export type RegisterRequest = {
  contact: string;
  password: string;
  firstName: string;
  lastName: string;
};

export interface RegisterResponse extends BaseResponseWithData<{
  token: string;
  user: IUser;
} | null> {}

