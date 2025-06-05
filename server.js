const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
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
