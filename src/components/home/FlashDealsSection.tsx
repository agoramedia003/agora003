import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Clock, ShoppingCart, Plus, Minus, Utensils, Tag } from "lucide-react";
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

interface FlashDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  coinsPrice?: number;
  imageUrl: string;
  timeRemaining: string;
  components?: { name: string; quantity: number }[];
}

interface Extra {
  id: string;
  name: string;
  price: number;
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
      coinsPrice: 350,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      timeRemaining: "02:45:30",
      components: [
        { name: "برجر دجاج", quantity: 1 },
        { name: "بطاطس مقلية", quantity: 1 },
        { name: "صلصة خاصة", quantity: 1 },
      ],
    },
    {
      id: "2",
      title: "بيتزا خضار متوسطة",
      description: "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
      originalPrice: 60,
      discountPrice: 45,
      coinsPrice: 450,
      imageUrl:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80",
      timeRemaining: "01:30:00",
      components: [
        { name: "عجينة بيتزا", quantity: 1 },
        { name: "جبنة موزاريلا", quantity: 1 },
        { name: "خضروات مشكلة", quantity: 1 },
        { name: "صلصة طماطم", quantity: 1 },
      ],
    },
    {
      id: "3",
      title: "وجبة شاورما لحم مع مشروب",
      description: "شاورما لحم مع صلصة طحينة ومشروب غازي",
      originalPrice: 50,
      discountPrice: 38,
      coinsPrice: 380,
      imageUrl:
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&q=80",
      timeRemaining: "03:15:45",
      components: [
        { name: "خبز صاج", quantity: 1 },
        { name: "لحم مشوي", quantity: 1 },
        { name: "صلصة طحينة", quantity: 1 },
        { name: "خضروات", quantity: 1 },
        { name: "مشروب غازي", quantity: 1 },
      ],
    },
  ],
  title = "عروض محدودة",
}: FlashDealsSectionProps) => {
  const [selectedDeal, setSelectedDeal] = useState<FlashDeal | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

  const extras: Extra[] = [
    { id: "extra1", name: "جبنة إضافية", price: 5 },
    { id: "extra2", name: "صلصة حارة", price: 3 },
    { id: "extra3", name: "بصل مقرمش", price: 4 },
    { id: "extra4", name: "خبز إضافي", price: 2 },
  ];

  const handleDealClick = (deal: FlashDeal) => {
    setSelectedDeal(deal);
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
    if (!selectedDeal) return 0;
    const extrasTotal = selectedExtras.reduce(
      (sum, extra) => sum + extra.price,
      0,
    );
    return (selectedDeal.discountPrice + extrasTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedDeal) return;

    // In a real app, you would dispatch this to your cart state
    console.log("Added to cart:", {
      product: selectedDeal,
      quantity,
      extras: selectedExtras,
      totalPrice: calculateTotalPrice(),
    });

    // Close the dialog
    setSelectedDeal(null);

    // Show success message
    alert("تمت إضافة المنتج إلى السلة بنجاح");
  };

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
                    {deal.discountPrice} د.م
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {deal.originalPrice} د.م
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
                  onClick={() => handleDealClick(deal)}
                >
                  <span>عرض التفاصيل</span>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDeal?.title}</DialogTitle>
            <DialogDescription>{selectedDeal?.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <img
                src={selectedDeal?.imageUrl}
                alt={selectedDeal?.title}
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
                    {selectedDeal?.discountPrice} د.م
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {selectedDeal?.originalPrice} د.م
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  الوقت المتبقي
                </h3>
                <div className="text-amber-600">
                  {selectedDeal?.timeRemaining}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <Utensils className="h-4 w-4 text-primary" />
                المكونات
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedDeal?.components?.map((component, index) => (
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

            {selectedDeal?.coinsPrice && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <span>أو</span>
                <span className="font-bold">
                  {selectedDeal.coinsPrice} كوينز
                </span>
              </div>
            )}
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
    </section>
  );
};

export default FlashDealsSection;
