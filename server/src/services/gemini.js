import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generateWelcomeMessage = async (username, description) => {
  try {
    const prompt = `Generate a warm, welcoming message for ${username} who has just subscribed to a daily affirmation service. 
    Their description: ${description}
    
    The message should:
    - Welcome them warmly
    - Acknowledge their journey
    - Be encouraging and positive
    - Be concise (2-3 sentences)
    - Not mention technical details about the service
    
    Format: Just return the message text without any quotation marks or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return `Welcome aboard, ${username}! We're excited to be part of your journey towards positivity and growth. Your first affirmation will arrive tomorrow at 8 AM.`;
  }
};

export const generateDailyAffirmation = async (username, description) => {
  try {
    const prompt = `Generate a personalized, uplifting daily affirmation for ${username}.
    Context about them: ${description}
    
    Requirements:
    - Make it personal and relevant to their situation
    - Keep it positive and empowering
    - Use "you" or their name naturally
    - Be authentic and heartfelt
    - Keep it concise (1-2 sentences)
    - Make it actionable or thought-provoking
    
    Format: Just return the affirmation text without any quotation marks or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return `${username}, today you have the power to create positive change. Trust in your journey and embrace each moment with confidence.`;
  }
};