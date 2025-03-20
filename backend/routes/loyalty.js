const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Import database and middleware
const { db } = require("../db");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");

// Get all loyalty cards for the authenticated user
router.get("/cards", authenticateToken, (req, res) => {
  const userCards = db.loyaltyCards.filter(
    (card) => card.ownerId === req.user.id,
  );
  res.json(userCards);
});

// Get reward cards for the authenticated user
router.get("/cards/reward", authenticateToken, (req, res) => {
  const rewardCards = db.loyaltyCards.filter(
    (card) => card.ownerId === req.user.id && card.type === "reward",
  );
  res.json(rewardCards);
});

// Get gift cards for the authenticated user
router.get("/cards/gift", authenticateToken, (req, res) => {
  const giftCards = db.loyaltyCards.filter(
    (card) => card.ownerId === req.user.id && card.type === "gift",
  );
  res.json(giftCards);
});

// Get coins cards for the authenticated user
router.get("/cards/coins", authenticateToken, (req, res) => {
  const coinsCards = db.loyaltyCards.filter(
    (card) => card.ownerId === req.user.id && card.type === "coins",
  );
  res.json(coinsCards);
});

// Get a specific card by ID
router.get("/cards/:id", authenticateToken, (req, res) => {
  const card = db.loyaltyCards.find(
    (card) => card.id === req.params.id && card.ownerId === req.user.id,
  );

  if (!card) return res.status(404).json({ message: "Card not found" });

  res.json(card);
});

// Activate a card
router.post("/cards/activate", authenticateToken, (req, res) => {
  const { code } = req.body;

  // Find the card by code
  const cardIndex = db.loyaltyCards.findIndex(
    (card) => card.code === code && !card.ownerId && card.isActive,
  );

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Invalid or already used card code",
    });
  }

  // Assign the card to the user
  db.loyaltyCards[cardIndex].ownerId = req.user.id;
  db.loyaltyCards[cardIndex].activatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Card activated successfully",
    card: db.loyaltyCards[cardIndex],
  });
});

// Add a stamp to a reward card
router.post("/stamps/activate", authenticateToken, (req, res) => {
  const { cardId, code } = req.body;

  // Find the reward card
  const cardIndex = db.loyaltyCards.findIndex(
    (card) =>
      card.id === cardId &&
      card.ownerId === req.user.id &&
      card.type === "reward",
  );

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Reward card not found",
    });
  }

  const card = db.loyaltyCards[cardIndex];

  // Find the stamp by code
  const stampIndex = card.stamps.findIndex(
    (stamp) => stamp.code === code && !stamp.isActive,
  );

  if (stampIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Invalid or already used stamp code",
    });
  }

  // Activate the stamp
  card.stamps[stampIndex].isActive = true;
  card.stamps[stampIndex].activatedBy = req.user.id;
  card.stamps[stampIndex].activatedAt = new Date().toISOString();

  // Update the current count in the stages
  const activeStampsCount = card.stamps.filter(
    (stamp) => stamp.isActive,
  ).length;

  card.stages.forEach((stage, index) => {
    if (index === 0) {
      stage.current = activeStampsCount;
    } else {
      const prevRequired = card.stages[index - 1].required;
      stage.current = Math.max(0, activeStampsCount - prevRequired);
    }
  });

  // Save the updated card
  db.loyaltyCards[cardIndex] = card;

  res.json({
    success: true,
    message: "Stamp activated successfully",
  });
});

// Discover a card
router.post("/cards/discover/:code", authenticateToken, (req, res) => {
  const code = req.params.code;

  // Find the card by code
  const card = db.loyaltyCards.find(
    (card) => card.code === code && card.isActive,
  );

  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Card not found",
    });
  }

  // If the card is already owned by someone else
  if (card.ownerId && card.ownerId !== req.user.id) {
    return res.status(400).json({
      success: false,
      message: "This card is already owned by another user",
    });
  }

  res.json({
    success: true,
    message: "Card found",
    card,
  });
});

