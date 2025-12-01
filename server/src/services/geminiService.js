import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAffirmationText(name, description) {
  try {
    const prompt = `
Write a short positive affirmation (3–5 lines) for ${name}.
Context about their life: ${description}.
Tone must be warm, friendly, encouraging, human-like.
Do NOT use emojis.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text.trim();
  } catch (err) {
    console.error("Gemini Error:", err.message);

    return `Today is a fresh start, ${name}. Believe in yourself and move forward with confidence.`;
  }
}
