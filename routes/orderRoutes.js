const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isValidToken } = require('../middlewares/auth');

router.post('/', isValidToken, orderController.createOrder);
router.get('/', isValidToken, orderController.getOrders);

module.exports = router;
