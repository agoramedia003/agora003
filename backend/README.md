# Food Loyalty App Backend API

## Overview

This is a simple backend API for the Food Loyalty App. It provides endpoints for user authentication, product management, order processing, loyalty program, and admin dashboard.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
# or for development with auto-restart
npm run dev
```

The server will run on http://localhost:3000 by default.

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/admin/login` - Admin login

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get all categories

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get all orders for the authenticated user
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders/:id/cancel` - Cancel an order
- `GET /api/orders/:id/track` - Track order status
- `POST /api/orders/:id/rate` - Rate an order

### Loyalty

- `GET /api/loyalty/cards` - Get all loyalty cards for the authenticated user
- `GET /api/loyalty/cards/reward` - Get reward cards
- `GET /api/loyalty/cards/gift` - Get gift cards
- `GET /api/loyalty/cards/coins` - Get coins cards
- `GET /api/loyalty/cards/:id` - Get card by ID
- `POST /api/loyalty/cards/activate` - Activate a card
- `POST /api/loyalty/stamps/activate` - Add a stamp to a reward card
- `POST /api/loyalty/cards/discover/:code` - Discover a card
- `POST /api/loyalty/cards/:id/add` - Add card to account
- `POST /api/loyalty/gift-cards/:id/use` - Use a gift card
- `POST /api/loyalty/rewards/:id/use` - Use a reward
- `GET /api/loyalty/coins/balance` - Get coins balance
- `GET /api/loyalty/coins/history` - Get coins history

### Wallet

- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/transfer` - Transfer coins to another user
- `POST /api/wallet/redeem` - Use coins for payment

### Admin

- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `PUT /api/admin/users/:id/coins` - Update user coins

## Environment Variables

- `PORT` - Port number (default: 3000)
- `JWT_SECRET` - Secret key for JWT (default: 'your-secret-key')