// Add card to account
router.post("/cards/:id/add", authenticateToken, (req, res) => {
  const cardIndex = db.loyaltyCards.findIndex(
    (card) => card.id === req.params.id && !card.ownerId && card.isActive,
  );

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Card not found or already owned",
    });
  }

  // Assign the card to the user
  db.loyaltyCards[cardIndex].ownerId = req.user.id;
  db.loyaltyCards[cardIndex].activatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Card added to your account successfully",
  });
});

// Use a gift card
router.post("/gift-cards/:id/use", authenticateToken, (req, res) => {
  const cardIndex = db.loyaltyCards.findIndex(
    (card) =>
      card.id === req.params.id &&
      card.ownerId === req.user.id &&
      card.type === "gift" &&
      card.isActive &&
      !card.usedAt,
  );

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Gift card not found or already used",
    });
  }

  // Mark the card as used
  db.loyaltyCards[cardIndex].usedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Gift card used successfully",
  });
});

// Use a reward
router.post("/rewards/:id/use", authenticateToken, (req, res) => {
  const cardIndex = db.loyaltyCards.findIndex(
    (card) =>
      card.id === req.params.id &&
      card.ownerId === req.user.id &&
      card.type === "reward",
  );

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Reward card not found",
    });
  }

  const card = db.loyaltyCards[cardIndex];

  // Check if enough stamps have been collected for at least the first stage
  const activeStampsCount = card.stamps.filter(
    (stamp) => stamp.isActive,
  ).length;

  if (activeStampsCount < card.stages[0].required) {
    return res.status(400).json({
      success: false,
      message: "Not enough stamps collected for any reward",
    });
  }

  // Find the highest stage that can be redeemed
  let redeemableStageIndex = -1;

  for (let i = card.stages.length - 1; i >= 0; i--) {
    if (activeStampsCount >= card.stages[i].required) {
      redeemableStageIndex = i;
      break;
    }
  }

  if (redeemableStageIndex === -1) {
    return res.status(400).json({
      success: false,
      message: "No redeemable rewards available",
    });
  }

  // Create a reward object
  const reward = {
    id: uuidv4(),
    cardId: card.id,
    stageIndex: redeemableStageIndex,
    reward: card.stages[redeemableStageIndex].reward,
    rewardType: card.stages[redeemableStageIndex].rewardType,
    discountValue: card.stages[redeemableStageIndex].discountValue,
    redeemedAt: new Date().toISOString(),
  };

  // Reset the stamps for the redeemed stage
  const requiredStamps = card.stages[redeemableStageIndex].required;

  // Deactivate the required number of stamps
  let deactivatedCount = 0;

  for (
    let i = 0;
    i < card.stamps.length && deactivatedCount < requiredStamps;
    i++
  ) {
    if (card.stamps[i].isActive) {
      card.stamps[i].isActive = false;
      card.stamps[i].usedAt = new Date().toISOString();
      deactivatedCount++;
    }
  }

  // Update the current count in the stages
  const remainingActiveStamps = activeStampsCount - requiredStamps;

  card.stages.forEach((stage, index) => {
    if (index === 0) {
      stage.current = remainingActiveStamps;
    } else {
      const prevRequired = card.stages[index - 1].required;
      stage.current = Math.max(0, remainingActiveStamps - prevRequired);
    }
  });

  // Save the updated card
  db.loyaltyCards[cardIndex] = card;

  res.json({
    success: true,
    message: "Reward redeemed successfully",
    reward,
  });
});

// Get coins balance
router.get("/coins/balance", authenticateToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ balance: user.coinsBalance });
});

// Get coins history
router.get("/coins/history", authenticateToken, (req, res) => {
  // In a real app, you would have a transactions table
  // For now, we'll return a mock transaction history
  const mockTransactions = [
    {
      id: uuidv4(),
      amount: 50,
      type: "earned",
      description: "مكافأة على الطلب #ORD-1001",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      amount: 100,
      type: "spent",
      description: "خصم على الطلب #ORD-1002",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      amount: 200,
      type: "received",
      description: "تحويل من أحمد محمد",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uuidv4(),
      amount: 50,
      type: "sent",
      description: "تحويل إلى فاطمة علي",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  res.json(mockTransactions);
});

module.exports = router;
