import { getCookie } from "cookies-next";
import { TOKEN } from "@/constants/cookie";

export const isClient = () => {
  return typeof window !== "undefined";
};

export const isTokenValid = (tokenExpiry: string | number) => {
  if (typeof tokenExpiry === "number") {
    return tokenExpiry > Date.now();
  }
  return new Date(tokenExpiry).getTime() > Date.now();
};

export const createBearerToken = (token: string) => {
  if (token) {
    return `Bearer ${token}`;
  }
  return "";
};

export const getClientAccessToken = () => {
  if (isClient()) {
    const cookieToken = getCookie(TOKEN);
    console.log({cookieToken})
    if (cookieToken) {
      return JSON.parse(cookieToken as string).access.token;
    }
  }
  return null;
};

export const getClientRefreshToken = () => {
  if (isClient()) {
    const cookieToken = getCookie(TOKEN);
    if (cookieToken) {
      return JSON.parse(cookieToken as string).refresh.token;
    }
  }
  return null;
};
