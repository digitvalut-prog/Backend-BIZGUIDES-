// server.js — Express application entrypoint
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const leadsRouter = require('./routes/leads');
const adminRouter = require('./routes/admin');
const { generalRateLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (needed for correct req.ip behind load balancers / rate limiting)
app.set('trust proxy', 1);

// --- Security middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
  })
);

// --- Body parsing (with size limit to reduce abuse surface) ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- Logging ---
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// --- General rate limiting for all API routes ---
app.use('/api', generalRateLimiter);

// --- Health check ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/leads', leadsRouter);
app.use('/api/admin', adminRouter);

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 LaunchKit API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

module.exports = app;
