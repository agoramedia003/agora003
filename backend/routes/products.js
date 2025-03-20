const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Import database and middleware
const { db } = require("../db");
const { authenticateAdmin } = require("../middleware/auth");

// Get all products
router.get("/", (req, res) => {
  const { categoryId, featured, search } = req.query;

  let products = [...db.products];

  if (categoryId) {
    products = products.filter((p) => p.categoryId === categoryId);
  }

  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower),
    );
  }

  res.json(products);
});

// Get product by ID
router.get("/:id", (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// Get featured products
router.get("/featured", (req, res) => {
  const featuredProducts = db.products.filter((p) => p.featured);
  res.json(featuredProducts);
});

// Search products
router.get("/search", (req, res) => {
  const { query } = req.query;

  if (!query) return res.json([]);

  const searchLower = query.toLowerCase();
  const matchingProducts = db.products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower),
  );

  res.json(matchingProducts);
});

// Get all categories
router.get("/categories", (req, res) => {
  res.json(db.categories);
});

// Admin routes

// Create product (admin only)
router.post("/", authenticateAdmin, (req, res) => {
  const { name, description, price, image, categoryId, options } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price: parseFloat(price),
    image,
    categoryId,
    options: options || [],
    isAvailable: true,
    isPopular: false,
    isNew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.push(newProduct);

  res.status(201).json(newProduct);
});

// Update product (admin only)
router.put("/:id", authenticateAdmin, (req, res) => {
  const {
    name,
    description,
    price,
    image,
    categoryId,
    options,
    isAvailable,
    isPopular,
    isNew,
  } = req.body;

  const productIndex = db.products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1)
    return res.status(404).json({ message: "Product not found" });

  const updatedProduct = {
    ...db.products[productIndex],
    name: name || db.products[productIndex].name,
    description: description || db.products[productIndex].description,
    price: price ? parseFloat(price) : db.products[productIndex].price,
    image: image || db.products[productIndex].image,
    categoryId: categoryId || db.products[productIndex].categoryId,
    options: options || db.products[productIndex].options,
    isAvailable:
      isAvailable !== undefined
        ? isAvailable
        : db.products[productIndex].isAvailable,
    isPopular:
      isPopular !== undefined ? isPopular : db.products[productIndex].isPopular,
    isNew: isNew !== undefined ? isNew : db.products[productIndex].isNew,
    updatedAt: new Date().toISOString(),
  };

  db.products[productIndex] = updatedProduct;

  res.json(updatedProduct);
});

// Delete product (admin only)
router.delete("/:id", authenticateAdmin, (req, res) => {
  const productIndex = db.products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1)
    return res.status(404).json({ message: "Product not found" });

  db.products.splice(productIndex, 1);

  res.json({ success: true });
});

// Create category (admin only)
router.post("/categories", authenticateAdmin, (req, res) => {
  const { name, description, image } = req.body;

  const newCategory = {
    id: uuidv4(),
    name,
    description: description || "",
    image: image || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.categories.push(newCategory);

  res.status(201).json(newCategory);
});

// Update category (admin only)
router.put("/categories/:id", authenticateAdmin, (req, res) => {
  const { name, description, image } = req.body;

  const categoryIndex = db.categories.findIndex((c) => c.id === req.params.id);

  if (categoryIndex === -1)
    return res.status(404).json({ message: "Category not found" });

  const updatedCategory = {
    ...db.categories[categoryIndex],
    name: name || db.categories[categoryIndex].name,
    description:
      description !== undefined
        ? description
        : db.categories[categoryIndex].description,
    image: image || db.categories[categoryIndex].image,
    updatedAt: new Date().toISOString(),
  };

  db.categories[categoryIndex] = updatedCategory;

  res.json(updatedCategory);
});

// Delete category (admin only)
router.delete("/categories/:id", authenticateAdmin, (req, res) => {
  const categoryIndex = db.categories.findIndex((c) => c.id === req.params.id);

  if (categoryIndex === -1)
    return res.status(404).json({ message: "Category not found" });

  // Check if any products use this category
  const productsUsingCategory = db.products.some(
    (p) => p.categoryId === req.params.id,
  );

  if (productsUsingCategory) {
    return res
      .status(400)
      .json({ message: "Cannot delete category that has products" });
  }

  db.categories.splice(categoryIndex, 1);

  res.json({ success: true });
});

module.exports = router;
