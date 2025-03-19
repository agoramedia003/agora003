# توثيق واجهات برمجة التطبيق (APIs)

## واجهة المستخدم

### المصادقة وإدارة المستخدمين

#### `POST /auth/login`
**الوصف**: تسجيل دخول المستخدم باستخدام رقم الهاتف والرمز السري.

**المعلمات**:
```json
{
  "phone": "0512345678",
  "pin": "123456"
}
```

**الاستجابة**:
```json
{
  "id": "user123",
  "name": "أحمد محمد",
  "phone": "0512345678",
  "email": "ahmed@example.com",
  "coinsBalance": 500,
  "createdAt": "2023-01-01T12:00:00Z",
  "token": "jwt_token_here"
}
```

#### `POST /auth/register`
**الوصف**: تسجيل مستخدم جديد.

**المعلمات**:
```json
{
  "name": "أحمد محمد",
  "phone": "0512345678",
  "pin": "123456"
}
```

**الاستجابة**: نفس استجابة تسجيل الدخول.

#### `GET /user/profile`
**الوصف**: الحصول على معلومات الملف الشخصي للمستخدم الحالي.

**الاستجابة**: نفس استجابة تسجيل الدخول (بدون token).

#### `PUT /user/profile`
**الوصف**: تحديث معلومات الملف الشخصي للمستخدم.

**المعلمات**:
```json
{
  "name": "أحمد محمد علي",
  "email": "ahmed@example.com"
}
```

**الاستجابة**: نفس استجابة تسجيل الدخول (بدون token).

### المنتجات والفئات

#### `GET /categories`
**الوصف**: الحصول على قائمة فئات المنتجات.

**الاستجابة**:
```json
[
  {
    "id": "cat1",
    "name": "برجر",
    "image": "https://example.com/burger.jpg",
    "description": "تشكيلة متنوعة من البرجر"
  },
  {
    "id": "cat2",
    "name": "بيتزا",
    "image": "https://example.com/pizza.jpg",
    "description": "بيتزا طازجة بعجينة إيطالية أصلية"
  }
]
```

#### `GET /products`
**الوصف**: الحصول على قائمة المنتجات، مع إمكانية التصفية حسب الفئة.

**المعلمات الاختيارية**: `categoryId` (معرف الفئة)

**الاستجابة**:
```json
[
  {
    "id": "prod1",
    "name": "برجر لحم",
    "description": "برجر لحم بقري طازج مع جبنة وخضروات",
    "price": 35,
    "image": "https://example.com/beef-burger.jpg",
    "categoryId": "cat1",
    "options": [
      {
        "id": "opt1",
        "name": "الحجم",
        "type": "single",
        "required": true,
        "choices": [
          { "id": "ch1", "name": "صغير", "price": 0 },
          { "id": "ch2", "name": "وسط", "price": 5 },
          { "id": "ch3", "name": "كبير", "price": 10 }
        ]
      }
    ],
    "isAvailable": true,
    "isPopular": true
  }
]
```

#### `GET /products/{id}`
**الوصف**: الحصول على تفاصيل منتج محدد.

**الاستجابة**: نفس تنسيق المنتج الفردي من استجابة `/products`.

#### `GET /products/popular`
**الوصف**: الحصول على قائمة المنتجات الشائعة.

**الاستجابة**: مصفوفة من المنتجات بنفس تنسيق استجابة `/products`.

#### `GET /products/search`
**الوصف**: البحث عن منتجات باستخدام استعلام بحث.

**المعلمات الاختيارية**: `query` (نص البحث)

**الاستجابة**: مصفوفة من المنتجات بنفس تنسيق استجابة `/products`.

### الطلبات

#### `POST /orders`
**الوصف**: إنشاء طلب جديد.

**المعلمات**:
```json
{
  "items": [
    {
      "productId": "prod1",
      "quantity": 2,
      "options": [
        { "optionId": "opt1", "value": "ch2" }
      ]
    }
  ],
  "address": "شارع الملك فهد، الرياض",
  "paymentMethod": "cash",
  "useCoins": false,
  "cardCodes": ["GIFT-1234"],
  "notes": "الرجاء عدم وضع البصل"
}
```

**الاستجابة**:
```json
{
  "id": "ord1",
  "orderNumber": "ORD-1001",
  "status": "pending",
  "items": [
    {
      "id": "item1",
      "name": "برجر لحم",
      "quantity": 2,
      "price": 35,
      "options": [
        { "name": "الحجم", "value": "وسط" }
      ]
    }
  ],
  "total": 80,
  "coinsEarned": 8,
  "address": "شارع الملك فهد، الرياض",
  "paymentMethod": "cash",
  "createdAt": "2023-06-15T14:30:00Z",
  "estimatedDeliveryTime": "2023-06-15T15:15:00Z"
}
```

#### `GET /orders`
**الوصف**: الحصول على قائمة طلبات المستخدم.

**الاستجابة**: مصفوفة من الطلبات بنفس تنسيق استجابة إنشاء الطلب.

#### `GET /orders/{id}`
**الوصف**: الحصول على تفاصيل طلب محدد.

