# مكونات تطبيق وجباتي والوظائف البرمجية

## نظرة عامة

هذا المستند يوضح المكونات الرئيسية لتطبيق وجباتي والوظائف البرمجية التي يحتاجها كل مكون ليعمل بشكل صحيح. يهدف هذا المستند إلى توفير دليل شامل للمطورين لفهم بنية التطبيق وكيفية تفاعل المكونات المختلفة مع بعضها البعض.

## 1. مكونات واجهة المستخدم (UI Components)

### 1.1 مكونات التنقل والتخطيط

#### Header.tsx
- **الوصف**: شريط التنقل العلوي للتطبيق
- **الوظائف**:
  - عرض شعار التطبيق
  - عرض روابط التنقل الرئيسية
  - عرض رصيد الكوينز
  - عرض عدد العناصر في سلة التسوق
  - عرض قائمة منسدلة للملف الشخصي

#### MobileNavBar.tsx
- **الوصف**: شريط التنقل السفلي للأجهزة المحمولة
- **الوظائف**:
  - عرض أيقونات للصفحات الرئيسية
  - عرض عدد العناصر في سلة التسوق
  - عرض رصيد الكوينز

#### Layout.tsx
- **الوصف**: التخطيط العام للتطبيق
- **الوظائف**:
  - تضمين Header و MobileNavBar
  - التحقق من حالة تسجيل الدخول
  - توفير هيكل متناسق لجميع الصفحات

### 1.2 مكونات الصفحة الرئيسية

#### CoinsBalanceCard.tsx
- **الوصف**: بطاقة تعرض رصيد الكوينز
- **الوظائف**:
  - عرض الرصيد الحالي
  - توفير أزرار للتحويل وعرض السجل

#### GiftCardsCarousel.tsx
- **الوصف**: عرض متحرك لبطاقات الهدايا
- **الوظائف**:
  - عرض بطاقات الهدايا المتاحة
  - التفاعل مع البطاقات (تنشيط، عرض التفاصيل)

#### RewardsCarousel.tsx
- **الوصف**: عرض متحرك للمكافآت
- **الوظائف**:
  - عرض المكافآت المتاحة
  - عرض تقدم الطوابع
  - إضافة طوابع واستبدال المكافآت

#### FlashDealsSection.tsx
- **الوصف**: قسم يعرض العروض المحدودة
- **الوظائف**:
  - عرض العروض النشطة
  - إظهار الخصومات والأسعار
  - إضافة المنتجات إلى سلة التسوق

### 1.3 مكونات المتجر والمنتجات

#### store/index.tsx
- **الوصف**: صفحة المتجر الرئيسية
- **الوظائف**:
  - عرض فئات المنتجات
  - عرض المنتجات المميزة
  - تصفية المنتجات حسب الفئة
  - عرض تفاصيل المنتج
  - تخصيص الطلب (الإضافات، الكمية)

### 1.4 مكونات سلة التسوق والطلبات

#### cart/index.tsx
- **الوصف**: صفحة سلة التسوق
- **الوظائف**:
  - عرض المنتجات في السلة
  - تعديل الكميات
  - إزالة المنتجات
  - تطبيق بطاقات الهدايا والمكافآت
  - اختيار طريقة الدفع
  - إدخال معلومات التوصيل
  - إتمام الطلب

#### orders/index.tsx
- **الوصف**: صفحة تتبع الطلبات
- **الوظائف**:
  - عرض الطلبات الحالية والسابقة
  - عرض حالة الطلب بشكل مرئي
  - عرض تفاصيل الطلب
  - إعادة الطلب

### 1.5 مكونات برنامج الولاء

#### loyalty/index.tsx
- **الوصف**: صفحة برنامج الولاء
- **الوظائف**:
  - عرض بطاقات الهدايا
  - عرض بطاقات المكافآت
  - إضافة طوابع
  - استبدال المكافآت

#### cards/index.tsx
- **الوصف**: صفحة اكتشاف وتفعيل البطاقات
- **الوظائف**:
  - تفعيل بطاقات جديدة
  - عرض تفاصيل البطاقات
  - إضافة البطاقات إلى الحساب

### 1.6 مكونات المحفظة

#### wallet/index.tsx
- **الوصف**: صفحة محفظة الكوينز
- **الوظائف**:
  - عرض الرصيد الحالي
  - تحويل الكوينز
  - عرض سجل المعاملات
  - تصفية المعاملات حسب النوع

### 1.7 مكونات الملف الشخصي

#### profile/index.tsx
- **الوصف**: صفحة الملف الشخصي
- **الوظائف**:
  - عرض وتحديث المعلومات الشخصية
  - إدارة العناوين
  - تغيير كلمة المرور
  - تسجيل الخروج

### 1.8 مكونات المصادقة

#### login/index.tsx
- **الوصف**: صفحة تسجيل الدخول
- **الوظائف**:
  - إدخال رقم الهاتف
  - إدخال رمز PIN
  - التحقق من بيانات المستخدم
  - تسجيل الدخول

