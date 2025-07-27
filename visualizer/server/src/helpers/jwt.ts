// create a jwt token function that will be used to create a token for the user

import jwt from 'jsonwebtoken';
import { config } from '../../config';
import bcrypt from 'bcrypt';

// Create access token (short-lived - 15 minutes)
export const createAccessToken = (payload: any) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
};

// Create refresh token (long-lived - 7 days)
export const createRefreshToken = (payload: any) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
};

// Create both tokens
export const createTokens = (payload: any) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const createToken = (payload: any) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '14d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};

export const correctPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};