**الاستجابة**: نفس تنسيق الطلب الفردي من استجابة `/orders`.

#### `POST /orders/{id}/cancel`
**الوصف**: إلغاء طلب محدد.

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم إلغاء الطلب بنجاح"
}
```

#### `GET /orders/{id}/track`
**الوصف**: تتبع حالة طلب محدد.

**الاستجابة**:
```json
{
  "status": "preparing",
  "currentStep": 2,
  "steps": [
    { "title": "تم استلام الطلب", "completed": true, "time": "2023-06-15T14:30:00Z" },
    { "title": "قيد التحضير", "completed": true, "time": "2023-06-15T14:35:00Z" },
    { "title": "قيد التوصيل", "completed": false },
    { "title": "تم التسليم", "completed": false }
  ]
}
```

### برنامج الولاء

#### `GET /loyalty/cards`
**الوصف**: الحصول على قائمة بطاقات المستخدم (هدايا، مكافآت، كوينز).

**الاستجابة**:
```json
[
  {
    "id": "card1",
    "title": "بطاقة البرجر",
    "type": "reward",
    "code": "1234567",
    "expiryDate": "2023-12-31",
    "backgroundColor": "#10b981",
    "textColor": "#ffffff",
    "isActive": true,
    "ownerId": "user123",
    "description": "اجمع الطوابع واحصل على برجر مجاني",
    "stages": [
      {
        "required": 5,
        "reward": "برجر مجاني",
        "rewardType": "gift"
      }
    ],
    "stamps": [
      { "id": "s1", "cardId": "card1", "code": "123456", "isActive": true, "activatedBy": "user123", "activatedAt": "2023-06-01" },
      { "id": "s2", "cardId": "card1", "code": "234567", "isActive": true, "activatedBy": "user123", "activatedAt": "2023-06-05" },
      { "id": "s3", "cardId": "card1", "code": "345678", "isActive": false }
    ]
  },
  {
    "id": "card2",
    "title": "بطاقة هدية عيد الفطر",
    "type": "gift",
    "code": "12345",
    "expiryDate": "2023-12-31",
    "backgroundColor": "#8b5cf6",
    "textColor": "#ffffff",
    "isActive": true,
    "ownerId": "user123",
    "giftType": "discount",
    "discountValue": 20,
    "imageUrl": "https://example.com/gift-card.jpg"
  }
]
```

#### `POST /loyalty/cards/activate`
**الوصف**: تفعيل بطاقة جديدة باستخدام رمز التفعيل.

**المعلمات**:
```json
{
  "code": "CARD-1234"
}
```

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم تفعيل البطاقة بنجاح",
  "card": { /* بيانات البطاقة بنفس تنسيق استجابة /loyalty/cards */ }
}
```

#### `GET /loyalty/cards/discover/{code}`
**الوصف**: اكتشاف بطاقة باستخدام رمز البطاقة.

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم العثور على البطاقة",
  "card": { /* بيانات البطاقة بنفس تنسيق استجابة /loyalty/cards */ }
}
```

#### `POST /loyalty/cards/{id}/add`
**الوصف**: إضافة بطاقة مكتشفة إلى حساب المستخدم.

**الاستجابة**:
```json
{
  "success": true,
  "message": "تمت إضافة البطاقة إلى حسابك بنجاح"
}
```

#### `POST /loyalty/stamps/activate`
**الوصف**: تفعيل طابع لبطاقة مكافآت.

**المعلمات**:
```json
{
  "cardId": "card1",
  "code": "STAMP-1234"
}
```

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم تفعيل الطابع بنجاح"
}
```

#### `POST /loyalty/rewards/{id}/use`
**الوصف**: استخدام مكافأة من بطاقة مكافآت.

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم استخدام المكافأة بنجاح"
}
```

#### `POST /loyalty/gift-cards/{id}/use`
**الوصف**: استخدام بطاقة هدية.

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم استخدام بطاقة الهدية بنجاح"
}
```

### محفظة الكوينز

#### `GET /loyalty/coins/balance`
**الوصف**: الحصول على رصيد الكوينز الحالي.

**الاستجابة**:
```json
{
  "balance": 500
}
```

#### `GET /loyalty/coins/history`
**الوصف**: الحصول على سجل معاملات الكوينز.

**الاستجابة**:
```json
[
  {
    "id": "tx1",
    "amount": 50,
    "type": "earned",
    "description": "مكافأة على الطلب #ORD-1001",
    "createdAt": "2023-06-15T14:30:00Z"
  },
  {
    "id": "tx2",
    "amount": 100,
    "type": "spent",
    "description": "خصم على الطلب #ORD-1002",
    "createdAt": "2023-06-16T10:15:00Z"
  }
]
```

#### `POST /user/coins/transfer`
**الوصف**: تحويل كوينز إلى مستخدم آخر.

**المعلمات**:
```json
{
  "recipientPhone": "0523456789",
  "amount": 100
}
```

**الاستجابة**:
```json
{
  "success": true,
  "message": "تم تحويل الكوينز بنجاح"
}
```