## 2. الوظائف البرمجية الأساسية

### 2.1 إدارة المستخدمين والمصادقة

#### AuthService
- **الوظائف**:
  - `login(phone: string, pin: string): Promise<User>`
  - `logout(): void`
  - `register(userData: UserRegistrationData): Promise<User>`
  - `updateProfile(userData: UserProfileData): Promise<User>`
  - `changePassword(oldPin: string, newPin: string): Promise<boolean>`
  - `isAuthenticated(): boolean`
  - `getCurrentUser(): User | null`

#### UserService
- **الوظائف**:
  - `getProfile(): Promise<UserProfile>`
  - `updateProfile(data: UserProfileData): Promise<UserProfile>`
  - `getAddresses(): Promise<Address[]>`
  - `addAddress(address: AddressData): Promise<Address>`
  - `updateAddress(id: string, address: AddressData): Promise<Address>`
  - `deleteAddress(id: string): Promise<boolean>`

### 2.2 إدارة المنتجات والمتجر

#### ProductService
- **الوظائف**:
  - `getProducts(filters?: ProductFilters): Promise<Product[]>`
  - `getProductById(id: string): Promise<Product>`
  - `getCategories(): Promise<Category[]>`
  - `getProductsByCategory(categoryId: string): Promise<Product[]>`
  - `getFeaturedProducts(): Promise<Product[]>`
  - `getProductExtras(): Promise<ProductExtra[]>`

### 2.3 إدارة سلة التسوق والطلبات

#### CartService
- **الوظائف**:
  - `getCart(): Promise<Cart>`
  - `addToCart(product: Product, quantity: number, extras?: ProductExtra[]): Promise<Cart>`
  - `updateQuantity(itemId: string, quantity: number): Promise<Cart>`
  - `removeFromCart(itemId: string): Promise<Cart>`
  - `clearCart(): Promise<Cart>`
  - `applyLoyaltyCard(cardId: string, action: 'redeem' | 'collect' | 'request'): Promise<Cart>`

#### OrderService
- **الوظائف**:
  - `createOrder(orderData: OrderData): Promise<Order>`
  - `getOrders(): Promise<Order[]>`
  - `getOrderById(id: string): Promise<Order>`
  - `trackOrder(id: string): Promise<OrderStatus>`
  - `reorder(orderId: string): Promise<Cart>`

### 2.4 إدارة المحفظة والكوينز

#### WalletService
- **الوظائف**:
  - `getBalance(): Promise<number>`
  - `transferCoins(phone: string, amount: number): Promise<Transaction>`
  - `getTransactions(filters?: TransactionFilters): Promise<Transaction[]>`
  - `useCoinsForPayment(amount: number): Promise<boolean>`
  - `addCoinsFromGiftCard(cardCode: string): Promise<number>`

### 2.5 إدارة برنامج الولاء

#### LoyaltyService
- **الوظائف**:
  - `getRewardCards(): Promise<RewardCard[]>`
  - `getGiftCards(): Promise<GiftCard[]>`
  - `activateCard(code: string): Promise<LoyaltyCard>`
  - `addStamp(cardId: string, code: string): Promise<RewardCard>`
  - `redeemReward(cardId: string, rewardId: string): Promise<Reward>`
  - `useGiftCard(cardId: string): Promise<boolean>`

### 2.6 إدارة العروض

#### PromotionService
- **الوظائف**:
  - `getPromotions(filters?: PromotionFilters): Promise<Promotion[]>`
  - `getPromotionById(id: string): Promise<Promotion>`
  - `applyPromotion(promotionId: string, cartId: string): Promise<Cart>`
  - `getFlashDeals(): Promise<FlashDeal[]>`

## 3. نماذج البيانات (Data Models)

### 3.1 نموذج المستخدم
```typescript
interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  createdAt: Date;
  coinsBalance: number;
}

interface UserProfile extends User {
  addresses: Address[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  postalCode?: string;
  additionalInfo?: string;
  isDefault: boolean;
}
```

### 3.2 نموذج المنتج
```typescript
interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice: number;
  coinsPrice: number;
  image: string;
  category: Category;
  featured: boolean;
  components?: ProductComponent[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

interface ProductComponent {
  id: string;
  name: string;
  quantity: number;
}

interface ProductExtra {
  id: string;
  name: string;
  price: number;
}
```

### 3.3 نموذج سلة التسوق والطلبات
```typescript
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  extras?: ProductExtra[];
  totalPrice: number;
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  extrasTotal: number;
  discount: number;
  total: number;
  appliedLoyaltyCard?: LoyaltyCard;
}

interface Order {
  id: string;
  date: Date;
  status: 'pending' | 'accepted' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  extrasTotal: number;
  discount: number;
  total: number;
  deliveryInfo: DeliveryInfo;
  paymentMethod: 'cash' | 'coins';
  appliedLoyaltyCard?: LoyaltyCard;
}

interface OrderItem {
  id: string;
  productName: string;
  productDescription: string;
  quantity: number;
  price: number;
  extras?: {
    name: string;
    price: number;
  }[];
  totalPrice: number;
}

interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  deliveryTime: 'asap' | 'scheduled';
  scheduledTime?: string;
}
```

