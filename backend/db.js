// In-memory database for development
// In a real application, this would be replaced with a real database

const db = {
  users: [
    {
      id: "user1",
      name: "أحمد محمد",
      phone: "0512345678",
      email: "ahmed@example.com",
      pin: "$2a$10$1234567890123456789012", // hashed '123456'
      coinsBalance: 500,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user2",
      name: "فاطمة علي",
      phone: "0523456789",
      email: "fatima@example.com",
      pin: "$2a$10$1234567890123456789012", // hashed '123456'
      coinsBalance: 300,
      createdAt: new Date().toISOString(),
    },
    {
      id: "user3",
      name: "محمد عبدالله",
      phone: "0534567890",
      email: "mohammed@example.com",
      pin: "$2a$10$1234567890123456789012", // hashed '123456'
      coinsBalance: 750,
      createdAt: new Date().toISOString(),
    },
  ],
  admins: [
    {
      id: "admin1",
      name: "مدير النظام",
      username: "admin",
      password: "$2a$10$1234567890123456789012", // hashed 'admin123'
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "admin2",
      name: "مدير المبيعات",
      username: "manager",
      password: "$2a$10$1234567890123456789012", // hashed 'manager123'
      role: "manager",
      createdAt: new Date().toISOString(),
    },
    {
      id: "admin3",
      name: "موظف خدمة العملاء",
      username: "staff",
      password: "$2a$10$1234567890123456789012", // hashed 'staff123'
      role: "staff",
      createdAt: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: "cat1",
      name: "برجر",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      description: "تشكيلة متنوعة من البرجر",
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat2",
      name: "بيتزا",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
      description: "بيتزا طازجة بعجينة إيطالية أصلية",
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat3",
      name: "مشروبات",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80",
      description: "مشروبات باردة وساخنة",
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat4",
      name: "حلويات",
      image:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80",
      description: "حلويات شرقية وغربية",
      createdAt: new Date().toISOString(),
    },
  ],
  products: [
    {
      id: "prod1",
      name: "برجر لحم",
      description: "برجر لحم بقري طازج مع جبنة وخضروات",
      price: 35,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      categoryId: "cat1",
      options: [
        {
          id: "opt1",
          name: "الحجم",
          type: "single",
          required: true,
          choices: [
            { id: "ch1", name: "صغير", price: 0 },
            { id: "ch2", name: "وسط", price: 5 },
            { id: "ch3", name: "كبير", price: 10 },
          ],
        },
        {
          id: "opt2",
          name: "إضافات",
          type: "multiple",
          required: false,
          choices: [
            { id: "ch4", name: "جبنة إضافية", price: 5 },
            { id: "ch5", name: "صلصة حارة", price: 3 },
          ],
        },
      ],
      isAvailable: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod2",
      name: "برجر دجاج",
      description: "برجر دجاج مقرمش مع صلصة خاصة",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80",
      categoryId: "cat1",
      options: [
        {
          id: "opt1",
          name: "الحجم",
          type: "single",
          required: true,
          choices: [
            { id: "ch1", name: "صغير", price: 0 },
            { id: "ch2", name: "وسط", price: 5 },
            { id: "ch3", name: "كبير", price: 10 },
          ],
        },
      ],
      isAvailable: true,
      isPopular: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod3",
      name: "بيتزا مارجريتا",
      description: "بيتزا مارجريتا بالجبنة والطماطم",
      price: 45,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
      categoryId: "cat2",
      options: [
        {
          id: "opt3",
          name: "الحجم",
          type: "single",
          required: true,
          choices: [
            { id: "ch6", name: "صغير", price: 0 },
            { id: "ch7", name: "وسط", price: 10 },
            { id: "ch8", name: "كبير", price: 20 },
          ],
        },
      ],
      isAvailable: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod4",
      name: "كولا",
      description: "مشروب غازي منعش",
      price: 8,
      image:
        "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80",
      categoryId: "cat3",
      options: [],
      isAvailable: true,
      isPopular: true,
      isNew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: "ord1",
      orderNumber: "ORD-1001",
      userId: "user1",
      status: "completed",
      items: [
        {
          id: "item1",
          name: "برجر لحم",
          quantity: 2,
          price: 35,
          options: [{ name: "الحجم", value: "وسط" }],
        },
        {
          id: "item2",
          name: "كولا",
          quantity: 1,
          price: 8,
          options: [],
        },
      ],
      total: 80,
      coinsEarned: 8,
      address: "شارع الملك فهد، الرياض",
      paymentMethod: "cash",
      notes: "الرجاء عدم وضع البصل",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "ord2",
      orderNumber: "ORD-1002",
      userId: "user2",
      status: "delivering",
      items: [
        {
          id: "item3",
          name: "برجر دجاج",
          quantity: 1,
          price: 30,
          options: [{ name: "الحجم", value: "صغير" }],
        },
        {
          id: "item4",
          name: "كولا",
          quantity: 2,
          price: 8,
          options: [],
        },
      ],
      total: 46,
      coinsEarned: 5,
      address: "شارع التحلية، جدة",
      paymentMethod: "card",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "ord3",
      orderNumber: "ORD-1003",
      userId: "user3",
      status: "preparing",
      items: [
        {
          id: "item5",
          name: "بيتزا مارجريتا",
          quantity: 1,
          price: 45,
          options: [{ name: "الحجم", value: "وسط" }],
        },
      ],
      total: 55,
      coinsEarned: 6,
      address: "شارع الأمير سلطان، الدمام",
      paymentMethod: "cash",
      notes: "توصيل سريع",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  loyaltyCards: [
    {
      id: "card1",
      title: "بطاقة البرجر",
      type: "reward",
      code: "1234567",
      description: "اجمع الطوابع واحصل على برجر مجاني",
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user1",
      activatedAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      stages: [
        {
          required: 5,
          current: 3,
          reward: "برجر مجاني",
          rewardType: "gift",
        },
      ],
      stamps: [
        {
          id: "s1",
          code: "123456",
          isActive: true,
          activatedBy: "user1",
          activatedAt: new Date(
            Date.now() - 25 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "s2",
          code: "234567",
          isActive: true,
          activatedBy: "user1",
          activatedAt: new Date(
            Date.now() - 20 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "s3",
          code: "345678",
          isActive: true,
          activatedBy: "user1",
          activatedAt: new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "s4",
          code: "456789",
          isActive: false,
        },
        {
          id: "s5",
          code: "567890",
          isActive: false,
        },
      ],
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "card2",
      title: "بطاقة هدية عيد الفطر",
      type: "gift",
      code: "12345",
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      backgroundColor: "#8b5cf6",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user1",
      activatedAt: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      giftType: "discount",
      discountValue: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1561715276-a2d087060f1d?w=500&q=80",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "card3",
      title: "بطاقة كوينز ترحيبية",
      type: "coins",
      code: "123456",
      backgroundColor: "#f59e0b",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user2",
      activatedAt: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      coinsAmount: 500,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  carts: {},
};

module.exports = { db };
