# دليل تحويل مكونات التطبيق لاستخدام قاعدة البيانات

## مقدمة

هذا الدليل يشرح كيفية تحويل مكونات التطبيق من استخدام البيانات المحلية (Mock Data) إلى استخدام بيانات من قاعدة البيانات عبر واجهة برمجة التطبيقات (API). سنقوم بشرح التغييرات اللازمة لكل مكون رئيسي في التطبيق.

## المكونات الرئيسية وتحويلها

### 1. مكونات المصادقة

#### تسجيل الدخول (Login.tsx)

**قبل التحويل:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!phone || !pin) {
    setError("يرجى إدخال رقم الهاتف والرمز السري");
    return;
  }

  setIsLoading(true);

  try {
    // Mock successful login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify({ name: "مستخدم", phone }));
    navigate("/");
  } catch (error) {
    console.error("Login error:", error);
    setError("حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى.");
  } finally {
    setIsLoading(false);
  }
};
```

**بعد التحويل:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!phone || !pin) {
    setError("يرجى إدخال رقم الهاتف والرمز السري");
    return;
  }

  setIsLoading(true);

  try {
    // استدعاء API الحقيقي
    const response = await userApi.login({ phone, pin });
    
    // تخزين رمز المصادقة ومعلومات المستخدم
    localStorage.setItem("token", response.token);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify({
      id: response.id,
      name: response.name,
      phone: response.phone,
      coinsBalance: response.coinsBalance
    }));
    
    navigate("/");
  } catch (error) {
    console.error("Login error:", error);
    setError("حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى.");
  } finally {
    setIsLoading(false);
  }
};
```

### 2. مكونات المتجر

#### صفحة المتجر (Store.tsx)

**قبل التحويل:**
```typescript
const Store = () => {
  // بيانات محلية
  const categories = [
    { id: "cat1", name: "برجر", image: "https://example.com/burger.jpg" },
    { id: "cat2", name: "بيتزا", image: "https://example.com/pizza.jpg" },
    // المزيد من الفئات...
  ];

  const products = [
    {
      id: "prod1",
      name: "برجر لحم",
      description: "برجر لحم بقري طازج",
      price: 35,
      image: "https://example.com/beef-burger.jpg",
      categoryId: "cat1"
    },
    // المزيد من المنتجات...
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);
  const filteredProducts = products.filter(product => product.categoryId === selectedCategory);

  // باقي الكود...
};
```

**بعد التحويل:**
```typescript
const Store = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // جلب الفئات
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productApi.getCategories();
        setCategories(data);
        
        // اختيار الفئة الأولى افتراضيًا
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("حدث خطأ أثناء جلب فئات المنتجات");
      }
    };

    fetchCategories();
  }, []);

  // جلب المنتجات حسب الفئة المحددة
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      
      setIsLoading(true);
      try {
        const data = await productApi.getProducts(selectedCategory);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("حدث خطأ أثناء جلب المنتجات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // باقي الكود...
};
```

### 3. مكونات برنامج الولاء

#### صفحة برنامج الولاء (LoyaltyPage.tsx)

**قبل التحويل:**
```typescript
const LoyaltyPage = () => {
  const [activeTab, setActiveTab] = useState("my-cards");
  const [selectedCardId, setSelectedCardId] = useState(null);
  
  // بيانات محلية
  const mockUserCards = [
    {
      id: "reward-1",
      title: "بطاقة البرجر",
      description: "اجمع الطوابع واحصل على برجر مجاني",
      type: "reward",
      code: "1234567",
      // المزيد من البيانات...
    },
    // المزيد من البطاقات...
  ];
  
  const [userCards, setUserCards] = useState(mockUserCards);
  
  const handleActivateCard = async (code) => {
    // تنفيذ وهمي
    console.log("Activating card with code:", code);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // محاكاة نجاح أو فشل التفعيل
        if (code === "9999999") {
          resolve({ success: false, message: "هذه البطاقة مستخدمة من قبل" });
        } else if (code.length < 5) {
          resolve({ success: false, message: "رمز البطاقة غير صالح" });
        } else {
          // إنشاء بطاقة جديدة وهمية
          const newCard = {
            id: `new-${Date.now()}`,
            title: "بطاقة جديدة",
            type: "reward",
            // المزيد من البيانات...
          };
          
          setUserCards(prev => [...prev, newCard]);
          resolve({ success: true, message: "تم تفعيل البطاقة بنجاح", card: newCard });
        }
      }, 1000);
    });
  };
  
  // باقي الكود والدوال...
};
```

