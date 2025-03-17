# توثيق واجهات برمجة التطبيقات (API) لتطبيق وجباتي

## نظرة عامة

هذا المستند يوثق جميع واجهات برمجة التطبيقات (APIs) المطلوبة لتطبيق وجباتي. يتم تنظيم واجهات البرمجة حسب الموارد وتتضمن تفاصيل حول طرق الطلب، المسارات، المعلمات، وأمثلة للاستجابات.

## المصادقة

جميع نقاط النهاية المحمية تتطلب رمز JWT في رأس الطلب:

```
Authorization: Bearer <token>
```

### 1. واجهات برمجة المصادقة وإدارة المستخدمين

#### 1.1 تسجيل الدخول

```
POST /api/auth/login
```

**الطلب:**
```json
{
  "phone": "5XXXXXXXX",
  "pin": "1234"
}
```

**الاستجابة:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "محمد أحمد",
    "phone": "+966 50 123 4567",
    "email": "mohammed@example.com",
    "coinsBalance": 1250,
    "createdAt": "2023-01-15T12:00:00Z"
  }
}
```

#### 1.2 تسجيل مستخدم جديد

```
POST /api/auth/register
```

**الطلب:**
```json
{
  "name": "محمد أحمد",
  "phone": "5XXXXXXXX",
  "email": "mohammed@example.com",
  "pin": "1234"
}
```

**الاستجابة:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "محمد أحمد",
    "phone": "+966 50 123 4567",
    "email": "mohammed@example.com",
    "coinsBalance": 0,
    "createdAt": "2023-06-15T12:00:00Z"
  }
}
```

#### 1.3 الحصول على معلومات الملف الشخصي

```
GET /api/users/profile
```

**الاستجابة:**
```json
{
  "id": "user123",
  "name": "محمد أحمد",
  "phone": "+966 50 123 4567",
  "email": "mohammed@example.com",
  "coinsBalance": 1250,
  "createdAt": "2023-01-15T12:00:00Z",
  "addresses": [
    {
      "id": "addr1",
      "street": "شارع الملك فهد",
      "city": "الرياض",
      "postalCode": "12345",
      "additionalInfo": "بجانب مسجد الملك فهد",
      "isDefault": true
    }
  ]
}
```

#### 1.4 تحديث معلومات الملف الشخصي

```
PUT /api/users/profile
```

**الطلب:**
```json
{
  "name": "محمد أحمد",
  "email": "mohammed.new@example.com"
}
```

**الاستجابة:**
```json
{
  "id": "user123",
  "name": "محمد أحمد",
  "phone": "+966 50 123 4567",
  "email": "mohammed.new@example.com",
  "coinsBalance": 1250,
  "createdAt": "2023-01-15T12:00:00Z"
}
```

#### 1.5 تغيير كلمة المرور

```
PUT /api/users/password
```

