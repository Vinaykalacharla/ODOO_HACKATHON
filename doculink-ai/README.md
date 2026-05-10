# 🧠 DocuLink AI — Intelligent Document Query System

DocuLink AI is a production-grade, full-stack RAG (Retrieval-Augmented Generation) platform designed for seamless interaction with static documents. It leverages advanced NLP and vector embeddings to transform PDFs into interactive knowledge bases.

## 🚀 Key Features

- **Semantic Search (RAG):** Context-aware retrieval using vector embeddings and cosine similarity.
- **Smart Citations:** AI responses are verified with direct citations from the source document.
- **Instant Indexing:** Parallelized chunking and embedding generation for large PDFs.
- **Premium UI/UX:** Glassmorphism design system built with Framer Motion and Tailwind CSS.
- **Secure Auth:** JWT session management with password hashing and protected routes.
- **Analytics Dashboard:** Visual tracking of document processing and system health.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Zustand.
- **Backend:** Node.js, Express, Multer, PDF-Parse.
- **AI Engine:** Google Gemini Pro, Gemini Embeddings.
- **Database:** MongoDB (Metadata & Chat History).
- **Security:** Helmet, Rate Limiting, XSS Protection.

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 2. Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### 3. Installation
```bash
# Clone the project and install dependencies
cd server && npm install
cd ../client && npm install
```

### 4. Running Locally
```bash
# Start Backend
cd server && npm start

# Start Frontend
cd client && npm run dev
```

## 📐 Architecture Explanation

DocuLink AI follows a **modular RAG pipeline**:
1. **Ingestion:** PDF text is extracted and split into overlapping chunks to preserve context.
2. **Embedding:** Each chunk is converted into a 768-dimensional vector using Google's `embedding-001`.
3. **Retrieval:** User queries are vectorized and compared against chunk embeddings using cosine similarity.
4. **Augmentation:** The top $N$ most relevant chunks are injected into the LLM prompt.
5. **Generation:** Gemini Pro generates a response based *strictly* on the provided context.

---
Built for the **HackRx / Odoo Hackathon** with excellence.
