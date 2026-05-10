const ChatSession = require('../models/ChatSession');
const Document = require('../models/Document');
const aiService = require('../services/aiService');

/**
 * Controller for RAG-powered chat sessions
 */
const chatController = {
  /**
   * Start or continue a chat session
   */
  async sendMessage(req, res) {
    try {
      const { sessionId, documentId, query } = req.body;

      // 1. Find or create session
      let session;
      if (sessionId) {
        session = await ChatSession.findOne({ _id: sessionId, user: req.user.id });
      } else {
        session = await ChatSession.create({
          user: req.user.id,
          document: documentId,
          title: query.slice(0, 30) + '...'
        });
      }

      if (!session) return res.status(404).json({ error: 'Session not found' });

      // 2. Fetch document for context
      const document = await Document.findById(session.document);
      if (!document) return res.status(404).json({ error: 'Document not found' });

      // 3. Retrieve relevant context chunks
      const contextChunks = await aiService.retrieveContext(query, document);

      // 4. Generate AI Answer
      const answer = await aiService.generateAnswer(query, contextChunks);

      // 5. Save message to session
      session.messages.push({
        role: 'user',
        content: query
      });

      session.messages.push({
        role: 'assistant',
        content: answer,
        citations: contextChunks.map(c => ({
          text: c.text.slice(0, 100) + '...',
          score: c.score
        }))
      });

      session.lastMessageAt = Date.now();
      await session.save();

      res.json({ 
        data: {
          sessionId: session._id,
          answer: answer,
          citations: session.messages[session.messages.length - 1].citations
        }
      });
    } catch (error) {
      console.error('Chat Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get all chat sessions for a user
   */
  async getSessions(req, res) {
    try {
      const sessions = await ChatSession.find({ user: req.user.id }).populate('document', 'title');
      res.json({ data: sessions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get full history for a specific session
   */
  async getSessionHistory(req, res) {
    try {
      const session = await ChatSession.findOne({ _id: req.params.id, user: req.user.id });
      if (!session) return res.status(404).json({ error: 'Not found' });
      res.json({ data: session });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = chatController;
