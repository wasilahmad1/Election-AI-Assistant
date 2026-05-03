const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// The system prompt instructs the AI on its role and rules
const SYSTEM_PROMPT = `You are an Election AI Assistant designed to provide clear, neutral, and factual information about elections.

Rules:
- Stay politically neutral
- Do NOT promote any party or candidate
- Provide factual, verified-style explanations
- Simplify complex topics for beginners
- If unsure, say you don’t have enough information

Capabilities:
- Explain election processes
- Compare policies neutrally
- Answer voter-related questions
- Provide general civic education

Tone:
- Simple, clear, unbiased, helpful`;

class AIService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.genAI = null;
        this.modelName = "gemini-2.0-flash"; // Using the verified working model

        if (!this.apiKey) {
            logger.warn('GEMINI_API_KEY is not set in environment variables.');
        } else {
            this.genAI = new GoogleGenerativeAI(this.apiKey);
        }
    }

    /**
     * Helper to get the model instance. Throws if API key is missing.
     */
    getModel() {
        if (!this.genAI) {
            const error = new Error('Server configuration error: Missing API Key.');
            error.status = 500;
            throw error;
        }
        return this.genAI.getGenerativeModel({
            model: this.modelName,
            systemInstruction: SYSTEM_PROMPT
        });
    }

    /**
     * Handles a multi-turn chat conversation.
     * @param {string} message - The new user message.
     * @param {Array} history - Previous conversation history.
     * @returns {Promise<string>} The AI's response text.
     */
    async handleChat(message, history) {
        try {
            const model = this.getModel();

            // Convert history to the format expected by the API
            const formattedHistory = history ? history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })) : [];

            const chat = model.startChat({
                history: formattedHistory,
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const result = await chat.sendMessage(message);
            return result.response.text();
        } catch (error) {
            logger.error('Error in AIService.handleChat:', error);
            // Re-throw to be caught by the controller
            throw error;
        }
    }

    /**
     * Handles a single, stateless question.
     * @param {string} question - The user's question.
     * @returns {Promise<string>} The AI's response text.
     */
    async answerQuestion(question) {
        try {
            const model = this.getModel();
            const result = await model.generateContent(question);
            return result.response.text();
        } catch (error) {
            logger.error('Error in AIService.answerQuestion:', error);
            // Re-throw to be caught by the controller
            throw error;
        }
    }
}

// Export a singleton instance
module.exports = new AIService();