**الطلب:**
```json
{
  "currentPin": "1234",
  "newPin": "5678"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

#### 1.6 الحصول على عناوين المستخدم

```
GET /api/users/addresses
```

**الاستجابة:**
```json
[
  {
    "id": "addr1",
    "street": "شارع الملك فهد",
    "city": "الرياض",
    "postalCode": "12345",
    "additionalInfo": "بجانب مسجد الملك فهد",
    "isDefault": true
  },
  {
    "id": "addr2",
    "street": "شارع العليا",
    "city": "الرياض",
    "postalCode": "54321",
    "additionalInfo": "مبنى الشركة",
    "isDefault": false
  }
]
```

#### 1.7 إضافة عنوان جديد

```
POST /api/users/addresses
```

**الطلب:**
```json
{
  "street": "شارع العليا",
  "city": "الرياض",
  "postalCode": "54321",
  "additionalInfo": "مبنى الشركة",
  "isDefault": false
}
```

**الاستجابة:**
```json
{
  "id": "addr2",
  "street": "شارع العليا",
  "city": "الرياض",
  "postalCode": "54321",
  "additionalInfo": "مبنى الشركة",
  "isDefault": false
}
```

#### 1.8 تحديث عنوان

```
PUT /api/users/addresses/:id
```

**الطلب:**
```json
{
  "street": "شارع العليا",
  "city": "الرياض",
  "postalCode": "54321",
  "additionalInfo": "الطابق الثالث، مبنى الشركة",
  "isDefault": true
}
```

**الاستجابة:**
```json
{
  "id": "addr2",
  "street": "شارع العليا",
  "city": "الرياض",
  "postalCode": "54321",
  "additionalInfo": "الطابق الثالث، مبنى الشركة",
  "isDefault": true
}
```

#### 1.9 حذف عنوان

```
DELETE /api/users/addresses/:id
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم حذف العنوان بنجاح"
}
```

### 2. واجهات برمجة المنتجات والمتجر

#### 2.1 الحصول على قائمة المنتجات

```
GET /api/products
```

**المعلمات:**
- `category` (اختياري): تصفية حسب الفئة
- `featured` (اختياري): تصفية المنتجات المميزة
- `search` (اختياري): البحث في اسم المنتج أو الوصف

**الاستجابة:**
```json
[
  {
    "id": "prod1",
    "name": "برجر دجاج مقرمش",
    "shortDescription": "برجر دجاج مقرمش مع صلصة خاصة",
    "description": "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
    "price": 45,
    "discountPrice": 35,
    "coinsPrice": 350,
    "image": "https://example.com/images/chicken-burger.jpg",
    "category": {
      "id": "cat1",
      "name": "برجر",
      "icon": "burger-icon",
      "image": "https://example.com/images/burger-category.jpg"
    },
    "featured": true,
    "components": [
      {
        "id": "comp1",
        "name": "صدر دجاج",
        "quantity": 1
      },
      {
        "id": "comp2",
        "name": "خبز برجر",
        "quantity": 1
      }
    ]
  },
  {
    "id": "prod2",
    "name": "بيتزا خضار",
    "shortDescription": "بيتزا طازجة مع تشكيلة من الخضروات",
    "description": "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
    "price": 60,
    "discountPrice": 45,
    "coinsPrice": 450,
    "image": "https://example.com/images/veggie-pizza.jpg",
    "category": {
      "id": "cat2",
      "name": "بيتزا",
      "icon": "pizza-icon",
      "image": "https://example.com/images/pizza-category.jpg"
    },
    "featured": true,
    "components": [
      {
        "id": "comp3",
        "name": "عجينة بيتزا",
        "quantity": 1
      },
      {
        "id": "comp4",
        "name": "جبنة موزاريلا",
        "quantity": 1
      }
    ]
  }
]
```

#### 2.2 الحصول على تفاصيل منتج محدد

```
GET /api/products/:id
```

**الاستجابة:**
```json
{
  "id": "prod1",
  "name": "برجر دجاج مقرمش",
  "shortDescription": "برجر دجاج مقرمش مع صلصة خاصة",
  "description": "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
  "price": 45,
  "discountPrice": 35,
  "coinsPrice": 350,
  "image": "https://example.com/images/chicken-burger.jpg",
  "category": {
    "id": "cat1",
    "name": "برجر",
    "icon": "burger-icon",
    "image": "https://example.com/images/burger-category.jpg"
  },
  "featured": true,
  "components": [
    {
      "id": "comp1",
      "name": "صدر دجاج",
      "quantity": 1
    },
    {
      "id": "comp2",
      "name": "خبز برجر",
      "quantity": 1
    }
  ]
}
```

#### 2.3 الحصول على فئات المنتجات

```
GET /api/products/categories
```

**الاستجابة:**
```json
[
  {
    "id": "cat1",
    "name": "برجر",
    "icon": "burger-icon",
    "image": "https://example.com/images/burger-category.jpg"
  },
  {
    "id": "cat2",
    "name": "بيتزا",
    "icon": "pizza-icon",
    "image": "https://example.com/images/pizza-category.jpg"
  },
  {
    "id": "cat3",
    "name": "ساندويتش",
    "icon": "sandwich-icon",
    "image": "https://example.com/images/sandwich-category.jpg"
  },
  {
    "id": "cat4",
    "name": "مشروبات",
    "icon": "drinks-icon",
    "image": "https://example.com/images/drinks-category.jpg"
  },
  {
    "id": "cat5",
    "name": "حلويات",
    "icon": "desserts-icon",
    "image": "https://example.com/images/desserts-category.jpg"
  }
]
```

#### 2.4 الحصول على قائمة الإضافات المتاحة

```
GET /api/products/extras
```

**الاستجابة:**
```json
[
  {
    "id": "extra1",
    "name": "جبنة إضافية",
    "price": 5
  },
  {
    "id": "extra2",
    "name": "صلصة حارة",
    "price": 3
  },
  {
    "id": "extra3",
    "name": "بصل مقرمش",
    "price": 4
  },
  {
    "id": "extra4",
    "name": "خبز إضافي",
    "price": 2
  }
]
```

### 3. واجهات برمجة سلة التسوق والطلبات

#### 3.1 الحصول على محتويات سلة التسوق

```
GET /api/cart
```

**الاستجابة:**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item1",
      "product": {
        "id": "prod1",
        "name": "برجر دجاج مقرمش",
        "shortDescription": "برجر دجاج مقرمش مع صلصة خاصة",
        "price": 45,
        "discountPrice": 35,
        "image": "https://example.com/images/chicken-burger.jpg"
      },
      "quantity": 2,
      "extras": [
        {
          "id": "extra1",
          "name": "جبنة إضافية",
          "price": 5
        },
        {
          "id": "extra2",
          "name": "صلصة حارة",
          "price": 3
        }
      ],
      "totalPrice": 86
    },
    {
      "id": "item2",
      "product": {
        "id": "prod2",
        "name": "بيتزا خضار",
        "shortDescription": "بيتزا طازجة مع تشكيلة من الخضروات",
        "price": 60,
        "discountPrice": 45,
        "image": "https://example.com/images/veggie-pizza.jpg"
      },
      "quantity": 1,
      "extras": [],
      "totalPrice": 45
    }
  ],
  "subtotal": 115,
  "extrasTotal": 16,
  "discount": 25,
  "total": 131
}
```

