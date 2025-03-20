const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Import database and middleware
const { db } = require("../db");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// Create a new order
router.post("/", authenticateToken, (req, res) => {
  const { items, address, paymentMethod, useCoins, cardCodes, notes } =
    req.body;

  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Calculate order total
  let total = 0;
  const orderItems = items.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    return {
      id: uuidv4(),
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      options: item.options || [],
    };
  });

  // Apply coins if requested
  let coinsUsed = 0;
  if (useCoins && user.coinsBalance > 0) {
    // Assume 10 coins = 1 currency unit
    const maxCoinsToUse = Math.min(user.coinsBalance, total * 10);
    coinsUsed = maxCoinsToUse;
    total -= maxCoinsToUse / 10;

    // Update user's coins balance
    user.coinsBalance -= coinsUsed;
  }

  // Calculate coins earned (10% of total)
  const coinsEarned = Math.floor(total * 0.1 * 10);
  user.coinsBalance += coinsEarned;

  const newOrder = {
    id: uuidv4(),
    orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: user.id,
    status: "pending",
    items: orderItems,
    total,
    coinsUsed,
    coinsEarned,
    address,
    paymentMethod,
    notes,
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
  };

  db.orders.push(newOrder);

  res.status(201).json(newOrder);
});

// Get all orders for the authenticated user
router.get("/", authenticateToken, (req, res) => {
  const userOrders = db.orders.filter((o) => o.userId === req.user.id);
  res.json(userOrders);
});

// Get a specific order by ID
router.get("/:id", authenticateToken, (req, res) => {
  const order = db.orders.find(
    (o) => o.id === req.params.id && o.userId === req.user.id,
  );

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

// Cancel an order
router.post("/:id/cancel", authenticateToken, (req, res) => {
  const orderIndex = db.orders.findIndex(
    (o) => o.id === req.params.id && o.userId === req.user.id,
  );

  if (orderIndex === -1)
    return res.status(404).json({ message: "Order not found" });

  const order = db.orders[orderIndex];

  if (order.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Only pending orders can be cancelled" });
  }

  // Update order status
  order.status = "cancelled";
  db.orders[orderIndex] = order;

  // Refund coins if used
  if (order.coinsUsed > 0) {
    const user = db.users.find((u) => u.id === req.user.id);
    if (user) {
      user.coinsBalance += order.coinsUsed;
    }
  }

  res.json({ success: true, message: "Order cancelled successfully" });
});

// Track order status
router.get("/:id/track", authenticateToken, (req, res) => {
  const order = db.orders.find(
    (o) => o.id === req.params.id && o.userId === req.user.id,
  );

  if (!order) return res.status(404).json({ message: "Order not found" });

  // Define tracking steps
  const steps = [
    { title: "تم استلام الطلب", completed: true, time: order.createdAt },
    {
      title: "قيد التحضير",
      completed: order.status !== "pending",
      time:
        order.status !== "pending"
          ? new Date(
              new Date(order.createdAt).getTime() + 10 * 60000,
            ).toISOString()
          : undefined,
    },
    {
      title: "قيد التوصيل",
      completed: ["delivering", "completed"].includes(order.status),
      time: ["delivering", "completed"].includes(order.status)
        ? new Date(
            new Date(order.createdAt).getTime() + 30 * 60000,
          ).toISOString()
        : undefined,
    },
    {
      title: "تم التسليم",
      completed: order.status === "completed",
      time:
        order.status === "completed"
          ? new Date(
              new Date(order.createdAt).getTime() + 45 * 60000,
            ).toISOString()
          : undefined,
    },
  ];

  // Determine current step
  let currentStep = 0;
  if (order.status === "preparing") currentStep = 1;
  else if (order.status === "delivering") currentStep = 2;
  else if (order.status === "completed") currentStep = 3;

  res.json({
    status: order.status,
    currentStep,
    steps,
  });
});

// Rate an order
router.post("/:id/rate", authenticateToken, (req, res) => {
  const { rating, comment } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const orderIndex = db.orders.findIndex(
    (o) => o.id === req.params.id && o.userId === req.user.id,
  );

  if (orderIndex === -1)
    return res.status(404).json({ message: "Order not found" });

  const order = db.orders[orderIndex];

  if (order.status !== "completed") {
    return res
      .status(400)
      .json({ message: "Only completed orders can be rated" });
  }

  // Update order with rating
  order.rating = rating;
  order.review = comment || "";
  db.orders[orderIndex] = order;

  res.json({ success: true });
});

// Admin routes

// Get all orders (admin only)
router.get("/admin", authenticateAdmin, (req, res) => {
  const { status } = req.query;

  let orders = [...db.orders];

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  res.json(orders);
});

// Get a specific order by ID (admin only)
router.get("/admin/:id", authenticateAdmin, (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
});

// Update order status (admin only)
router.put("/admin/:id/status", authenticateAdmin, (req, res) => {
  const { status } = req.body;

  if (
    !["pending", "preparing", "delivering", "completed", "cancelled"].includes(
      status,
    )
  ) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const orderIndex = db.orders.findIndex((o) => o.id === req.params.id);

  if (orderIndex === -1)
    return res.status(404).json({ message: "Order not found" });

  // Update order status
  db.orders[orderIndex].status = status;

  res.json(db.orders[orderIndex]);
});

module.exports = router;
