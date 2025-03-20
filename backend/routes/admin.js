const express = require("express");
const router = express.Router();

// Import database and middleware
const { db } = require("../db");
const { authenticateAdmin } = require("../middleware/auth");

// Get dashboard statistics
router.get("/dashboard/stats", authenticateAdmin, (req, res) => {
  const totalOrders = db.orders.length;
  const totalRevenue = db.orders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = new Set(db.orders.map((o) => o.userId)).size;

  const ordersByStatus = [
    {
      status: "pending",
      count: db.orders.filter((o) => o.status === "pending").length,
    },
    {
      status: "preparing",
      count: db.orders.filter((o) => o.status === "preparing").length,
    },
    {
      status: "delivering",
      count: db.orders.filter((o) => o.status === "delivering").length,
    },
    {
      status: "completed",
      count: db.orders.filter((o) => o.status === "completed").length,
    },
    {
      status: "cancelled",
      count: db.orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  // Get recent orders (last 5)
  const recentOrders = db.orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Calculate popular products
  const productSales = {};
  db.orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.name]) {
        productSales[item.name] = { sales: 0, revenue: 0 };
      }
      productSales[item.name].sales += item.quantity;
      productSales[item.name].revenue += item.price * item.quantity;
    });
  });

  const popularProducts = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  res.json({
    totalOrders,
    totalRevenue,
    totalCustomers,
    ordersByStatus,
    recentOrders,
    popularProducts,
  });
});

// Get all users (admin only)
router.get("/users", authenticateAdmin, (req, res) => {
  // Return users without sensitive information
  const users = db.users.map((user) => ({
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    coinsBalance: user.coinsBalance,
    createdAt: user.createdAt,
  }));

  res.json(users);
});

// Get user by ID (admin only)
router.get("/users/:id", authenticateAdmin, (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Return user without sensitive information
  res.json({
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    coinsBalance: user.coinsBalance,
    createdAt: user.createdAt,
  });
});

// Update user coins (admin only)
router.put("/users/:id/coins", authenticateAdmin, (req, res) => {
  const { amount, reason } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  const userIndex = db.users.findIndex((u) => u.id === req.params.id);

  if (userIndex === -1)
    return res.status(404).json({ message: "User not found" });

  // Update user's coins balance
  db.users[userIndex].coinsBalance += parseInt(amount);

  // Ensure balance doesn't go below 0
  if (db.users[userIndex].coinsBalance < 0) {
    db.users[userIndex].coinsBalance = 0;
  }

  // In a real app, you would create a transaction record

  res.json({
    success: true,
    user: {
      id: db.users[userIndex].id,
      name: db.users[userIndex].name,
      coinsBalance: db.users[userIndex].coinsBalance,
    },
  });
});

module.exports = router;
