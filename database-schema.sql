-- =============================
-- قاعدة بيانات تطبيق وجباتي
-- =============================

-- إنشاء قاعدة البيانات
CREATE DATABASE wajbati_db;

-- استخدام قاعدة البيانات
USE wajbati_db;

-- =============================
-- جدول المستخدمين
-- =============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    pin_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- تعليق: يخزن هذا الجدول معلومات المستخدمين الأساسية مثل رقم الهاتف ورمز PIN المشفر والاسم

-- =============================
-- جدول عناوين المستخدمين
-- =============================
CREATE TABLE user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    additional_info VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- تعليق: يخزن عناوين التوصيل للمستخدمين مع إمكانية تحديد العنوان الافتراضي

-- =============================
-- جدول فئات المنتجات
-- =============================
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_ar VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- تعليق: يخزن فئات المنتجات مثل برجر، بيتزا، مشروبات، إلخ

-- =============================
-- جدول المنتجات
-- =============================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    description_ar VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    coins_price INT,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- تعليق: يخزن معلومات المنتجات مع دعم اللغة العربية والأسعار العادية والمخفضة وسعر الكوينز

-- =============================
-- جدول إضافات المنتجات
-- =============================
CREATE TABLE product_extras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    name_ar VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- تعليق: يخزن الإضافات المتاحة مثل جبنة إضافية، صلصة حارة، إلخ

-- =============================
-- جدول محفظة الكوينز
-- =============================
CREATE TABLE wallet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- تعليق: يخزن رصيد الكوينز لكل مستخدم

-- =============================
-- جدول معاملات الكوينز
-- =============================
CREATE TABLE wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    amount INT NOT NULL,
    transaction_type ENUM('add', 'spend', 'receive', 'send') NOT NULL,
    reference_id INT,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallet(id)
);

-- تعليق: يسجل جميع معاملات الكوينز مثل الإضافة، الإنفاق، الاستلام، الإرسال

-- =============================
-- جدول بطاقات الهدايا
-- =============================
CREATE TABLE gift_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    title_ar VARCHAR(100) NOT NULL,
    background_color VARCHAR(20) DEFAULT '#4f46e5',
    text_color VARCHAR(20) DEFAULT '#ffffff',
    coins_amount INT,
    expiry_date DATE NOT NULL,
    is_activated BOOLEAN DEFAULT FALSE,
    activated_by INT,
    activated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activated_by) REFERENCES users(id)
);

-- تعليق: يخزن بطاقات الهدايا مع رموز التفعيل وقيمة الكوينز وتاريخ الانتهاء

-- =============================
-- جدول بطاقات المكافآت
-- =============================
CREATE TABLE reward_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    title_ar VARCHAR(100) NOT NULL,
    background_color VARCHAR(20) DEFAULT '#10b981',
    text_color VARCHAR(20) DEFAULT '#ffffff',
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- تعليق: يخزن بطاقات المكافآت المرتبطة بالمستخدمين

-- =============================
-- جدول مراحل المكافآت
-- =============================
CREATE TABLE reward_stages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reward_card_id INT NOT NULL,
    stage_number INT NOT NULL,
    required_stamps INT NOT NULL,
    current_stamps INT DEFAULT 0,
    reward VARCHAR(100) NOT NULL,
    reward_ar VARCHAR(100) NOT NULL,
    FOREIGN KEY (reward_card_id) REFERENCES reward_cards(id) ON DELETE CASCADE
);

-- تعليق: يخزن مراحل المكافآت لكل بطاقة مع عدد الطوابع المطلوبة والحالية

-- =============================
-- جدول الطلبات
-- =============================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    status ENUM('pending', 'accepted', 'preparing', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_address_id INT NOT NULL,
    payment_method ENUM('cash', 'coins') NOT NULL,
    delivery_time DATETIME,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (delivery_address_id) REFERENCES user_addresses(id)
);

-- تعليق: يخزن معلومات الطلبات مع حالة الطلب وطريقة الدفع ووقت التوصيل

-- =============================
-- جدول عناصر الطلب
-- =============================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    notes VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- تعليق: يخزن العناصر المطلوبة في كل طلب مع الكمية والسعر

-- =============================
-- جدول إضافات عناصر الطلب
-- =============================
CREATE TABLE order_item_extras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    extra_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    FOREIGN KEY (extra_id) REFERENCES product_extras(id)
);

-- تعليق: يخزن الإضافات المختارة لكل عنصر في الطلب

-- =============================
-- جدول العروض
-- =============================
CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    title_ar VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    description_ar VARCHAR(255),
    discount_percentage INT,
    discount_amount DECIMAL(10, 2),
    image_url VARCHAR(255),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- تعليق: يخزن العروض والتخفيضات المتاحة مع تواريخ البدء والانتهاء

-- =============================
-- جدول المنتجات المشمولة بالعروض
-- =============================
CREATE TABLE promotion_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    promotion_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- تعليق: يربط العروض بالمنتجات المشمولة بها

