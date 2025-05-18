const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:userId', cartController.getCart);
router.post('/:userId', cartController.addOrUpdateCartItem);
router.delete('/:userId/:productId', cartController.removeCartItem);
router.delete('/:userId', cartController.clearCart);

module.exports = router; 