const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isValidToken } = require('../middlewares/auth')

router.get('/', isValidToken, productController.getAllProducts);
router.get('/:id', isValidToken, productController.getProductById);
router.post('/', isValidToken, productController.createProduct);
router.post('/bulk', isValidToken, productController.createProducts);

module.exports = router;
