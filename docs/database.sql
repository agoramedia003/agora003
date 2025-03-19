-- إنشاء قاعدة البيانات
CREATE DATABASE food_loyalty_app;
USE food_loyalty_app;

-- جدول المستخدمين
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    pin VARCHAR(255) NOT NULL, -- مخزنة بشكل مشفر
    coins_balance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول المسؤولين
CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- مخزنة بشكل مشفر
    role ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول فئات المنتجات
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول المنتجات
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    category_id VARCHAR(36) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    discount_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- جدول خيارات المنتجات
CREATE TABLE product_options (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('single', 'multiple') NOT NULL DEFAULT 'single',
    required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- جدول خيارات المنتجات المتاحة
CREATE TABLE option_choices (
    id VARCHAR(36) PRIMARY KEY,
    option_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (option_id) REFERENCES product_options(id) ON DELETE CASCADE
);

-- جدول الطلبات
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'processing', 'preparing', 'delivering', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    coins_used INT DEFAULT 0,
    coins_earned INT DEFAULT 0,
    address TEXT NOT NULL,
    payment_method ENUM('cash', 'card', 'wallet') NOT NULL DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول عناصر الطلب
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- جدول خيارات عناصر الطلب
CREATE TABLE order_item_options (
    id VARCHAR(36) PRIMARY KEY,
    order_item_id VARCHAR(36) NOT NULL,
    option_id VARCHAR(36) NOT NULL,
    choice_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES product_options(id),
    FOREIGN KEY (choice_id) REFERENCES option_choices(id)
);

-- جدول البطاقات
CREATE TABLE cards (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    type ENUM('reward', 'gift', 'coins') NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    background_color VARCHAR(20) DEFAULT '#ffffff',
    text_color VARCHAR(20) DEFAULT '#000000',
    is_active BOOLEAN DEFAULT TRUE,
    owner_id VARCHAR(36),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- جدول بطاقات المكافآت
CREATE TABLE reward_cards (
    card_id VARCHAR(36) PRIMARY KEY,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- جدول مراحل بطاقات المكافآت
CREATE TABLE reward_stages (
    id VARCHAR(36) PRIMARY KEY,
    card_id VARCHAR(36) NOT NULL,
    required INT NOT NULL,
    reward VARCHAR(100) NOT NULL,
    reward_type ENUM('gift', 'discount') NOT NULL DEFAULT 'gift',
    discount_value INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES reward_cards(card_id) ON DELETE CASCADE
);

-- جدول طوابع بطاقات المكافآت
CREATE TABLE reward_stamps (
    id VARCHAR(36) PRIMARY KEY,
    card_id VARCHAR(36) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT FALSE,
    activated_by VARCHAR(36),
    activated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES reward_cards(card_id) ON DELETE CASCADE,
    FOREIGN KEY (activated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- جدول بطاقات الهدايا
CREATE TABLE gift_cards (
    card_id VARCHAR(36) PRIMARY KEY,
    gift_type ENUM('gift', 'discount') NOT NULL DEFAULT 'gift',
    discount_value INT,
    image_url VARCHAR(255),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- جدول بطاقات الكوينز
CREATE TABLE coins_cards (
    card_id VARCHAR(36) PRIMARY KEY,
    coins_amount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- جدول معاملات الكوينز
CREATE TABLE coins_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount INT NOT NULL,
    type ENUM('earned', 'spent', 'received', 'sent') NOT NULL,
    description TEXT,
    related_id VARCHAR(36), -- معرف الطلب أو المستخدم المرتبط بالمعاملة
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- جدول البطاقات المستخدمة في الطلبات
CREATE TABLE order_cards (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    card_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES cards(id)
);

-- إدخال بيانات اختبار للمستخدمين
INSERT INTO users (id, name, phone, email, pin, coins_balance) VALUES
('user1', 'أحمد محمد', '0512345678', 'ahmed@example.com', '$2a$10$1234567890123456789012', 500),
('user2', 'فاطمة علي', '0523456789', 'fatima@example.com', '$2a$10$1234567890123456789012', 300),
('user3', 'محمد عبدالله', '0534567890', 'mohammed@example.com', '$2a$10$1234567890123456789012', 750);

-- إدخال بيانات اختبار للمسؤولين
INSERT INTO admins (id, name, username, password, role) VALUES
('admin1', 'مدير النظام', 'admin', '$2a$10$1234567890123456789012', 'admin'),
('admin2', 'مدير المبيعات', 'manager', '$2a$10$1234567890123456789012', 'manager'),
('admin3', 'موظف خدمة العملاء', 'staff', '$2a$10$1234567890123456789012', 'staff');

-- إدخال بيانات اختبار للفئات
INSERT INTO categories (id, name, image, description) VALUES
('cat1', 'برجر', 'https://example.com/burger.jpg', 'تشكيلة متنوعة من البرجر'),
('cat2', 'بيتزا', 'https://example.com/pizza.jpg', 'بيتزا طازجة بعجينة إيطالية أصلية'),
('cat3', 'مشروبات', 'https://example.com/drinks.jpg', 'مشروبات باردة وساخنة'),
('cat4', 'حلويات', 'https://example.com/desserts.jpg', 'حلويات شرقية وغربية');

-- إدخال بيانات اختبار للمنتجات
INSERT INTO products (id, name, description, price, image, category_id, is_available, is_popular) VALUES
('prod1', 'برجر لحم', 'برجر لحم بقري طازج مع جبنة وخضروات', 35.00, 'https://example.com/beef-burger.jpg', 'cat1', TRUE, TRUE),
('prod2', 'برجر دجاج', 'برجر دجاج مقرمش مع صلصة خاصة', 30.00, 'https://example.com/chicken-burger.jpg', 'cat1', TRUE, FALSE),
('prod3', 'بيتزا مارجريتا', 'بيتزا مارجريتا بالجبنة والطماطم', 45.00, 'https://example.com/margherita.jpg', 'cat2', TRUE, TRUE),
('prod4', 'بيتزا خضار', 'بيتزا بالخضروات الطازجة', 50.00, 'https://example.com/veggie-pizza.jpg', 'cat2', TRUE, FALSE),
('prod5', 'كولا', 'مشروب غازي منعش', 8.00, 'https://example.com/cola.jpg', 'cat3', TRUE, TRUE),
('prod6', 'عصير برتقال', 'عصير برتقال طازج', 15.00, 'https://example.com/orange-juice.jpg', 'cat3', TRUE, FALSE);

-- إدخال بيانات اختبار لخيارات المنتجات
INSERT INTO product_options (id, product_id, name, type, required) VALUES
('opt1', 'prod1', 'الحجم', 'single', TRUE),
('opt2', 'prod1', 'إضافات', 'multiple', FALSE),
('opt3', 'prod3', 'الحجم', 'single', TRUE),
('opt4', 'prod3', 'إضافات', 'multiple', FALSE);

-- إدخال بيانات اختبار لخيارات المنتجات المتاحة
INSERT INTO option_choices (id, option_id, name, price) VALUES
('ch1', 'opt1', 'صغير', 0.00),
('ch2', 'opt1', 'وسط', 5.00),
('ch3', 'opt1', 'كبير', 10.00),
('ch4', 'opt2', 'جبنة إضافية', 5.00),
('ch5', 'opt2', 'صلصة حارة', 3.00),
('ch6', 'opt3', 'صغير', 0.00),
('ch7', 'opt3', 'وسط', 10.00),
('ch8', 'opt3', 'كبير', 20.00),
('ch9', 'opt4', 'جبنة إضافية', 8.00),
('ch10', 'opt4', 'فلفل حار', 5.00);

-- إدخال بيانات اختبار للطلبات
INSERT INTO orders (id, order_number, user_id, status, total, coins_earned, address, payment_method, notes) VALUES
('ord1', 'ORD-1001', 'user1', 'completed', 80.00, 8, 'شارع الملك فهد، الرياض', 'cash', 'الرجاء عدم وضع البصل'),
('ord2', 'ORD-1002', 'user2', 'delivering', 65.00, 6, 'شارع التحلية، جدة', 'card', NULL),
('ord3', 'ORD-1003', 'user3', 'preparing', 120.00, 12, 'شارع الأمير سلطان، الدمام', 'wallet', 'توصيل سريع');

-- إدخال بيانات اختبار لعناصر الطلب
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
('item1', 'ord1', 'prod1', 2, 35.00),
('item2', 'ord1', 'prod5', 1, 8.00),
('item3', 'ord2', 'prod2', 1, 30.00),
('item4', 'ord2', 'prod5', 2, 8.00),
('item5', 'ord2', 'prod6', 1, 15.00),
('item6', 'ord3', 'prod3', 2, 45.00),
('item7', 'ord3', 'prod6', 2, 15.00);

-- إدخال بيانات اختبار لخيارات عناصر الطلب
INSERT INTO order_item_options (id, order_item_id, option_id, choice_id) VALUES
('oio1', 'item1', 'opt1', 'ch2'),
('oio2', 'item1', 'opt2', 'ch4'),
('oio3', 'item6', 'opt3', 'ch7'),
('oio4', 'item6', 'opt4', 'ch9');

-- إدخال بيانات اختبار للبطاقات
INSERT INTO cards (id, code, type, title, description, background_color, text_color, is_active, owner_id, expiry_date) VALUES
('card1', '1234567', 'reward', 'بطاقة البرجر', 'اجمع الطوابع واحصل على برجر مجاني', '#10b981', '#ffffff', TRUE, 'user1', '2023-12-31'),
('card2', '7654321', 'reward', 'بطاقة البيتزا', 'اجمع الطوابع واحصل على بيتزا مجانية', '#3b82f6', '#ffffff', TRUE, 'user1', '2023-12-31'),
('card3', '12345', 'gift', 'بطاقة هدية عيد الفطر', NULL, '#8b5cf6', '#ffffff', TRUE, 'user1', '2023-12-31'),
('card4', '123456', 'coins', 'بطاقة كوينز ترحيبية', NULL, '#f59e0b', '#ffffff', TRUE, 'user1', '2023-12-31'),
('card5', '54321', 'gift', 'بطاقة هدية رمضان', NULL, '#ef4444', '#ffffff', TRUE, 'user2', '2023-12-31'),
('card6', '654321', 'coins', 'بطاقة كوينز هدية', NULL, '#8b5cf6', '#ffffff', TRUE, 'user3', '2023-12-31');

-- إدخال بيانات اختبار لبطاقات المكافآت
INSERT INTO reward_cards (card_id) VALUES
('card1'),
('card2');

-- إدخال بيانات اختبار لمراحل بطاقات المكافآت
INSERT INTO reward_stages (id, card_id, required, reward, reward_type, discount_value) VALUES
('stage1', 'card1', 5, 'برجر مجاني', 'gift', NULL),
('stage2', 'card1', 10, 'وجبة برجر كاملة', 'gift', NULL),
('stage3', 'card2', 8, 'بيتزا مجانية', 'gift', NULL);

-- إدخال بيانات اختبار لطوابع بطاقات المكافآت
INSERT INTO reward_stamps (id, card_id, code, is_active, activated_by, activated_at) VALUES
('s1', 'card1', '123456', TRUE, 'user1', '2023-06-01 12:00:00'),
('s2', 'card1', '234567', TRUE, 'user1', '2023-06-05 14:30:00'),
('s3', 'card1', '345678', TRUE, 'user1', '2023-06-10 10:15:00'),
('s4', 'card1', '456789', FALSE, NULL, NULL),
('s5', 'card1', '567890', FALSE, NULL, NULL),
('s6', 'card2', '111111', TRUE, 'user1', '2023-06-15 09:45:00'),
('s7', 'card2', '222222', FALSE, NULL, NULL),
('s8', 'card2', '333333', FALSE, NULL, NULL),
('s9', 'card2', '444444', FALSE, NULL, NULL),
('s10', 'card2', '555555', FALSE, NULL, NULL),
('s11', 'card2', '666666', FALSE, NULL, NULL),
('s12', 'card2', '777777', FALSE, NULL, NULL),
('s13', 'card2', '888888', FALSE, NULL, NULL);

-- إدخال بيانات اختبار لبطاقات الهدايا
INSERT INTO gift_cards (card_id, gift_type, discount_value, image_url) VALUES
('card3', 'discount', 20, 'https://example.com/gift-card.jpg'),
('card5', 'gift', NULL, 'https://example.com/ramadan-card.jpg');

-- إدخال بيانات اختبار لبطاقات الكوينز
INSERT INTO coins_cards (card_id, coins_amount) VALUES
('card4', 500),
('card6', 1000);

-- إدخال بيانات اختبار لمعاملات الكوينز
INSERT INTO coins_transactions (id, user_id, amount, type, description, related_id) VALUES
('tx1', 'user1', 50, 'earned', 'مكافأة على الطلب #ORD-1001', 'ord1'),
('tx2', 'user1', 100, 'spent', 'خصم على الطلب #ORD-1002', 'ord2'),
('tx3', 'user1', 200, 'sent', 'تحويل إلى فاطمة علي', 'user2'),
('tx4', 'user2', 200, 'received', 'تحويل من أحمد محمد', 'user1'),
('tx5', 'user3', 100, 'earned', 'مكافأة على الطلب #ORD-1003', 'ord3');