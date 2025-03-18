import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import {
  ShoppingBag,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Utensils,
  Tag,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
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
import { Separator } from "../ui/separator";

interface Promotion {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  coinsPrice?: number;
  image: string;
  discountPercentage: number;
  category: string;
  components?: { name: string; quantity: number }[];
}

interface Extra {
  id: string;
  name: string;
  price: number;
}

const PromotionsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const bannerRef = useRef<HTMLDivElement>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

  const categories = [
    { id: "all", name: "الكل", icon: ShoppingBag },
    { id: "burgers", name: "برجر", icon: ShoppingBag },
    { id: "pizza", name: "بيتزا", icon: ShoppingBag },
    { id: "sandwiches", name: "ساندويتش", icon: ShoppingBag },
    { id: "drinks", name: "مشروبات", icon: ShoppingBag },
    { id: "desserts", name: "حلويات", icon: ShoppingBag },
  ];

  const extras: Extra[] = [
    { id: "extra1", name: "جبنة إضافية", price: 5 },
    { id: "extra2", name: "صلصة حارة", price: 3 },
    { id: "extra3", name: "بصل مقرمش", price: 4 },
    { id: "extra4", name: "خبز إضافي", price: 2 },
  ];

  const banners = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=1200&q=80",
      title: "خصم 30% على جميع الوجبات",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&q=80",
      title: "وجبات عائلية بأسعار مميزة",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
      title: "اطلب الآن واحصل على توصيل مجاني",
    },
  ];

  const promotions: Promotion[] = [
    {
      id: "1",
      title: "برجر دجاج مقرمش",
      description: "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
      originalPrice: 45,
      discountPrice: 30,
      coinsPrice: 300,
      discountPercentage: 33,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      category: "burgers",
      components: [
        { name: "خبز برجر", quantity: 1 },
        { name: "صدر دجاج مقرمش", quantity: 1 },
        { name: "خس", quantity: 1 },
        { name: "طماطم", quantity: 1 },
        { name: "صلصة خاصة", quantity: 1 },
      ],
    },
    {
      id: "2",
      title: "بيتزا خضار",
      description: "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
      originalPrice: 60,
      discountPrice: 40,
      coinsPrice: 400,
      discountPercentage: 33,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      category: "pizza",
      components: [
        { name: "عجينة بيتزا", quantity: 1 },
        { name: "صلصة طماطم", quantity: 1 },
        { name: "جبنة موزاريلا", quantity: 1 },
        { name: "فلفل", quantity: 1 },
        { name: "بصل", quantity: 1 },
        { name: "زيتون", quantity: 1 },
      ],
    },
    {
      id: "3",
      title: "شاورما لحم",
      description: "شاورما لحم مع صلصة طحينة وخضروات",
      originalPrice: 50,
      discountPrice: 35,
      coinsPrice: 350,
      discountPercentage: 30,
      image:
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&q=80",
      category: "sandwiches",
      components: [
        { name: "خبز صاج", quantity: 1 },
        { name: "لحم مشوي", quantity: 1 },
        { name: "طحينة", quantity: 1 },
        { name: "بصل", quantity: 1 },
        { name: "بقدونس", quantity: 1 },
      ],
    },
    {
      id: "4",
      title: "عصير برتقال طازج",
      description: "عصير برتقال طازج 100%",
      originalPrice: 20,
      discountPrice: 15,
      coinsPrice: 150,
      discountPercentage: 25,
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
      category: "drinks",
      components: [{ name: "برتقال طازج", quantity: 3 }],
    },
    {
      id: "5",
      title: "كيك الشوكولاتة",
      description: "كيك الشوكولاتة الفاخر مع صوص الشوكولاتة",
      originalPrice: 30,
      discountPrice: 20,
      coinsPrice: 200,
      discountPercentage: 33,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
      category: "desserts",
      components: [
        { name: "كيك شوكولاتة", quantity: 1 },
        { name: "صوص شوكولاتة", quantity: 1 },
        { name: "كريمة مخفوقة", quantity: 1 },
      ],
    },
    {
      id: "6",
      title: "برجر لحم أنجوس",
      description: "برجر لحم أنجوس مع جبنة شيدر وصلصة خاصة",
      originalPrice: 55,
      discountPrice: 40,
      coinsPrice: 400,
      discountPercentage: 27,
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&q=80",
      category: "burgers",
      components: [
        { name: "خبز برجر", quantity: 1 },
        { name: "لحم أنجوس", quantity: 1 },
        { name: "جبنة شيدر", quantity: 1 },
        { name: "خس", quantity: 1 },
        { name: "طماطم", quantity: 1 },
        { name: "بصل", quantity: 1 },
        { name: "صلصة خاصة", quantity: 1 },
      ],
    },
  ];

  const filteredPromotions =
    activeCategory === "all"
      ? promotions
      : promotions.filter((promo) => promo.category === activeCategory);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handlePromotionClick = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setQuantity(1);
    setSelectedExtras([]);
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
    if (!selectedPromotion) return 0;
    const extrasTotal = selectedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0,
    );
    return (selectedPromotion.discountPrice + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedPromotion) return;

    // In a real app, you would dispatch this to your cart state
    console.log("Added to cart:", {
      product: selectedPromotion,
      quantity,
      extras: selectedExtras,
      totalPrice: calculateTotalPrice(),
    });

    // Close the dialog
    setSelectedPromotion(null);

    // Show success message
    alert("تمت إضافة المنتج إلى السلة بنجاح");
  };

  return (
    <Layout>
      <div className="mb-6">
        {/* Banner Carousel */}
        <div className="mb-6">
          <Carousel className="w-full">
            <CarouselContent>
              {banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative h-[200px] md:h-[300px] w-full rounded-lg overflow-hidden">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                      <h2 className="text-white text-xl md:text-2xl font-bold">
                        {banner.title}
                      </h2>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>

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

        {/* Promotions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPromotions.map((promotion) => (
            <Card
              key={promotion.id}
              className="overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {promotion.discountPercentage}% خصم
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm mb-1">{promotion.title}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {promotion.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm">
                      {promotion.discountPrice} د.م
                    </span>
                    <span className="text-xs text-gray-500 line-through mr-2">
                      {promotion.originalPrice} د.م
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button
                  className="w-full text-xs flex items-center justify-center gap-1"
                  size="sm"
                  onClick={() => handlePromotionClick(promotion)}
                >
                  <ShoppingCart className="h-3 w-3" />
                  أضف إلى السلة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog
        open={!!selectedPromotion}
        onOpenChange={() => setSelectedPromotion(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPromotion?.title}</DialogTitle>
            <DialogDescription>
              {selectedPromotion?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <img
                src={selectedPromotion?.image}
                alt={selectedPromotion?.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-1">
                  <Tag className="h-4 w-4 text-primary" />
                  السعر
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">
                    {selectedPromotion?.discountPrice} د.م
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {selectedPromotion?.originalPrice} د.م
                  </span>
                </div>
                {selectedPromotion?.coinsPrice && (
                  <div className="flex items-center gap-1 text-amber-600 text-sm mt-1">
                    <Coins className="h-3 w-3" />
                    <span>{selectedPromotion.coinsPrice} كوينز</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  الخصم
                </h3>
                <div className="text-green-600 font-medium">
                  {selectedPromotion?.discountPercentage}% خصم
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <Utensils className="h-4 w-4 text-primary" />
                المكونات
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedPromotion?.components?.map((component, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md text-sm"
                  >
                    <span>{component.name}</span>
                    <span className="text-gray-500">x{component.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="quantity" className="flex items-center gap-1">
                الكمية
              </Label>
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
              <Label className="flex items-center gap-1">إضافات</Label>
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
                      <Label htmlFor={extra.id} className="text-sm font-normal">
                        {extra.name}
                      </Label>
                    </div>
                    <span className="text-sm">{extra.price} د.م</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">الإجمالي:</span>
              <span className="font-bold text-lg">
                {calculateTotalPrice()} د.م
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
    </Layout>
  );
};

export default PromotionsPage;