#### 3.2 إضافة منتج إلى السلة

```
POST /api/cart
```

**الطلب:**
```json
{
  "productId": "prod1",
  "quantity": 2,
  "extras": ["extra1", "extra2"]
}
```

**الاستجابة:**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item1",
      "product": {
        "id": "prod1",
        "name": "برجر دجاج مقرمش",
        "shortDescription": "برجر دجاج مقرمش مع صلصة خاصة",
        "price": 45,
        "discountPrice": 35,
        "image": "https://example.com/images/chicken-burger.jpg"
      },
      "quantity": 2,
      "extras": [
        {
          "id": "extra1",
          "name": "جبنة إضافية",
          "price": 5
        },
        {
          "id": "extra2",
          "name": "صلصة حارة",
          "price": 3
        }
      ],
      "totalPrice": 86
    }
  ],
  "subtotal": 70,
  "extrasTotal": 16,
  "discount": 20,
  "total": 86
}
```

#### 3.3 تحديث كمية منتج في السلة

```
PUT /api/cart/:itemId
```

**الطلب:**
```json
{
  "quantity": 3
}
```

**الاستجابة:**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item1",
      "product": {
        "id": "prod1",
        "name": "برجر دجاج مقرمش",
        "shortDescription": "برجر دجاج مقرمش مع صلصة خاصة",
        "price": 45,
        "discountPrice": 35,
        "image": "https://example.com/images/chicken-burger.jpg"
      },
      "quantity": 3,
      "extras": [
        {
          "id": "extra1",
          "name": "جبنة إضافية",
          "price": 5
        },
        {
          "id": "extra2",
          "name": "صلصة حارة",
          "price": 3
        }
      ],
      "totalPrice": 129
    }
  ],
  "subtotal": 105,
  "extrasTotal": 24,
  "discount": 30,
  "total": 129
}
```

