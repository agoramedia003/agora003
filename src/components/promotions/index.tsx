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
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface Promotion {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  image: string;
  discountPercentage: number;
  category: string;
}

const PromotionsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const bannerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "all", name: "الكل", icon: ShoppingBag },
    { id: "burgers", name: "برجر", icon: ShoppingBag },
    { id: "pizza", name: "بيتزا", icon: ShoppingBag },
    { id: "sandwiches", name: "ساندويتش", icon: ShoppingBag },
    { id: "drinks", name: "مشروبات", icon: ShoppingBag },
    { id: "desserts", name: "حلويات", icon: ShoppingBag },
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
      discountPercentage: 33,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      category: "burgers",
    },
    {
      id: "2",
      title: "بيتزا خضار",
      description: "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
      originalPrice: 60,
      discountPrice: 40,
      discountPercentage: 33,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      category: "pizza",
    },
    {
      id: "3",
      title: "شاورما لحم",
      description: "شاورما لحم مع صلصة طحينة وخضروات",
      originalPrice: 50,
      discountPrice: 35,
      discountPercentage: 30,
      image:
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&q=80",
      category: "sandwiches",
    },
    {
      id: "4",
      title: "عصير برتقال طازج",
      description: "عصير برتقال طازج 100%",
      originalPrice: 20,
      discountPrice: 15,
      discountPercentage: 25,
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
      category: "drinks",
    },
    {
      id: "5",
      title: "كيك الشوكولاتة",
      description: "كيك الشوكولاتة الفاخر مع صوص الشوكولاتة",
      originalPrice: 30,
      discountPrice: 20,
      discountPercentage: 33,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
      category: "desserts",
    },
    {
      id: "6",
      title: "برجر لحم أنجوس",
      description: "برجر لحم أنجوس مع جبنة شيدر وصلصة خاصة",
      originalPrice: 55,
      discountPrice: 40,
      discountPercentage: 27,
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&q=80",
      category: "burgers",
    },
  ];

  const filteredPromotions =
    activeCategory === "all"
      ? promotions
      : promotions.filter((promo) => promo.category === activeCategory);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleAddToCart = (promotion: Promotion) => {
    // In a real app, you would dispatch this to your cart state
    console.log("Added to cart:", promotion);
    navigate("/cart");
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
                      {promotion.discountPrice} ر.س
                    </span>
                    <span className="text-xs text-gray-500 line-through mr-2">
                      {promotion.originalPrice} ر.س
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button
                  className="w-full text-xs flex items-center justify-center gap-1"
                  size="sm"
                  onClick={() => handleAddToCart(promotion)}
                >
                  <ShoppingCart className="h-3 w-3" />
                  أضف إلى السلة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PromotionsPage;
