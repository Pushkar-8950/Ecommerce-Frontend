import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * @desc    Generate text content using Google Gemini API (gemini-1.5-flash)
 * @route   POST /api/ai/generate
 * @access  Public (Can be protected by adding 'protect' middleware)
 */
export const generateText = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    // 1. Validate prompt presence and type
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: 'A non-empty string field "prompt" is required in the JSON body.',
      });
      return;
    }

    // 2. Validate GEMINI_API_KEY environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
      res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured. Please add a valid key from Google AI Studio to your .env file.',
      });
      return;
    }

    // 3. Initialize Google Gemini SDK with Gemini 3.1 Flash Lite (or override via body / env)
    const modelName = req.body.model || process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    // 4. Call Gemini model
    const result = await model.generateContent(prompt.trim());
    const response = await result.response;
    const generatedText = response.text();

    res.status(200).json({
      success: true,
      message: 'AI response generated successfully.',
      data: {
        model: modelName,
        prompt: prompt.trim(),
        text: generatedText,
      },
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);

    // Provide friendly error message for common issues
    let userMessage = 'Failed to generate AI response from Gemini API.';
    if (error.status === 400 || error.message?.includes('API key not valid')) {
      userMessage = 'Invalid Gemini API key. Please verify your GEMINI_API_KEY in .env.';
    } else if (error.status === 429 || error.message?.includes('quota')) {
      userMessage = 'Gemini API quota exceeded. Please try again later.';
    }

    res.status(500).json({
      success: false,
      message: userMessage,
      error: error.message || 'Unknown error occurred during AI generation.',
    });
  }
};
