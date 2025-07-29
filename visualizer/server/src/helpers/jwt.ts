// create a jwt token function that will be used to create a token for the user

import jwt from 'jsonwebtoken';
import { config } from '../../config';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { JWT_PAYLOAD_TYPE, TokenTypes } from '../types/auth.types';

type AuthTokenPayload = {
  id: string;
}

const generateToken = (userId: string, expires: moment.Moment, type: TokenTypes, secret = config.jwt.secret) => {
  const payload : JWT_PAYLOAD_TYPE = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type : type
  }
  return jwt.sign(payload, secret)
}

export const generateAuthTokens = async (user: AuthTokenPayload) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')
  const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS)

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days')
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  }
}


export const extractAuthToken = (bearerToken: string) => {
  const authToken = bearerToken.split('Bearer ')[1]
  return authToken
}


export const generateOnlyAccessToken = async (user : AuthTokenPayload) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes')
  const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    }
  }
}

export const verifyToken = (token: string) : JWT_PAYLOAD_TYPE => {
  return jwt.verify(token, config.jwt.secret) as JWT_PAYLOAD_TYPE;
};

export const correctPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};