#### 3.4 إزالة منتج من السلة

```
DELETE /api/cart/:itemId
```

**الاستجابة:**
```json
{
  "id": "cart123",
  "items": [],
  "subtotal": 0,
  "extrasTotal": 0,
  "discount": 0,
  "total": 0
}
```

#### 3.5 إنشاء طلب جديد

```
POST /api/orders
```

**الطلب:**
```json
{
  "deliveryInfo": {
    "name": "محمد أحمد",
    "phone": "+966 50 123 4567",
    "address": "شارع الملك فهد، الرياض",
    "deliveryTime": "asap"
  },
  "paymentMethod": "cash",
  "loyaltyCardId": "card123",
  "loyaltyAction": "redeem"
}
```

**الاستجابة:**
```json
{
  "id": "order123",
  "date": "2023-06-15T14:30:00Z",
  "status": "pending",
  "items": [
    {
      "id": "item1",
      "productName": "برجر دجاج مقرمش",
      "productDescription": "برجر دجاج مقرمش مع صلصة خاصة",
      "quantity": 2,
      "price": 35,
      "extras": [
        {
          "name": "جبنة إضافية",
          "price": 5
        },
        {
          "name": "صلصة حارة",
          "price": 3
        }
      ],
      "totalPrice": 86
    },
    {
      "id": "item2",
      "productName": "بيتزا خضار",
      "productDescription": "بيتزا طازجة مع تشكيلة من الخضروات",
      "quantity": 1,
      "price": 45,
      "extras": [],
      "totalPrice": 45
    }
  ],
  "subtotal": 115,
  "extrasTotal": 16,
  "discount": 25,
  "total": 131,
  "deliveryInfo": {
    "name": "محمد أحمد",
    "phone": "+966 50 123 4567",
    "address": "شارع الملك فهد، الرياض",
    "deliveryTime": "asap"
  },
  "paymentMethod": "cash",
  "appliedLoyaltyCard": {
    "id": "card123",
    "title": "بطاقة مكافآت برجر",
    "type": "reward",
    "code": "REWARD123",
    "expiryDate": "2023-12-31T00:00:00Z",
    "backgroundColor": "#10b981",
    "textColor": "#ffffff",
    "stamps": [
      {
        "required": 5,
        "current": 3,
        "reward": "برجر مجاني"
      }
    ]
  }
}
```

#### 3.6 الحصول على قائمة الطلبات

```
GET /api/orders
```

**المعلمات:**
- `status` (اختياري): تصفية حسب الحالة
- `limit` (اختياري): عدد الطلبات المراد استرجاعها
- `offset` (اختياري): عدد الطلبات المراد تخطيها

**الاستجابة:**
```json
[
  {
    "id": "order123",
    "date": "2023-06-15T14:30:00Z",
    "status": "delivered",
    "items": [
      {
        "id": "item1",
        "productName": "برجر دجاج مقرمش",
        "quantity": 2,
        "price": 35,
        "totalPrice": 86
      },
      {
        "id": "item2",
        "productName": "بيتزا خضار",
        "quantity": 1,
        "price": 45,
        "totalPrice": 45
      }
    ],
    "total": 131
  },
  {
    "id": "order124",
    "date": "2023-06-20T12:15:00Z",
    "status": "preparing",
    "items": [
      {
        "id": "item3",
        "productName": "بيتزا خضار",
        "quantity": 1,
        "price": 45,
        "totalPrice": 45
      },
      {
        "id": "item4",
        "productName": "سلطة",
        "quantity": 1,
        "price": 20,
        "totalPrice": 20
      }
    ],
    "total": 65
  }
]
```

