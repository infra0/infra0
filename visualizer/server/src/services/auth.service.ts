import { 
  validateGoogleTokenAndGetData, 
  getOrCreateUserForOAuth 
} from '../helpers/oauth.helpers';
import { getUserByEmail, createUserItem } from './user.service';
import { correctPassword } from '../helpers/jwt';
import { REGISTRATION_PROVIDERS } from '../constants/auth';
import { IUser } from '../model/user.model';

export class AuthService {
  
  async authenticateWithEmail(email: string, password: string): Promise<IUser> {
    const user = await getUserByEmail(email);

    if (!user || !(await correctPassword(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  /**
   * Authenticate user with Google OAuth
   */
  async authenticateWithGoogle(googleToken: string): Promise<IUser> {
    return getOrCreateUserForOAuth(
      () => validateGoogleTokenAndGetData(googleToken),
      {
        findUserByEmail: getUserByEmail,
        getUserByEmail,
        createUserItem
      }
    );
  }

  /**
   * Universal authentication method that routes to appropriate auth method
   */
  async authenticate(provider: string, metaData: any): Promise<IUser> {
    switch (provider) {
      case REGISTRATION_PROVIDERS.GOOGLE:
        const googleToken = metaData.gAccessToken;
        if (!googleToken) {
          throw new Error('gAccessToken is required for Google authentication');
        }
        return this.authenticateWithGoogle(googleToken);

      case REGISTRATION_PROVIDERS.EMAIL:
        if (metaData.email && metaData.password) {
          return this.authenticateWithEmail(metaData.email, metaData.password);
        } else {
          throw new Error('Email/contact and password are required for email authentication');
        }

      default:
        throw new Error('Invalid authentication provider');
    }
  }
}

// Create singleton instance
export const authService = new AuthService(); 