const express = require('express');
const router = express.Router();
const productLinesController = require('../controllers/productLinesController');

// === PRODUCT LINES ROUTES ===
router.get('/', productLinesController.getAllProductLines);
router.get('/total', productLinesController.getTotalProductLines);
router.get('/with-count', productLinesController.getProductLinesWithCount);
router.get('/:productLine', productLinesController.getProductLineByName);

module.exports = router;
