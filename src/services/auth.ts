// auth.ts
import { OAuth2Client, TokenPayload } from 'google-auth-library';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

// Create the OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
);

// Define user type based on Google profile
interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  access_token?: string;
  refresh_token?: string;
}

// Generate auth URL
const getAuthUrl = (state?: string) => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent', // Required for refresh tokens
    state // Optional state parameter for security
  });

  return authUrl
};

// Verify callback code and create/update user
const verifyCode = async (code: string): Promise<GoogleUser> => {
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    
    if (!tokens.id_token) {
      throw new Error('No ID token received from Google');
    }
    
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload() as TokenPayload;
    
    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Invalid user data received from Google');
    }
    
    // Create user object from Google profile
    const user: GoogleUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
      access_token: tokens.access_token ?? undefined,
      refresh_token: tokens.refresh_token ?? undefined
    };
    
    return user
  } catch (error) {
    console.error('OAuth verification error:', error);
    throw new Error('Authentication failed');
  }
};

// Refresh access token when it expires
const refreshAccessToken = async (refreshToken: string) => {
  try {
    client.setCredentials({
      refresh_token: refreshToken
    });
    
    const { credentials } = await client.refreshAccessToken();
    return credentials;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error('Failed to refresh authentication');
  }
};

// Revoke tokens on logout
const revokeToken = async (token: string) => {
  try {
    await client.revokeToken(token);
    return true;
  } catch (error) {
    console.error('Token revocation error:', error);
    return false;
  }
};

export { getAuthUrl, verifyCode, refreshAccessToken, revokeToken, GoogleUser };
