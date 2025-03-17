import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import {
  ShoppingBag,
  Filter,
  Search,
  Plus,
  Minus,
  X,
  Star,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  coinsPrice: number;
  image: string;
  category: string;
  featured?: boolean;
}

interface Extra {
  id: string;
  name: string;
  price: number;
}

const StorePage = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const featuredScrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "all", name: "الكل", icon: ShoppingBag },
    { id: "burgers", name: "برجر", icon: ShoppingBag },
    { id: "pizza", name: "بيتزا", icon: ShoppingBag },
    { id: "sandwiches", name: "ساندويتش", icon: ShoppingBag },
    { id: "drinks", name: "مشروبات", icon: ShoppingBag },
    { id: "desserts", name: "حلويات", icon: ShoppingBag },
  ];

  const products: Product[] = [
    {
      id: "1",
      name: "برجر دجاج مقرمش",
      description: "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
      price: 45,
      discountPrice: 35,
      coinsPrice: 350,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      category: "burgers",
      featured: true,
    },
    {
      id: "2",
      name: "بيتزا خضار",
      description: "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
      price: 60,
      discountPrice: 45,
      coinsPrice: 450,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      category: "pizza",
      featured: true,
    },
    {
      id: "3",
      name: "شاورما لحم",
      description: "شاورما لحم مع صلصة طحينة وخضروات",
      price: 50,
      discountPrice: 38,
      coinsPrice: 380,
      image:
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&q=80",
      category: "sandwiches",
    },
    {
      id: "4",
      name: "عصير برتقال طازج",
      description: "عصير برتقال طازج 100%",
      price: 20,
      discountPrice: 15,
      coinsPrice: 150,
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
      category: "drinks",
      featured: true,
    },
    {
      id: "5",
      name: "كيك الشوكولاتة",
      description: "كيك الشوكولاتة الفاخر مع صوص الشوكولاتة",
      price: 30,
      discountPrice: 25,
      coinsPrice: 250,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
      category: "desserts",
    },
    {
      id: "6",
      name: "برجر لحم أنجوس",
      description: "برجر لحم أنجوس مع جبنة شيدر وصلصة خاصة",
      price: 55,
      discountPrice: 48,
      coinsPrice: 480,
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&q=80",
      category: "burgers",
    },
  ];

  const extras = [
    { id: "extra1", name: "جبنة إضافية", price: 5 },
    { id: "extra2", name: "صلصة حارة", price: 3 },
    { id: "extra3", name: "بصل مقرمش", price: 4 },
    { id: "extra4", name: "خبز إضافي", price: 2 },
  ];

  const featuredProducts = products.filter((product) => product.featured);
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedExtras([]);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleExtraToggle = (extra: Extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((item) => item.id === extra.id);
      if (exists) {
        return prev.filter((item) => item.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    const extrasTotal = selectedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0,
    );
    return (selectedProduct.discountPrice + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    // In a real app, you would dispatch this to your cart state
    console.log("Added to cart:", {
      product: selectedProduct,
      quantity,
      extras: selectedExtras,
      totalPrice: calculateTotalPrice(),
    });

    // Close the dialog and reset
    setSelectedProduct(null);

    // Navigate to cart
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ابحث عن منتج..."
              className="pl-10 pr-4 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Featured Products Carousel */}
        {featuredProducts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <Star className="h-4 w-4 text-amber-500 mr-2" />
              المنتجات المميزة
            </h2>
            <div
              ref={featuredScrollRef}
              className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {featuredProducts.map((product) => (
                <div
                  key={`featured-${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer flex-shrink-0 w-[280px] snap-start"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg">
                          {product.discountPrice} ر.س
                        </span>
                        {product.price > product.discountPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">
                            {product.price} ر.س
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4" />
                        <span>أضف</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.id}
                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer min-w-[80px] ${activeCategory === category.id ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CategoryIcon className="h-5 w-5 mb-1" />
                <span className="text-xs text-center">{category.name}</span>
              </div>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="h-32 sm:h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-medium mb-1 text-sm sm:text-base">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm sm:text-lg">
                      {product.discountPrice} ر.س
                    </span>
                    {product.price > product.discountPrice && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through mr-2">
                        {product.price} ر.س
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="flex items-center gap-1 text-xs">
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>أضف</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Customization Dialog */}
      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                {selectedProduct.description}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">الكمية</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>إضافات</Label>
                <div className="grid gap-2">
                  {extras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={extra.id}
                          checked={selectedExtras.some(
                            (item) => item.id === extra.id,
                          )}
                          onCheckedChange={() => handleExtraToggle(extra)}
                        />
                        <Label
                          htmlFor={extra.id}
                          className="text-sm font-normal"
                        >
                          {extra.name}
                        </Label>
                      </div>
                      <span className="text-sm">{extra.price} ر.س</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">الإجمالي:</span>
                <span className="font-bold text-lg">
                  {calculateTotalPrice()} ر.س
                </span>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleAddToCart}>
                إضافة إلى السلة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default StorePage;
