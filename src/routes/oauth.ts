import express from 'express';
import { getAuthUrl, revokeToken, verifyCode } from '../services/auth';
import UserService from '../services/user';

const router = express.Router();

declare module 'express-session' {
    interface Session {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: any; // TODO - create user type
      isAuthenticated?: boolean;
      oauthState?: string;
    }
}

// Generate a random state string for CSRF protection
const generateState = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Initiate OAuth flow
router.get('/google', (req, res) => {
  const state = generateState();

  if (req.session) {
    req.session.oauthState = state;
  }
  
  res.redirect(getAuthUrl(state));
});

// Handle OAuth callback
router.get('/google/callback', async (req: express.Request, res: express.Response) => {
  try {
    const { code, state } = req.query;
    
    if (!req.session || state !== req.session.oauthState) {
      throw new Error('Invalid state parameter');
    }
    
    delete req.session.oauthState;
    
    const googleUser = await verifyCode(code as string);
    const user = await UserService.findOrCreateUser(googleUser);
  
    req.session.user = user;
    req.session.isAuthenticated = true;
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Authentication error:', err);
    res.redirect('/login?error=auth_failed');
  }
});

// Logout route
router.get('/logout', async (req: express.Request, res: express.Response) => {
  try {
    // If we have an access token, revoke it
    if (req.session?.user?.accessToken) {
      await revokeToken(req.session.user.accessToken);
    }
    
    // Clear session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        res.redirect('/login');
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error('Logout error:', err);
    res.redirect('/dashboard');
  }
});

export default router;
