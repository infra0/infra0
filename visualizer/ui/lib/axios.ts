import coreAxios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { setCookie } from 'cookies-next';
import { TOKEN } from '@/constants/cookie';

import { getNewAuthTokens } from '@/services/auth/auth.service';
import {
  isTokenValid,
  createBearerToken,
  getClientAccessToken,
  getClientRefreshToken,
} from '@/utils/function';

const axios = coreAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const requestAuthInterceptor = axios.interceptors.request.use(
  async (config) => {
    const accessToken = getClientAccessToken();
    if (accessToken) {
      const accessExpire = jwtDecode<{ exp: number }>(accessToken)?.exp;
      if (accessExpire) {
        config.headers['Authorization'] = createBearerToken(accessToken);

        if (!isTokenValid(accessExpire * 1000)) {
          const refreshToken = getClientRefreshToken();
          const refreshExpire = jwtDecode<{ exp: number }>(refreshToken)?.exp;
          if (isTokenValid(refreshExpire * 1000)) {
            const newTokens = await getNewAuthTokens(refreshToken);
            setCookie(TOKEN, JSON.stringify(newTokens));
            config.headers['Authorization'] = createBearerToken(
              newTokens.access.token
            );
          } else {
            // window.location.href = "/logout" // TOOD: We can implement forced logout for private pages, not public pages
            throw new Error('Access & Refresh Tokens invalid, forcing logout.');
          }
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const attachUserIdToApi = (userId: string) => {
  axios.defaults.headers.common['x-user-id'] = userId;
};

export const internalApi = coreAxios.create({
  baseURL: '/api',
});

export const isCancel = coreAxios.isCancel;
export const CancelToken = coreAxios.CancelToken;

export default axios;
