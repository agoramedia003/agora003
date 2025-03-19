# دليل تكامل الواجهة الخلفية (Backend Integration)

## مقدمة

هذا الدليل يشرح كيفية تحويل التطبيق من استخدام البيانات المحلية (Mock Data) إلى استخدام واجهة برمجة التطبيقات (API) الحقيقية. سنقوم بشرح الخطوات اللازمة لربط التطبيق بخادم الواجهة الخلفية وتعديل المكونات لاستخدام البيانات الديناميكية.

## المراحل الأساسية

### المرحلة 1: إعداد بيئة الاتصال بالواجهة الخلفية

1. **إنشاء ملف التكوين البيئي**
   - إنشاء ملف `.env` في المجلد الجذر للمشروع
   - تحديد عنوان URL للواجهة الخلفية

   ```
   VITE_API_BASE_URL=https://api.example.com
   ```

2. **إعداد عميل HTTP**
   - تأكد من وجود ملف `src/services/api/apiClient.ts` الذي يقوم بإعداد عميل HTTP (مثل Axios)
   - تأكد من أن العميل يستخدم عنوان URL من ملف التكوين البيئي
   - تأكد من أن العميل يتعامل مع الرموز المميزة (tokens) للمصادقة

### المرحلة 2: تحديث خدمات API

1. **مراجعة ملفات خدمات API**
   - تأكد من أن جميع ملفات الخدمات في `src/services/api/` تستخدم عميل HTTP بشكل صحيح
   - تأكد من أن المسارات (endpoints) تتطابق مع مسارات الواجهة الخلفية الحقيقية

2. **إزالة البيانات الوهمية**
   - إزالة أي بيانات وهمية (mock data) من ملفات الخدمات
   - التأكد من أن جميع الدوال تستدعي نقاط النهاية الحقيقية

### المرحلة 3: تحديث مكونات واجهة المستخدم

1. **تحديث مكونات الصفحات**
   - تحديث جميع الصفحات لاستخدام خدمات API بدلاً من البيانات المحلية
   - استخدام hooks مثل `useState` و `useEffect` لجلب البيانات من الخادم

2. **إضافة حالات التحميل والخطأ**
   - إضافة حالات التحميل (loading states) لتحسين تجربة المستخدم
   - إضافة معالجة الأخطاء لعرض رسائل خطأ مناسبة

3. **تحديث نماذج الإدخال**
   - تحديث جميع النماذج لإرسال البيانات إلى الخادم
   - إضافة التحقق من صحة البيانات (validation) قبل الإرسال

## خطوات التنفيذ التفصيلية

### 1. تحديث ملف apiClient.ts

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة اعتراض (interceptor) للطلبات لإضافة رمز المصادقة
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// إضافة اعتراض للاستجابات للتعامل مع أخطاء المصادقة
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // تسجيل الخروج إذا انتهت صلاحية الرمز المميز
      localStorage.removeItem('token');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. تحديث مكون تسجيل الدخول

```typescript
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../services/api/userApi';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || !pin) {
      setError('يرجى إدخال رقم الهاتف والرمز السري');
      return;
    }

    setIsLoading(true);

    try {
      // استدعاء API الحقيقي
      const response = await userApi.login({ phone, pin });
      
      // تخزين رمز المصادقة ومعلومات المستخدم
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        name: response.name,
        phone: response.phone,
        coinsBalance: response.coinsBalance
      }));
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // باقي الكود...
};
```

### 3. تحديث مكون المنتجات

```typescript
// src/pages/Store.tsx
import React, { useState, useEffect } from 'react';
import productApi from '../services/api/productApi';

const Store = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
        console.error('Error fetching categories:', error);
        setError('حدث خطأ أثناء جلب فئات المنتجات');
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
        console.error('Error fetching products:', error);
        setError('حدث خطأ أثناء جلب المنتجات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // باقي الكود...
};
```

### 4. تحديث مكون برنامج الولاء

```typescript
// src/components/loyalty/index.tsx
import React, { useState, useEffect } from 'react';
import loyaltyApi from '../../services/api/loyaltyApi';

const LoyaltyPage = () => {
  const [activeTab, setActiveTab] = useState('my-cards');
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب بطاقات المستخدم
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const data = await loyaltyApi.getUserCards();
        setUserCards(data);
      } catch (error) {
        console.error('Error fetching user cards:', error);
        setError('حدث خطأ أثناء جلب البطاقات');
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
      console.error('Card activation error:', error);
      return { success: false, message: 'حدث خطأ أثناء تفعيل البطاقة' };
    }
  };

  // باقي الدوال والكود...
};
```

### 5. تحديث مكون إدارة الطلبات في لوحة التحكم

```typescript
// src/components/admin/OrdersManagement.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../services/api/adminApi';

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // التحقق من تسجيل دخول المسؤول
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    // جلب الطلبات
    const fetchOrders = async () => {
      try {
        const data = await adminApi.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('حدث خطأ أثناء جلب الطلبات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, { status: newStatus });
      
      // تحديث حالة الطلب في القائمة المحلية
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, timeInStage: 0 }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  // باقي الكود...
};
```

## اختبار التكامل

1. **اختبار المصادقة**
   - اختبار تسجيل الدخول وتسجيل الخروج
   - التأكد من تخزين واسترجاع رمز المصادقة بشكل صحيح

2. **اختبار جلب البيانات**
   - اختبار جلب قوائم المنتجات والفئات
   - اختبار جلب تفاصيل المنتج
   - اختبار جلب بطاقات المستخدم

3. **اختبار إرسال البيانات**
   - اختبار إنشاء طلب جديد
   - اختبار تفعيل بطاقة أو طابع
   - اختبار تحديث حالة الطلب (في لوحة التحكم)

## استكشاف الأخطاء وإصلاحها

1. **مشاكل CORS**
   - التأكد من أن الخادم يسمح بطلبات من نطاق التطبيق
   - استخدام وكيل (proxy) في بيئة التطوير إذا لزم الأمر

2. **مشاكل المصادقة**
   - التأكد من إرسال رمز المصادقة مع كل طلب
   - التعامل مع انتهاء صلاحية الرمز المميز

3. **مشاكل تنسيق البيانات**
   - التأكد من تطابق تنسيق البيانات بين الواجهة الأمامية والخلفية
   - استخدام وظائف تحويل (mappers) إذا كان هناك اختلاف في التنسيق

## الخلاصة

باتباع هذه الخطوات، يمكنك تحويل التطبيق من استخدام البيانات المحلية إلى استخدام واجهة برمجة التطبيقات الحقيقية. تأكد من اختبار كل جزء من التطبيق بعد التحويل للتأكد من أنه يعمل بشكل صحيح مع الواجهة الخلفية.