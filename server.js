const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { testConnection } = require('./db');
require('dotenv').config();

const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const officesRouter = require('./routes/offices');
const ordersRouter = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const productsRouter = require('./routes/products');
const productlinesRouter = require('./routes/productlines');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure helmet with disabled problematic headers
app.use(helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false // Disable CSP for development
}));

// Configure CORS with simpler settings
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Root route - redirect to dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'P2 OC API - Classic Models Database Analysis',
    version: '3.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    description: 'Express.js API untuk analisis database ClassicModels dengan query komprehensif',
    documentation: '/docs',
    health: '/health',
    endpoints: {
      customers: '/api/customers',
      employees: '/api/employees',
      offices: '/api/offices',
      orders: '/api/orders',
      payments: '/api/payments',
      products: '/api/products',
      productlines: '/api/productlines'
    }
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Documentation route
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
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

const router = express.Router();


app.use('/api/customers', customersRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/offices', officesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/products', productsRouter);
app.use('/api/productlines', productlinesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
