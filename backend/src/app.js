import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports (will be created in next steps)
import authRoutes from './modules/auth/routes.js';
import tripRoutes from './modules/trips/routes.js';
import stopRoutes from './modules/stops/routes.js';
import activityRoutes from './modules/activities/routes.js';
import budgetRoutes from './modules/budget/routes.js';
import packingRoutes from './modules/packing/routes.js';
import noteRoutes from './modules/notes/routes.js';
import cityRoutes from './modules/cities/routes.js';
import publicRoutes from './modules/public/routes.js';
import adminRoutes from './modules/admin/routes.js';

const app = express();

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite dev server
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// ─── Entry Point Messages ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('<h1>🌍 Traveloop API is Running</h1><p>Use <code>/api</code> endpoints for data.</p>');
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Traveloop API', 
    version: '1.0.0',
    endpoints: ['/auth', '/trips', '/cities', '/public', '/admin']
  });
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'traveloop-backend' });
});

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
