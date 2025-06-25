const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// === DASHBOARD ROUTES ===
router.get('/overview', dashboardController.getDashboardOverview);
router.get('/sales-performance', dashboardController.getSalesPerformance);
router.get('/top-products', dashboardController.getTopProducts);
router.get('/customer-growth', dashboardController.getCustomerGrowth);
router.get('/regional-performance', dashboardController.getRegionalPerformance);
router.get('/order-status', dashboardController.getOrderStatusDistribution);

module.exports = router;
