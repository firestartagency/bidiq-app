/**
 * gemini.ts
 * Server-side only — this file must never be imported in client components.
 * The API key is read from process.env and is never exposed to the browser.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('[BidIQ] GOOGLE_AI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Returns a Gemini model instance.
 * Defaults to gemini-1.5-pro which has the context window needed for long solicitation docs.
 */
export function getModel(modelName = 'gemini-1.5-pro') {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Simple one-shot text generation. Returns the full text string.
 */
export async function generate(prompt: string, systemInstruction?: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    ...(systemInstruction ? { systemInstruction } : {}),
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}
