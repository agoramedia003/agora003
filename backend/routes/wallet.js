const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Import database and middleware
const { db } = require("../db");
const { authenticateToken } = require("../middleware/auth");

// Get wallet balance
router.get("/balance", authenticateToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ balance: user.coinsBalance });
});

// Get transaction history
router.get("/transactions", authenticateToken, (req, res) => {
  const { type } = req.query;

  // In a real app, you would have a transactions table
  // For now, we'll return a mock transaction history
  let mockTransactions = [
    {
      id: uuidv4(),
      type: "earned",
      amount: 50,
      balance: 500,
      description: "مكافأة على الطلب #ORD-1001",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      type: "spent",
      amount: 100,
      balance: 450,
      description: "خصم على الطلب #ORD-1002",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      type: "received",
      amount: 200,
      balance: 650,
      description: "تحويل من أحمد محمد",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      type: "sent",
      amount: 50,
      balance: 600,
      description: "تحويل إلى فاطمة علي",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  if (type) {
    mockTransactions = mockTransactions.filter((t) => t.type === type);
  }

  res.json(mockTransactions);
});

// Transfer coins to another user
router.post("/transfer", authenticateToken, (req, res) => {
  const { phone, amount, description } = req.body;

  if (!phone || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid recipient or amount" });
  }

  const sender = db.users.find((u) => u.id === req.user.id);
  if (!sender) return res.status(404).json({ message: "User not found" });

  const recipient = db.users.find((u) => u.phone === phone);
  if (!recipient)
    return res.status(404).json({ message: "Recipient not found" });

  if (sender.id === recipient.id) {
    return res.status(400).json({ message: "Cannot transfer to yourself" });
  }

  if (sender.coinsBalance < amount) {
    return res.status(400).json({ message: "Insufficient coins balance" });
  }

  // Update balances
  sender.coinsBalance -= amount;
  recipient.coinsBalance += amount;

  // In a real app, you would create transaction records
  const transaction = {
    id: uuidv4(),
    type: "transfer",
    amount,
    balance: sender.coinsBalance,
    description: description || `تحويل إلى ${recipient.name}`,
    createdAt: new Date().toISOString(),
    sender: {
      id: sender.id,
      name: sender.name,
      phone: sender.phone,
    },
    recipient: {
      id: recipient.id,
      name: recipient.name,
      phone: recipient.phone,
    },
  };

  res.json({
    success: true,
    transaction,
    newBalance: sender.coinsBalance,
  });
});

// Use coins for payment
router.post("/redeem", authenticateToken, (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.coinsBalance < amount) {
    return res.status(400).json({ message: "Insufficient coins balance" });
  }

  // Update balance
  user.coinsBalance -= amount;

  // In a real app, you would create a transaction record
  const transaction = {
    id: uuidv4(),
    type: "spent",
    amount,
    balance: user.coinsBalance,
    description: description || "استخدام كوينز",
    createdAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    transaction,
    newBalance: user.coinsBalance,
  });
});

module.exports = router;