#### 3.7 الحصول على تفاصيل طلب محدد

```
GET /api/orders/:id
```

**الاستجابة:**
```json
{
  "id": "order123",
  "date": "2023-06-15T14:30:00Z",
  "status": "delivered",
  "items": [
    {
      "id": "item1",
      "productName": "برجر دجاج مقرمش",
      "productDescription": "برجر دجاج مقرمش مع صلصة خاصة",
      "quantity": 2,
      "price": 35,
      "extras": [
        {
          "name": "جبنة إضافية",
          "price": 5
        },
        {
          "name": "صلصة حارة",
          "price": 3
        }
      ],
      "totalPrice": 86
    },
    {
      "id": "item2",
      "productName": "بيتزا خضار",
      "productDescription": "بيتزا طازجة مع تشكيلة من الخضروات",
      "quantity": 1,
      "price": 45,
      "extras": [],
      "totalPrice": 45
    }
  ],
  "subtotal": 115,
  "extrasTotal": 16,
  "discount": 25,
  "total": 131,
  "deliveryInfo": {
    "name": "محمد أحمد",
    "phone": "+966 50 123 4567",
    "address": "شارع الملك فهد، الرياض",
    "deliveryTime": "asap"
  },
  "paymentMethod": "cash",
  "appliedLoyaltyCard": {
    "id": "card123",
    "title": "بطاقة مكافآت برجر",
    "type": "reward",
    "code": "REWARD123"
  }
}
```

#### 3.8 تتبع حالة الطلب

```
GET /api/orders/:id/track
```

**الاستجابة:**
```json
{
  "id": "order123",
  "status": "preparing",
  "statusInfo": {
    "label": "جاري التحضير",
    "step": 2,
    "timestamp": "2023-06-15T14:45:00Z",
    "estimatedDeliveryTime": "2023-06-15T15:15:00Z"
  },
  "statusHistory": [
    {
      "status": "pending",
      "label": "قيد الانتظار",
      "timestamp": "2023-06-15T14:30:00Z"
    },
    {
      "status": "accepted",
      "label": "تم قبول الطلب",
      "timestamp": "2023-06-15T14:35:00Z"
    },
    {
      "status": "preparing",
      "label": "جاري التحضير",
      "timestamp": "2023-06-15T14:45:00Z"
    }
  ]
}
```

### 4. واجهات برمجة المحفظة والكوينز

#### 4.1 الحصول على رصيد الكوينز

```
GET /api/wallet/balance
```

**الاستجابة:**
```json
{
  "balance": 1250,
  "pendingTransactions": 0
}
```

#### 4.2 تحويل كوينز إلى مستخدم آخر

```
POST /api/wallet/transfer
```

**الطلب:**
```json
{
  "phone": "+966 50 987 6543",
  "amount": 100,
  "description": "تحويل إلى محمد"
}
```

**الاستجابة:**
```json
{
  "id": "trans123",
  "type": "send",
  "amount": 100,
  "date": "2023-06-15T16:30:00Z",
  "description": "تحويل إلى محمد",
  "recipientPhone": "+966 50 987 6543",
  "status": "completed",
  "newBalance": 1150
}
```

#### 4.3 الحصول على سجل المعاملات

```
GET /api/wallet/transactions
```

**المعلمات:**
- `type` (اختياري): تصفية حسب نوع المعاملة (add, spend, receive, send)
- `limit` (اختياري): عدد المعاملات المراد استرجاعها
- `offset` (اختياري): عدد المعاملات المراد تخطيها

