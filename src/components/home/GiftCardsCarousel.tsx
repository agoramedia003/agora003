import React from "react";
import { Gift, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GiftCard {
  id: string;
  title: string;
  value: number;
  image: string;
  backgroundColor: string;
  textColor: string;
}

interface GiftCardsCarouselProps {
  giftCards?: GiftCard[];
  title?: string;
  onCardClick?: (card: GiftCard) => void;
}

const GiftCardsCarousel = ({
  giftCards = [
    {
      id: "1",
      title: "Lunch Gift Card",
      value: 50,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
    },
    {
      id: "2",
      title: "Coffee Gift Card",
      value: 25,
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
    },
    {
      id: "3",
      title: "Breakfast Gift Card",
      value: 30,
      image:
        "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6b4?w=400&q=80",
      backgroundColor: "#f59e0b",
      textColor: "#ffffff",
    },
    {
      id: "4",
      title: "Dinner Gift Card",
      value: 100,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
      backgroundColor: "#ef4444",
      textColor: "#ffffff",
    },
  ],
  title = "Gift Cards",
  onCardClick = () => {},
}: GiftCardsCarouselProps) => {
  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <Button variant="ghost" className="text-sm flex items-center gap-1">
          View All <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {giftCards.map((card) => (
            <CarouselItem
              key={card.id}
              className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Card
                className="overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => onCardClick(card)}
                style={{ backgroundColor: card.backgroundColor }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle
                    className="text-lg"
                    style={{ color: card.textColor }}
                  >
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: card.textColor }}
                  >
                    ${card.value}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    style={{
                      borderColor: card.textColor,
                      color: card.textColor,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Activate
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4">
          <CarouselPrevious className="relative static translate-y-0 -left-0 mr-2" />
          <CarouselNext className="relative static translate-y-0 -right-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default GiftCardsCarousel;
