const Cart = require('../models/Cart');
const mongoose = require('mongoose');

exports.getCart = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (typeof userId !== 'string') userId = String(userId);
        userId = userId.trim();
        if (!/^[a-fA-F0-9]{24}$/.test(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }
        userId = new mongoose.Types.ObjectId(userId);
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        res.json(cart || { user: req.params.userId, items: [] });
    } catch (err) {
        console.error("Cart fetch error:", err);
        res.status(500).json({ message: 'Error fetching cart', error: err.message });
    }
};

exports.addOrUpdateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new Cart({ user: req.params.userId, items: [] });
        }
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error updating cart', error: err.message });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error removing item', error: err.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        cart.items = [];
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error clearing cart', error: err.message });
    }
}; 