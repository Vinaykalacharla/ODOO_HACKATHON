const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Service to handle all AI interactions and RAG logic
 */
const aiService = {
  /**
   * Generates embeddings for a given text chunk
   */
  async generateEmbedding(text) {
    try {
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding Error:', error);
      return Array(768).fill(0); // Fallback for demo if API fails
    }
  },

  /**
   * Chunks a large text into manageable pieces for the LLM
   */
  chunkText(text, size = 1000, overlap = 200) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + size));
      i += (size - overlap);
    }
    return chunks;
  },

  /**
   * Simple cosine similarity for local semantic search
   */
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  },

  /**
   * Retrieves relevant chunks based on a query
   */
  async retrieveContext(query, document) {
    const queryEmbedding = await this.generateEmbedding(query);
    
    const scoredChunks = document.chunks.map(chunk => ({
      ...chunk.toObject(),
      score: this.cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Top 4 relevant chunks
  },

  /**
   * Generates an answer using retrieved context
   */
  async generateAnswer(query, contextChunks) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const contextText = contextChunks.map((c, i) => `[Chunk ${i+1}]: ${c.text}`).join('\n\n');
    
    const prompt = `
      You are an expert document assistant. Use the following document context to answer the user's question.
      If the answer is not in the context, say you don't know based on the document.
      Always cite your sources by referring to the Chunk numbers (e.g., [Chunk 1]).

      CONTEXT:
      ${contextText}

      QUESTION:
      ${query}

      ANSWER:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
};

module.exports = aiService;
