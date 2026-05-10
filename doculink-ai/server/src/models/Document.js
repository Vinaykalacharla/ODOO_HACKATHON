const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: String,
  metadata: Object,
  embedding: [Number] // For semantic search
});

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileName: String,
  fileType: String,
  fileSize: Number,
  url: String,
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error'],
    default: 'uploading'
  },
  chunks: [chunkSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', documentSchema);
