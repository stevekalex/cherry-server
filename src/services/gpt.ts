import OpenAI from "openai";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

const client = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

export enum GPTModel {
    GPT_4O = "gpt-4o",
}

export const generateText = async (input: string, model: GPTModel) => {
    const completion = await client.responses.create({
        model,
        input
    });
    return completion.output_text;
};
