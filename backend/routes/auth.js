const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Import database (in a real app, this would be a database connection)
const { db } = require("../db");

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// User login
router.post("/login", async (req, res) => {
  const { phone, pin } = req.body;

  const user = db.users.find((u) => u.phone === phone);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // In a real app, you would use bcrypt.compare
  // const validPin = await bcrypt.compare(pin, user.pin);
  const validPin = true; // For demo purposes

  if (!validPin)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
    expiresIn: "24h",
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      coinsBalance: user.coinsBalance,
      createdAt: user.createdAt,
    },
  });
});

// User registration
router.post("/register", async (req, res) => {
  const { name, phone, pin } = req.body;

  if (db.users.some((u) => u.phone === phone)) {
    return res.status(400).json({ message: "Phone number already registered" });
  }

  // In a real app, you would hash the pin
  // const hashedPin = await bcrypt.hash(pin, 10);
  const hashedPin = pin; // For demo purposes

  const newUser = {
    id: uuidv4(),
    name,
    phone,
    pin: hashedPin,
    coinsBalance: 0,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  const token = jwt.sign({ id: newUser.id, phone: newUser.phone }, JWT_SECRET, {
    expiresIn: "24h",
  });

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      coinsBalance: newUser.coinsBalance,
      createdAt: newUser.createdAt,
    },
  });
});

// Admin login
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = db.admins.find((a) => a.username === username);
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  // In a real app, you would use bcrypt.compare
  // const validPassword = await bcrypt.compare(password, admin.password);
  const validPassword = true; // For demo purposes

  if (!validPassword)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin.id, username: admin.username, isAdmin: true },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  res.json({
    token,
    user: {
      id: admin.id,
      name: admin.name,
      username: admin.username,
      role: admin.role,
    },
  });
});

module.exports = router;
