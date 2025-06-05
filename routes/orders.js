const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// === ORDERS ROUTES ===
router.get('/', ordersController.getAllOrders);
router.get('/total', ordersController.getTotalOrders);
router.get('/by-year-month', ordersController.getOrdersByYearMonth);
router.get('/shipped', ordersController.getShippedOrders);
router.get('/shipped-by-year', ordersController.getShippedOrdersByYear);
router.get('/count-by-customer', ordersController.getOrdersCountByCustomer);
router.get('/delivery-time', ordersController.getCustomerDeliveryTime);
router.get('/on-hold', ordersController.getOnHoldOrders);
router.get('/status/:status', ordersController.getOrdersByStatus);
router.get('/:orderNumber', ordersController.getOrderByNumber);
router.get('/:orderNumber/details', ordersController.getOrderDetails);

module.exports = router;