### 3.4 نموذج المحفظة والمعاملات
```typescript
interface Transaction {
  id: string;
  type: 'add' | 'spend' | 'receive' | 'send';
  amount: number;
  date: Date;
  description: string;
  recipientPhone?: string;
  senderPhone?: string;
}

interface CoinTransfer {
  id: string;
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}
```

### 3.5 نموذج برنامج الولاء
```typescript
interface LoyaltyCard {
  id: string;
  title: string;
  type: 'gift' | 'reward';
  code: string;
  expiryDate: Date;
  backgroundColor: string;
  textColor: string;
  userId: string;
}

interface GiftCard extends LoyaltyCard {
  type: 'gift';
  coinsAmount?: number;
}

interface RewardCard extends LoyaltyCard {
  type: 'reward';
  stamps: {
    required: number;
    current: number;
    reward: string;
  }[];
}
```

### 3.6 نموذج العروض
```typescript
interface Promotion {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
  startDate: Date;
  endDate: Date;
}

interface FlashDeal extends Promotion {
  timeRemaining: string;
}
```

## 4. خدمات الطرف الثالث (Third-party Services)

### 4.1 خدمة المصادقة
- **الوصف**: خدمة للتحقق من هوية المستخدمين وإدارة الجلسات
- **الوظائف**:
  - التحقق من رقم الهاتف
  - إنشاء وإدارة رموز JWT
  - تخزين وتشفير كلمات المرور

### 4.2 خدمة الدفع
- **الوصف**: خدمة لمعالجة المدفوعات
- **الوظائف**:
  - معالجة الدفع عند الاستلام
  - إدارة محفظة الكوينز
  - تسجيل المعاملات

### 4.3 خدمة الإشعارات
- **الوصف**: خدمة لإرسال الإشعارات للمستخدمين
- **الوظائف**:
  - إشعارات حالة الطلب
  - إشعارات العروض الجديدة
  - إشعارات تحديثات برنامج الولاء

### 4.4 خدمة التخزين
- **الوصف**: خدمة لتخزين الملفات والصور
- **الوظائف**:
  - تخزين صور المنتجات
  - تخزين صور الفئات
  - تخزين صور المستخدمين

## 5. استراتيجيات التنفيذ

### 5.1 إدارة الحالة (State Management)
- استخدام Context API أو Redux لإدارة حالة التطبيق
- تنظيم الحالة حسب المجالات (المستخدم، السلة، الطلبات، إلخ)
- استخدام reducers لتحديث الحالة بطريقة متوقعة

### 5.2 التفاعل مع الخادم (Server Interaction)
- استخدام Axios أو Fetch API للتفاعل مع واجهات برمجة التطبيقات
- تنفيذ آلية للتعامل مع الأخطاء والاستثناءات
- استخدام Interceptors للتعامل مع المصادقة وتجديد الرموز

### 5.3 التخزين المؤقت (Caching)
- تخزين البيانات المستخدمة بشكل متكرر في ذاكرة التخزين المؤقت
- تنفيذ استراتيجية للتحقق من صلاحية البيانات المخزنة
- استخدام Service Workers للعمل في وضع عدم الاتصال

### 5.4 الأداء (Performance)
- تحميل المكونات بشكل كسول (Lazy Loading)
- تحسين الصور وتحميلها بشكل تدريجي
- استخدام التخزين المؤقت للبيانات والأصول

### 5.5 الأمان (Security)
- تشفير البيانات الحساسة
- التحقق من صحة المدخلات
- حماية من هجمات CSRF و XSS

## 6. خطة التنفيذ

### 6.1 المرحلة الأولى: الأساسيات
- إعداد بنية المشروع
- تنفيذ المصادقة وإدارة المستخدمين
- تنفيذ صفحة المتجر الأساسية
- تنفيذ سلة التسوق الأساسية

### 6.2 المرحلة الثانية: الوظائف الأساسية
- تنفيذ نظام الطلبات
- تنفيذ تتبع الطلبات
- تنفيذ الملف الشخصي
- تنفيذ محفظة الكوينز الأساسية

### 6.3 المرحلة الثالثة: برنامج الولاء
- تنفيذ بطاقات الهدايا
- تنفيذ بطاقات المكافآت
- تنفيذ نظام الطوابع
- تنفيذ استبدال المكافآت

### 6.4 المرحلة الرابعة: التحسينات
- تنفيذ العروض والتخفيضات
- تنفيذ الإشعارات
- تحسين الأداء والتجربة
- اختبار وإصلاح الأخطاء