**بعد التحويل:**
```typescript
const LoyaltyPage = () => {
  const [activeTab, setActiveTab] = useState("my-cards");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // جلب بطاقات المستخدم
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const data = await loyaltyApi.getUserCards();
        setUserCards(data);
      } catch (error) {
        console.error("Error fetching user cards:", error);
        setError("حدث خطأ أثناء جلب البطاقات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCards();
  }, []);

  const handleActivateCard = async (code) => {
    try {
      const result = await loyaltyApi.activateCard({ code });
      if (result.success && result.card) {
        // تحديث قائمة البطاقات
        setUserCards(prev => [...prev, result.card]);
      }
      return result;
    } catch (error) {
      console.error("Card activation error:", error);
      return { success: false, message: "حدث خطأ أثناء تفعيل البطاقة" };
    }
  };
  
  const handleActivateStamp = async (cardId, code) => {
    try {
      const result = await loyaltyApi.activateStamp({ cardId, code });
      if (result.success) {
        // تحديث حالة الطابع في البطاقة
        const updatedCards = userCards.map(card => {
          if (card.id === cardId && card.type === "reward") {
            // البحث عن الطابع وتحديثه
            const updatedStamps = card.stamps.map(stamp => {
              if (stamp.code === code) {
                return { ...stamp, isActive: true, activatedBy: "user123", activatedAt: new Date().toISOString() };
              }
              return stamp;
            });
            return { ...card, stamps: updatedStamps };
          }
          return card;
        });
        setUserCards(updatedCards);
      }
      return result;
    } catch (error) {
      console.error("Stamp activation error:", error);
      return { success: false, message: "حدث خطأ أثناء تفعيل الطابع" };
    }
  };
  
  // باقي الكود والدوال...
};
```

### 4. مكونات سلة التسوق والطلبات

#### سلة التسوق (Cart.tsx)

**قبل التحويل:**
```typescript
const Cart = () => {
  // بيانات محلية من التخزين المحلي
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleCheckout = () => {
    // انتقال إلى صفحة إتمام الطلب
    navigate("/checkout");
  };

  // باقي الكود...
};
```

**بعد التحويل:**
```typescript
const Cart = () => {
  // لا يزال يستخدم التخزين المحلي للسلة، لكن سيتم إرسال البيانات إلى الخادم عند إتمام الطلب
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleCheckout = () => {
    // انتقال إلى صفحة إتمام الطلب
    navigate("/checkout");
  };

  // باقي الكود...
};
```

#### إتمام الطلب (Checkout.tsx)

**قبل التحويل:**
```typescript
const Checkout = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [useCoins, setUseCoins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = () => {
    setIsLoading(true);
    
    // محاكاة إرسال الطلب
    setTimeout(() => {
      // إنشاء رقم طلب وهمي
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // تخزين معلومات الطلب في التخزين المحلي
      const order = {
        id: orderNumber,
        items: cartItems,
        total: calculateTotal(),
        address,
        paymentMethod,
        useCoins,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([...savedOrders, order]));
      
      // مسح السلة
      localStorage.removeItem("cart");
      
      // الانتقال إلى صفحة تأكيد الطلب
      navigate(`/order-confirmation/${orderNumber}`);
      
      setIsLoading(false);
    }, 2000);
  };

  // باقي الكود...
};
```

**بعد التحويل:**
```typescript
const Checkout = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [useCoins, setUseCoins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // تحويل عناصر السلة إلى تنسيق API
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        options: item.selectedOptions ? Object.entries(item.selectedOptions).map(([optionId, value]) => ({
          optionId,
          value
        })) : []
      }));
      
      // إرسال الطلب إلى الخادم
      const response = await orderApi.createOrder({
        items: orderItems,
        address,
        paymentMethod,
        useCoins
      });
      
      // مسح السلة
      localStorage.removeItem("cart");
      
      // الانتقال إلى صفحة تأكيد الطلب
      navigate(`/order-confirmation/${response.orderNumber}`);
    } catch (error) {
      console.error("Error placing order:", error);
      setError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  // باقي الكود...
};
```

### 5. مكونات لوحة التحكم

#### إدارة الطلبات (OrdersManagement.tsx)

**قبل التحويل:**
```typescript
const OrdersManagement = () => {
  const navigate = useNavigate();