**الاستجابة:**
```json
[
  {
    "id": "trans123",
    "type": "send",
    "amount": 100,
    "date": "2023-06-15T16:30:00Z",
    "description": "تحويل إلى محمد",
    "recipientPhone": "+966 50 987 6543"
  },
  {
    "id": "trans122",
    "type": "receive",
    "amount": 100,
    "date": "2023-06-10T14:20:00Z",
    "description": "استلام تحويل من أحمد",
    "senderPhone": "+966 50 111 2222"
  },
  {
    "id": "trans121",
    "type": "add",
    "amount": 500,
    "date": "2023-06-05T10:15:00Z",
    "description": "إضافة رصيد من بطاقة هدية"
  },
  {
    "id": "trans120",
    "type": "spend",
    "amount": 250,
    "date": "2023-06-01T13:45:00Z",
    "description": "شراء وجبة برجر دجاج"
  }
]
```

#### 4.4 استخدام الكوينز للدفع

```
POST /api/wallet/redeem
```

**الطلب:**
```json
{
  "amount": 131,
  "description": "دفع مقابل الطلب #order123"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "transaction": {
    "id": "trans124",
    "type": "spend",
    "amount": 131,
    "date": "2023-06-15T17:00:00Z",
    "description": "دفع مقابل الطلب #order123"
  },
  "newBalance": 1119
}
```

### 5. واجهات برمجة برنامج الولاء

#### 5.1 الحصول على بطاقات المكافآت

```
GET /api/loyalty/reward-cards
```

**الاستجابة:**
```json
[
  {
    "id": "card123",
    "title": "بطاقة مكافآت برجر",
    "type": "reward",
    "code": "REWARD123",
    "expiryDate": "2023-12-31T00:00:00Z",
    "backgroundColor": "#10b981",
    "textColor": "#ffffff",
    "stamps": [
      {
        "required": 5,
        "current": 3,
        "reward": "برجر مجاني"
      },
      {
        "required": 10,
        "current": 0,
        "reward": "وجبة كاملة مجانية"
      }
    ]
  },
  {
    "id": "card124",
    "title": "بطاقة مكافآت بطاطس",
    "type": "reward",
    "code": "REWARD456",
    "expiryDate": "2023-12-31T00:00:00Z",
    "backgroundColor": "#f59e0b",
    "textColor": "#ffffff",
    "stamps": [
      {
        "required": 3,
        "current": 2,
        "reward": "بطاطس مجانية"
      },
      {
        "required": 6,
        "current": 0,
        "reward": "بطاطس كبيرة مجانية"
      }
    ]
  }
]
```

#### 5.2 الحصول على بطاقات الهدايا

```
GET /api/loyalty/gift-cards
```

**الاستجابة:**
```json
[
  {
    "id": "card125",
    "title": "بطاقة هدية وجبة غداء",
    "type": "gift",
    "code": "GIFT123",
    "expiryDate": "2023-12-31T00:00:00Z",
    "backgroundColor": "#4f46e5",
    "textColor": "#ffffff"
  },
  {
    "id": "card126",
    "title": "بطاقة هدية قهوة",
    "type": "gift",
    "code": "GIFT456",
    "expiryDate": "2023-12-31T00:00:00Z",
    "backgroundColor": "#10b981",
    "textColor": "#ffffff"
  }
]
```

#### 5.3 تفعيل بطاقة جديدة

```
POST /api/loyalty/activate
```

**الطلب:**
```json
{
  "code": "GIFT789"
}
```

**الاستجابة:**
```json
{
  "id": "card127",
  "title": "بطاقة كوينز",
  "type": "gift",
  "code": "GIFT789",
  "expiryDate": "2023-12-31T00:00:00Z",
  "backgroundColor": "#f59e0b",
  "textColor": "#ffffff",
  "coinsAmount": 500
}
```

#### 5.4 إضافة طابع إلى بطاقة مكافآت

```
POST /api/loyalty/stamps
```

**الطلب:**
```json
{
  "cardId": "card123",
  "code": "STAMP123"
}
```

**الاستجابة:**
```json
{
  "id": "card123",
  "title": "بطاقة مكافآت برجر",
  "type": "reward",
  "code": "REWARD123",
  "expiryDate": "2023-12-31T00:00:00Z",
  "backgroundColor": "#10b981",
  "textColor": "#ffffff",
  "stamps": [
    {
      "required": 5,
      "current": 4,
      "reward": "برجر مجاني"
    },
    {
      "required": 10,
      "current": 0,
      "reward": "وجبة كاملة مجانية"
    }
  ]
}
```

