const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware for regular users
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};

// Authentication middleware for admin users
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err || !admin.isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    req.admin = admin;
    next();
  });
};

module.exports = { authenticateToken, authenticateAdmin };
