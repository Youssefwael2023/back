const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user,
    } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }
    const order = new Order({
      user,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user orders", error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching all orders", error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log('Updating order status:', req.params.id, status);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    if (status === "Pending") {
      order.isShipped = false;
      order.isDelivered = false;
    } else if (status === "Shipped") {
      order.isShipped = true;
      order.isDelivered = false;
    } else if (status === "Delivered") {
      order.isDelivered = true;
      order.isShipped = true;
    }

    const updatedOrder = await order.save();
    console.log('Order updated successfully:', updatedOrder);

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res
      .status(500)
      .json({ message: "Error updating order status", error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { isPaid } = req.body;
    console.log('Updating payment status:', req.params.id, isPaid);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = isPaid;
    if (isPaid) {
      order.paidAt = new Date();
    } else {
      order.paidAt = null;
    }

    const updatedOrder = await order.save();
    console.log('Payment status updated successfully:', updatedOrder);

    res
      .status(200)
      .json({ message: "Payment status updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res
      .status(500)
      .json({ message: "Error updating payment status", error: err.message });
  }
};
