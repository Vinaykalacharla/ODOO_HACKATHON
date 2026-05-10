const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  citations: [{
    text: String,
    chunkId: String,
    score: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  title: String,
  messages: [messageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
