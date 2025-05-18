const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const adminController = require("../controllers/adminController");
const Order = require("../models/Order");

router.get("/admin/stats", adminController.getDashboardStats);

router.post("/", orderController.createOrder);

router.get("/user/:userId", orderController.getUserOrders);

router.get("/", orderController.getAllOrders);

router.put("/:id/payment", orderController.updatePaymentStatus);
router.put("/:id/status", orderController.updateOrderStatus);

router.get("/:id", orderController.getOrderById);

module.exports = router;
