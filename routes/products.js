const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// === PRODUCTS ROUTES ===
router.get('/', productsController.getAllProducts);
router.get('/total', productsController.getTotalProducts);
router.get('/by-line', productsController.getProductsByLine);
router.get('/stock-by-line', productsController.getStockByProductLine);
router.get('/vendors/total', productsController.getTotalVendors);
router.get('/by-vendor', productsController.getProductsByVendor);
router.get('/orders-by-product', productsController.getOrdersByProduct);
router.get('/most-customers', productsController.getProductWithMostCustomers);
router.get('/price-range', productsController.getProductsByPriceRange);
router.get('/low-stock', productsController.getLowStockProducts);
router.get('/customer/:customerName', productsController.getProductsByCustomer);
router.get('/:productCode', productsController.getProductByCode);
router.get('/:productCode/details', productsController.getProductDetails);

module.exports = router;
