const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const loyaltyRoutes = require("./routes/loyalty");
const walletRoutes = require("./routes/wallet");
const adminRoutes = require("./routes/admin");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Food Loyalty App API" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