#### 5.5 استبدال مكافأة

```
POST /api/loyalty/redeem
```

**الطلب:**
```json
{
  "cardId": "card123",
  "stageIndex": 0
}
```

**الاستجابة:**
```json
{
  "success": true,
  "reward": {
    "name": "برجر مجاني",
    "code": "REWARD-REDEEM-123",
    "expiryDate": "2023-07-15T00:00:00Z"
  },
  "updatedCard": {
    "id": "card123",
    "title": "بطاقة مكافآت برجر",
    "type": "reward",
    "code": "REWARD123",
    "expiryDate": "2023-12-31T00:00:00Z",
    "backgroundColor": "#10b981",
    "textColor": "#ffffff",
    "stamps": [
      {
        "required": 5,
        "current": 0,
        "reward": "برجر مجاني"
      },
      {
        "required": 10,
        "current": 0,
        "reward": "وجبة كاملة مجانية"
      }
    ]
  }
}
```

### 6. واجهات برمجة العروض

#### 6.1 الحصول على قائمة العروض

```
GET /api/promotions
```

**المعلمات:**
- `category` (اختياري): تصفية حسب الفئة

**الاستجابة:**
```json
[
  {
    "id": "promo1",
    "title": "برجر دجاج مقرمش",
    "description": "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
    "originalPrice": 45,
    "discountPrice": 30,
    "discountPercentage": 33,
    "image": "https://example.com/images/chicken-burger.jpg",
    "category": "burgers",
    "startDate": "2023-06-01T00:00:00Z",
    "endDate": "2023-06-30T23:59:59Z"
  },
  {
    "id": "promo2",
    "title": "بيتزا خضار",
    "description": "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
    "originalPrice": 60,
    "discountPrice": 40,
    "discountPercentage": 33,
    "image": "https://example.com/images/veggie-pizza.jpg",
    "category": "pizza",
    "startDate": "2023-06-01T00:00:00Z",
    "endDate": "2023-06-30T23:59:59Z"
  }
]
```

#### 6.2 الحصول على تفاصيل عرض محدد

```
GET /api/promotions/:id
```

**الاستجابة:**
```json
{
  "id": "promo1",
  "title": "برجر دجاج مقرمش",
  "description": "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
  "originalPrice": 45,
  "discountPrice": 30,
  "discountPercentage": 33,
  "image": "https://example.com/images/chicken-burger.jpg",
  "category": "burgers",
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-06-30T23:59:59Z",
  "terms": "العرض ساري حتى نفاد الكمية. لا يمكن الجمع بين هذا العرض وأي عروض أخرى.",
  "productId": "prod1"
}
```

#### 6.3 الحصول على العروض المحدودة (Flash Deals)

```
GET /api/promotions/flash-deals
```

**الاستجابة:**
```json
[
  {
    "id": "flash1",
    "title": "وجبة برجر دجاج مع بطاطس",
    "description": "برجر دجاج مقرمش مع صلصة خاصة وبطاطس مقلية",
    "originalPrice": 45,
    "discountPrice": 35,
    "discountPercentage": 22,
    "image": "https://example.com/images/chicken-burger-meal.jpg",
    "category": "burgers",
    "startDate": "2023-06-15T10:00:00Z",
    "endDate": "2023-06-15T22:00:00Z",
    "timeRemaining": "02:45:30"
  },
  {
    "id": "flash2",
    "title": "بيتزا خضار متوسطة",
    "description": "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
    "originalPrice": 60,
    "discountPrice": 45,
    "discountPercentage": 25,
    "image": "https://example.com/images/veggie-pizza-medium.jpg",
    "category": "pizza",
    "startDate": "2023-06-15T10:00:00Z",
    "endDate": "2023-06-15T22:00:00Z",
    "timeRemaining": "01:30:00"
  }
]
```

