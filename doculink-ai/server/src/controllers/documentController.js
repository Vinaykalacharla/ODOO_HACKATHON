const Document = require('../models/Document');
const aiService = require('../services/aiService');
const pdf = require('pdf-parse');

/**
 * Controller for Document management and RAG indexing
 */
const documentController = {
  /**
   * Upload and process a new document
   */
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // 1. Save metadata to DB
      const newDoc = await Document.create({
        user: req.user.id,
        title: req.body.title || req.file.originalname,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        status: 'processing'
      });

      // 2. Parse PDF
      const dataBuffer = req.file.buffer;
      const data = await pdf(dataBuffer);
      const fullText = data.text;

      // 3. Chunk text
      const textChunks = aiService.chunkText(fullText);

      // 4. Generate embeddings and save chunks
      const chunkData = [];
      for (const chunk of textChunks) {
        const embedding = await aiService.generateEmbedding(chunk);
        chunkData.push({
          text: chunk,
          embedding: embedding
        });
      }

      newDoc.chunks = chunkData;
      newDoc.status = 'ready';
      await newDoc.save();

      res.status(201).json({ data: newDoc });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get all documents for a user
   */
  async getDocuments(req, res) {
    try {
      const docs = await Document.find({ user: req.user.id }).select('-chunks');
      res.json({ data: docs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get single document details
   */
  async getDocument(req, res) {
    try {
      const doc = await Document.findOne({ _id: req.params.id, user: req.user.id }).select('-chunks');
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json({ data: doc });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Delete a document
   */
  async deleteDocument(req, res) {
    try {
      const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Document deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = documentController;
