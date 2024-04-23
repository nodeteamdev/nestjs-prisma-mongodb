export type SocialType = 'google' | 'facebook' | 'twitter' | 'apple';

export interface ISocialUser {
  type: SocialType;
  providerId: string;
  email?: string;
  emailVerified: boolean;
  name?: string;
  tokens?: {
    accessToken: string;
    refreshToken?: string;
    tokenSecret?: string;
  };
}
