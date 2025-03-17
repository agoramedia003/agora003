import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Clock, ShoppingCart } from "lucide-react";

interface FlashDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
  timeRemaining: string;
}

interface FlashDealsSectionProps {
  deals?: FlashDeal[];
  title?: string;
}

const FlashDealsSection = ({
  deals = [
    {
      id: "1",
      title: "وجبة برجر دجاج مع بطاطس",
      description: "برجر دجاج مقرمش مع صلصة خاصة وبطاطس مقلية",
      originalPrice: 45,
      discountPrice: 35,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      timeRemaining: "02:45:30",
    },
    {
      id: "2",
      title: "بيتزا خضار متوسطة",
      description: "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
      originalPrice: 60,
      discountPrice: 45,
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      timeRemaining: "01:30:00",
    },
    {
      id: "3",
      title: "وجبة شاورما لحم مع مشروب",
      description: "شاورما لحم مع صلصة طحينة ومشروب غازي",
      originalPrice: 50,
      discountPrice: 38,
      imageUrl:
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&q=80",
      timeRemaining: "03:15:45",
    },
  ],
  title = "عروض محدودة",
}: FlashDealsSectionProps) => {
  return (
    <section className="w-full py-8 bg-gray-100">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-right">{title}</h2>
          <Button variant="outline">عرض الكل</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden bg-white">
              <div className="relative h-48 w-full">
                <img
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round(
                    ((deal.originalPrice - deal.discountPrice) /
                      deal.originalPrice) *
                      100,
                  )}
                  % خصم
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-right">{deal.title}</CardTitle>
              </CardHeader>

              <CardContent className="text-right">
                <p className="text-gray-600 mb-2">{deal.description}</p>
                <div className="flex justify-end items-center gap-2 mb-2">
                  <span className="text-lg font-bold">
                    {deal.discountPrice} ر.س
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {deal.originalPrice} ر.س
                  </span>
                </div>
                <div className="flex items-center justify-end text-amber-600 gap-1">
                  <span className="text-sm">{deal.timeRemaining}</span>
                  <Clock className="h-4 w-4" />
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    // In a real app, you would dispatch this to your cart state
                    console.log("Added to cart:", {
                      product: deal,
                      quantity: 1,
                    });
                    // Navigate to cart
                    window.location.href = "/cart";
                  }}
                >
                  <span>أضف إلى السلة</span>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
