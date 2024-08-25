const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { isValidToken } = require('../middlewares/auth');

router.patch('/updateStatus/:id', isValidToken, deliveryController.updateDeliveryStatus);
router.patch('/assignDeliveryPerson/:id', isValidToken, deliveryController.assignDeliveryPerson);

module.exports = router;
