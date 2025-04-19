import express from 'express';
import session from 'express-session';
import oauthRouter from './routes/oauth';
const app = express();
const PORT = 3000;
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/auth', oauthRouter);

export default app;