import 'express-session';

declare module 'express-session' {
  interface Session {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any; // TODO - fix this
    isAuthenticated?: boolean;
    oauthState?: string;
  }
}