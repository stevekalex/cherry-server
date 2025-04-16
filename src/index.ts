import express from 'express';
import { generateText, GPTModel } from './services/gpt';
const app = express();
const PORT = 3000;
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

console.log(process.env.OPEN_AI_KEY);

app.get('/api/hello', async (_req, res) => {
  const response = await generateText("Write me a short story about a cat that learns to avoid procrastinating", GPTModel.GPT_4O);
  res.json({ message: 'Hello from Express! Here is your story: ' + response });
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
