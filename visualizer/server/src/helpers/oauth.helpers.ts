import axios from 'axios';
import crypto from 'crypto';
import { REGISTRATION_PROVIDERS } from '../constants/auth';
import { AppError } from '../errors/app-error';
import httpStatus from 'http-status';

export interface GoogleUserData {
  email: string;
  given_name: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

export interface ProcessedOAuthData {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  provider: string;
  isEmailVerified: boolean;
}

export const validateGoogleTokenAndGetData = async (googleIdToken: string): Promise<ProcessedOAuthData> => {
  try {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleIdToken}` }
    })

    if (!data.email || !data.given_name) {
      throw new AppError('Incomplete user data from Google', httpStatus.BAD_REQUEST);
    }

    return {
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      avatar: data.picture,
      provider: REGISTRATION_PROVIDERS.GOOGLE,
      isEmailVerified: data.email_verified === 'true' || data.email_verified === true,
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Invalid Google ID token');
    }
    throw new Error(`Google token validation failed: ${error.message}`);
  }
};

export const generateRandomPassword = (): string => {
  return crypto.randomBytes(16).toString('hex');
};


/**
 * Get or create user for OAuth authentication
 * This function handles the logic for finding existing users or creating new ones
 */
export const getOrCreateUserForOAuth = async (
  getDataFn: () => Promise<ProcessedOAuthData>,
  userService: {
    findUserByEmail?: (email: string) => Promise<any>;
    getUserByEmail: (email: string) => Promise<any>;
    createUserItem: (userData: any) => Promise<any>;
  }
): Promise<any> => {
  const userData = await getDataFn();

  // Try to find user by email first (if supported)
  let user = null;
  if (userService.findUserByEmail) {
    user = await userService.findUserByEmail(userData.email);
  }

  // If not found by email, try by contact (fallback)
  if (!user && userData.email) {
    user = await userService.getUserByEmail(userData.email);
  }

  if (user) {
    return user;
  }

  const newUser = await userService.createUserItem({
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: generateRandomPassword(),
    avatar: userData.avatar,
    email: userData.email,
    provider: userData.provider,
    isEmailVerified: userData.isEmailVerified
  });

  return newUser;
}; 