#### 6.4 تطبيق عرض على طلب

```
POST /api/promotions/apply
```

**الطلب:**
```json
{
  "promotionId": "promo1"
}
```

**الاستجابة:**
```json
{
  "id": "cart123",
  "items": [
    {
      "id": "item1",
      "product": {
        "id": "prod1",
        "name": "برجر دجاج مقرمش",
        "shortDescription": "برجر دجاج مقرمش مع صلصة خاصة",
        "price": 45,
        "discountPrice": 30,
        "image": "https://example.com/images/chicken-burger.jpg"
      },
      "quantity": 1,
      "extras": [],
      "totalPrice": 30
    }
  ],
  "subtotal": 30,
  "extrasTotal": 0,
  "discount": 15,
  "total": 30,
  "appliedPromotion": {
    "id": "promo1",
    "title": "برجر دجاج مقرمش",
    "discountPercentage": 33
  }
}
```

### 7. واجهات برمجة الإشعارات

#### 7.1 الحصول على قائمة الإشعارات

```
GET /api/notifications
```

**المعلمات:**
- `read` (اختياري): تصفية حسب حالة القراءة (true/false)
- `limit` (اختياري): عدد الإشعارات المراد استرجاعها
- `offset` (اختياري): عدد الإشعارات المراد تخطيها

**الاستجابة:**
```json
[
  {
    "id": "notif1",
    "title": "تم قبول طلبك",
    "body": "تم قبول طلبك #order123 وجاري تحضيره الآن",
    "type": "order_status",
    "read": false,
    "createdAt": "2023-06-15T14:35:00Z",
    "data": {
      "orderId": "order123",
      "status": "accepted"
    }
  },
  {
    "id": "notif2",
    "title": "عرض جديد",
    "body": "استمتع بخصم 33% على برجر الدجاج المقرمش",
    "type": "promotion",
    "read": true,
    "createdAt": "2023-06-01T10:00:00Z",
    "data": {
      "promotionId": "promo1"
    }
  }
]
```

#### 7.2 تحديث حالة الإشعار

```
PUT /api/notifications/:id
```

**الطلب:**
```json
{
  "read": true
}
```

**الاستجابة:**
```json
{
  "id": "notif1",
  "title": "تم قبول طلبك",
  "body": "تم قبول طلبك #order123 وجاري تحضيره الآن",
  "type": "order_status",
  "read": true,
  "createdAt": "2023-06-15T14:35:00Z",
  "data": {
    "orderId": "order123",
    "status": "accepted"
  }
}
```

#### 7.3 تسجيل توكن الجهاز للإشعارات

```
POST /api/notifications/token
```

**الطلب:**
```json
{
  "token": "fcm-token-123",
  "platform": "android"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تسجيل توكن الإشعارات بنجاح"
}
```

## ملاحظات تنفيذية

1. **المصادقة**: يجب استخدام JWT (JSON Web Tokens) للمصادقة وإدارة الجلسات. يجب إرسال الرمز في رأس الطلب لجميع نقاط النهاية المحمية.

2. **التعامل مع الأخطاء**: يجب أن تستجيب جميع نقاط النهاية برمز حالة HTTP مناسب ورسالة خطأ واضحة في حالة حدوث خطأ.

3. **التوثيق**: يجب توثيق جميع نقاط النهاية باستخدام Swagger أو أي أداة توثيق API أخرى.

4. **الأمان**: يجب تنفيذ تدابير أمان مناسبة مثل التحقق من صحة المدخلات، والحماية من هجمات CSRF و XSS.

5. **الأداء**: يجب تنفيذ استراتيجيات التخزين المؤقت لتحسين الأداء وتقليل الحمل على الخادم.

6. **التوسع**: يجب تصميم واجهات البرمجة بحيث يمكن توسيعها لدعم المزيد من الميزات في المستقبل.
