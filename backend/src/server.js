import app from './app.js';
import { validateEnv } from './config/env.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
  // Validate environment variables before starting
  validateEnv();

  app.listen(PORT, () => {
    console.log(`🚀 Traveloop Backend running at http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} catch (err) {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
}
