const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { getQuery, testConnection } = require('./db');
require('dotenv').config();

const employeesRouter = require('./routes/employees');
const officesRouter = require('./routes/offices');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'P2 OC API - Classic Models Database Analysis',
    version: '3.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    description: 'Express.js API untuk analisis database ClassicModels dengan query komprehensif',
    documentation: '/docs',
    health: '/health',
    api: '/api',
  });
});

app.get('/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      status: 'healthy',
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// --- API ROUTES ---
const router = express.Router();

// Use the modularized routes
app.use('/api/employees', employeesRouter);
app.use('/api/offices', officesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    available_routes: {
      root: '/',
      health: '/health',
      api: '/api'
    }
  });
});

// API endpoint contoh: Total customers
app.get('/api/customers/total', async (req, res) => {
  try {
    const result = await getQuery('SELECT COUNT(DISTINCT customerNumber) as total_customers FROM customers');
    res.json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API endpoint contoh: Customers by country
app.get('/api/customers/by-country', async (req, res) => {
  try {
    const result = await getQuery('SELECT country, COUNT(*) as total FROM customers GROUP BY country ORDER BY total DESC');
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// TODO: Tambahkan endpoint lain sesuai query di axon-data.sql

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
