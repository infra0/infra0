import newAxios from 'axios';

import axios from '@/lib/axios';
import { createBearerToken } from '@/utils/function';
import {
  LoginPayload,
  LoginResponse,
  IGetNewAuthTokensReturnValues,
  UserResponse,
} from './auth.service.types';
import { User } from '@/types/user';

// DO NOT REMOVE: This is required to prevent multiple looping for axios request from @/lib/axios
const newTokenAxios = newAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getNewAuthTokens = async (refreshToken: string) => {
  const { data } = await newTokenAxios.post<IGetNewAuthTokensReturnValues>(
    '/v1/auth/refresh',
    {
      refreshToken,
    }
  );
  return data.tokens;
};

export const validateAccessToken = async (token: string) => {
  const { data } = await axios.get<boolean>('/v1/auth/validate', {
    headers: { Authorization: createBearerToken(token) },
  });
  return data;
};

export const getLoggedInUser = async () => {
  const { data } = await axios.get<UserResponse>('/v1/auth/me');
  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await axios.post<LoginResponse>('/v1/auth/login', payload);
  return data;
};