## لوحة التحكم (Admin)

### المصادقة

#### `POST /admin/auth/login`
**الوصف**: تسجيل دخول المسؤول.

**المعلمات**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**الاستجابة**:
```json
{
  "id": "admin1",
  "name": "مدير النظام",
  "username": "admin",
  "role": "admin",
  "token": "jwt_token_here"
}
```

### إدارة الطلبات

#### `GET /admin/orders`
**الوصف**: الحصول على قائمة الطلبات، مع إمكانية التصفية حسب الحالة.

**المعلمات الاختيارية**: `status` (حالة الطلب)

**الاستجابة**: مصفوفة من الطلبات مع معلومات إضافية للمسؤول.

#### `GET /admin/orders/{id}`
**الوصف**: الحصول على تفاصيل طلب محدد.

**الاستجابة**: تفاصيل الطلب مع معلومات إضافية للمسؤول.

#### `PUT /admin/orders/{id}/status`
**الوصف**: تحديث حالة طلب محدد.

**المعلمات**:
```json
{
  "status": "preparing"
}
```

**الاستجابة**: تفاصيل الطلب المحدثة.

### إدارة المنتجات

#### `GET /admin/products`
**الوصف**: الحصول على قائمة المنتجات للمسؤول.

**الاستجابة**: مصفوفة من المنتجات مع معلومات إضافية للمسؤول.

#### `POST /admin/products`
**الوصف**: إنشاء منتج جديد.

**المعلمات**: `FormData` تحتوي على بيانات المنتج وصورته.

**الاستجابة**: تفاصيل المنتج الجديد.

#### `PUT /admin/products/{id}`
**الوصف**: تحديث منتج موجود.

**المعلمات**: `FormData` تحتوي على بيانات المنتج المحدثة.

**الاستجابة**: تفاصيل المنتج المحدثة.

#### `DELETE /admin/products/{id}`
**الوصف**: حذف منتج محدد.

**الاستجابة**:
```json
{
  "success": true
}
```

### إدارة الفئات

#### `GET /admin/categories`
**الوصف**: الحصول على قائمة فئات المنتجات للمسؤول.

**الاستجابة**: مصفوفة من الفئات مع معلومات إضافية للمسؤول.

#### `POST /admin/categories`
**الوصف**: إنشاء فئة جديدة.

**المعلمات**: `FormData` تحتوي على بيانات الفئة وصورتها.

**الاستجابة**: تفاصيل الفئة الجديدة.

#### `PUT /admin/categories/{id}`
**الوصف**: تحديث فئة موجودة.

**المعلمات**: `FormData` تحتوي على بيانات الفئة المحدثة.

**الاستجابة**: تفاصيل الفئة المحدثة.

#### `DELETE /admin/categories/{id}`
**الوصف**: حذف فئة محددة.

**الاستجابة**:
```json
{
  "success": true
}
```

### إدارة البطاقات

#### `GET /admin/cards`
**الوصف**: الحصول على قائمة البطاقات، مع إمكانية التصفية حسب النوع.

**المعلمات الاختيارية**: `type` (نوع البطاقة: reward, gift, coins)

**الاستجابة**: مصفوفة من البطاقات مع معلومات إضافية للمسؤول.

#### `POST /admin/cards`
**الوصف**: إنشاء بطاقات جديدة.

**المعلمات**:
```json
{
  "type": "reward",
  "title": "بطاقة البرجر",
  "description": "اجمع الطوابع واحصل على برجر مجاني",
  "count": 10,
  "expiryDate": "2023-12-31",
  "backgroundColor": "#10b981",
  "textColor": "#ffffff",
  "stages": [
    {
      "required": 5,
      "reward": "برجر مجاني",
      "rewardType": "gift"
    }
  ]
}
```

**الاستجابة**: مصفوفة من البطاقات الجديدة.

#### `POST /admin/upload/card-image`
**الوصف**: رفع صورة لبطاقة هدية.

**المعلمات**: `FormData` تحتوي على الصورة.

**الاستجابة**:
```json
{
  "url": "https://example.com/card-image.jpg"
}
```

#### `PUT /admin/cards/{id}/deactivate`
**الوصف**: تعطيل بطاقة محددة.

**الاستجابة**:
```json
{
  "success": true
}
```

#### `DELETE /admin/cards/{id}`
**الوصف**: حذف بطاقة محددة.

**الاستجابة**:
```json
{
  "success": true
}
```

### لوحة المعلومات

#### `GET /admin/dashboard/stats`
**الوصف**: الحصول على إحصائيات لوحة المعلومات.

**الاستجابة**:
```json
{
  "totalOrders": 150,
  "totalRevenue": 12500,
  "totalCustomers": 75,
  "recentOrders": [ /* مصفوفة من الطلبات الأخيرة */ ],
  "popularProducts": [ /* مصفوفة من المنتجات الشائعة */ ],
  "ordersByStatus": [
    { "status": "pending", "count": 10 },
    { "status": "preparing", "count": 15 },
    { "status": "delivering", "count": 5 },
    { "status": "completed", "count": 120 }
  ]
}
```