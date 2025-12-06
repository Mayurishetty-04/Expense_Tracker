// backend/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import route files
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

const app = express();

// Middlewares
app.use(cors());            // Allows frontend (React) to talk to backend
app.use(express.json());    // Parse incoming JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
