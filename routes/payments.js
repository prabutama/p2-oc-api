const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

// === PAYMENTS ROUTES ===
router.get('/', paymentsController.getAllPayments);
router.get('/total-amount', paymentsController.getTotalAmount);
router.get('/by-customer', paymentsController.getPaymentsByCustomer);
router.get('/by-year', paymentsController.getPaymentsByYear);
router.get('/by-year-month', paymentsController.getPaymentsByYearMonth);
router.get('/above-average', paymentsController.getCustomersAboveAveragePayment);
router.get('/statistics', paymentsController.getPaymentStatistics);
router.get('/top-customers', paymentsController.getTopPayingCustomers);
router.get('/date-range', paymentsController.getPaymentsByDateRange);
router.get('/customer/:customerNumber', paymentsController.getPaymentByCustomer);

module.exports = router;