-- =============================
-- جدول الإشعارات
-- =============================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    title_ar VARCHAR(100) NOT NULL,
    message VARCHAR(255) NOT NULL,
    message_ar VARCHAR(255) NOT NULL,
    notification_type ENUM('order', 'promotion', 'loyalty', 'system') NOT NULL,
    reference_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- تعليق: يخزن الإشعارات المرسلة للمستخدمين مع نوع الإشعار ومرجعه

-- =============================
-- جدول سلة التسوق
-- =============================
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- تعليق: يخزن سلة التسوق لكل مستخدم

-- =============================
-- جدول عناصر سلة التسوق
-- =============================
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- تعليق: يخزن العناصر المضافة إلى سلة التسوق

-- =============================
-- جدول إضافات عناصر سلة التسوق
-- =============================
CREATE TABLE cart_item_extras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_item_id INT NOT NULL,
    extra_id INT NOT NULL,
    FOREIGN KEY (cart_item_id) REFERENCES cart_items(id) ON DELETE CASCADE,
    FOREIGN KEY (extra_id) REFERENCES product_extras(id)
);

-- تعليق: يخزن الإضافات المختارة لكل عنصر في سلة التسوق

-- =============================
-- جدول رموز تفعيل الطوابع
-- =============================
CREATE TABLE stamp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    order_id INT,
    is_used BOOLEAN DEFAULT FALSE,
    used_by INT,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (used_by) REFERENCES users(id)
);

-- تعليق: يخزن رموز تفعيل الطوابع المرتبطة بالطلبات

-- =============================
-- إنشاء بيانات أولية
-- =============================

-- إدخال فئات المنتجات
INSERT INTO product_categories (name, name_ar, icon, display_order) VALUES
('All', 'الكل', 'ShoppingBag', 1),
('Burgers', 'برجر', 'ShoppingBag', 2),
('Pizza', 'بيتزا', 'ShoppingBag', 3),
('Sandwiches', 'ساندويتش', 'ShoppingBag', 4),
('Drinks', 'مشروبات', 'ShoppingBag', 5),
('Desserts', 'حلويات', 'ShoppingBag', 6);

-- إدخال إضافات المنتجات
INSERT INTO product_extras (name, name_ar, price) VALUES
('Extra Cheese', 'جبنة إضافية', 5),
('Hot Sauce', 'صلصة حارة', 3),
('Crispy Onions', 'بصل مقرمش', 4),
('Extra Bread', 'خبز إضافي', 2);

-- ملاحظة: يمكن إضافة المزيد من البيانات الأولية حسب الحاجة

-- =============================
-- شرح استخدام قاعدة البيانات في التطبيق
-- =============================

/*
1. نظام المصادقة:
   - عند تسجيل الدخول، يتم التحقق من رقم الهاتف ورمز PIN في جدول users
   - بعد المصادقة، يتم إنشاء توكن JWT وإرساله إلى العميل

2. الملف الشخصي:
   - يتم عرض وتحديث بيانات المستخدم من جدول users
   - يتم إدارة عناوين التوصيل من جدول user_addresses

3. المتجر:
   - يتم عرض فئات المنتجات من جدول product_categories
   - يتم عرض المنتجات من جدول products مع تصفيتها حسب الفئة
   - يتم عرض الإضافات المتاحة من جدول product_extras

4. سلة التسوق:
   - يتم تخزين عناصر السلة في جداول cart و cart_items و cart_item_extras
   - عند إنشاء طلب، يتم نقل محتويات السلة إلى جداول orders و order_items و order_item_extras

5. الطلبات:
   - يتم تتبع حالة الطلب في جدول orders
   - يتم عرض تفاصيل الطلب من جداول order_items و order_item_extras

6. محفظة الكوينز:
   - يتم عرض رصيد الكوينز من جدول wallet
   - يتم تسجيل جميع معاملات الكوينز في جدول wallet_transactions
   - عند الدفع بالكوينز، يتم تحديث الرصيد وإنشاء معاملة جديدة

7. برنامج الولاء:
   - يتم تخزين بطاقات المكافآت في جدول reward_cards
   - يتم تخزين مراحل المكافآت والطوابع في جدول reward_stages
   - يتم تخزين بطاقات الهدايا في جدول gift_cards
   - عند تفعيل بطاقة هدية، يتم تحديث حالتها وإضافة الكوينز إلى محفظة المستخدم
   - عند إضافة طابع، يتم تحديث عدد الطوابع الحالية في جدول reward_stages

8. العروض:
   - يتم عرض العروض النشطة من جدول promotions
   - يتم ربط العروض بالمنتجات المشمولة من خلال جدول promotion_products

9. الإشعارات:
   - يتم إرسال وتخزين الإشعارات في جدول notifications
   - يتم تحديث حالة الإشعار (مقروء/غير مقروء) عند عرضه للمستخدم
*/
