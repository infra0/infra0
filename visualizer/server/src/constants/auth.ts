export const REGISTRATION_PROVIDERS = {
  GOOGLE: 'google',
  EMAIL: 'email',
  // Future providers can be added here
  // FACEBOOK: 'facebook',
  // GITHUB: 'github'
} as const;

export const PROVIDER_LIST = Object.values(REGISTRATION_PROVIDERS);

export type ProviderType = typeof REGISTRATION_PROVIDERS[keyof typeof REGISTRATION_PROVIDERS]; 