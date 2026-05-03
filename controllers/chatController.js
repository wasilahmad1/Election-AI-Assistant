const aiService = require('../services/aiService');

const chatController = {
    /**
     * Handles POST /api/chat requests
     */
    postChat: async (req, res, next) => {
        try {
            const { message, history } = req.body;

            if (!message) {
                const error = new Error('Message is required.');
                error.status = 400;
                throw error;
            }

            const responseText = await aiService.handleChat(message, history);
            res.json({ response: responseText });
        } catch (error) {
            // Check if it's an API quota/fetch error and customize the message if needed,
            // otherwise pass to centralized error handler
            if (error.status === 429) {
                error.message = 'Service is currently busy or quota exceeded. Please try again later.';
            } else if (!error.status) {
                 error.message = 'Failed to process your request. Please try again later.';
            }
            next(error);
        }
    },

    /**
     * Handles POST /api/question requests
     */
    postQuestion: async (req, res, next) => {
        try {
            const { question } = req.body;

            if (!question) {
                const error = new Error('Question is required.');
                error.status = 400;
                throw error;
            }

            const responseText = await aiService.answerQuestion(question);
            res.json({ answer: responseText });
        } catch (error) {
            if (error.status === 429) {
                error.message = 'Service is currently busy or quota exceeded. Please try again later.';
            } else if (!error.status) {
                 error.message = 'Failed to answer your question. Please try again later.';
            }
            next(error);
        }
    }
};

module.exports = chatController;
