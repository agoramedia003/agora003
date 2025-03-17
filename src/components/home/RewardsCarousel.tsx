import React from "react";
import { Gift, Award } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  requiredStamps: number;
  currentStamps: number;
  image: string;
}

interface RewardsCarouselProps {
  rewards?: RewardItem[];
  title?: string;
}

const RewardsCarousel = ({
  rewards = [
    {
      id: "1",
      title: "Free Burger",
      description: "Get a free burger with your next order",
      requiredStamps: 5,
      currentStamps: 3,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    },
    {
      id: "2",
      title: "Free Fries",
      description: "Get free fries with any sandwich purchase",
      requiredStamps: 3,
      currentStamps: 2,
      image:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&q=80",
    },
    {
      id: "3",
      title: "50% Off Meal",
      description: "Get 50% off your next meal",
      requiredStamps: 8,
      currentStamps: 4,
      image:
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&q=80",
    },
    {
      id: "4",
      title: "Free Dessert",
      description: "Get a free dessert with any meal purchase",
      requiredStamps: 4,
      currentStamps: 1,
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80",
    },
  ],
  title = "Rewards",
}: RewardsCarouselProps) => {
  return (
    <div className="w-full bg-gray-100 p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <Award className="h-6 w-6 mr-2 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {rewards.map((reward) => (
            <CarouselItem key={reward.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardHeader className="p-4">
                  <div
                    className="w-full h-40 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${reward.image})` }}
                  />
                  <CardTitle className="mt-3">{reward.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600">{reward.description}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        {reward.currentStamps} / {reward.requiredStamps} stamps
                      </span>
                      <span className="text-primary font-medium">
                        {Math.round(
                          (reward.currentStamps / reward.requiredStamps) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (reward.currentStamps / reward.requiredStamps) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    variant={
                      reward.currentStamps >= reward.requiredStamps
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      if (reward.currentStamps >= reward.requiredStamps) {
                        // Redeem reward logic
                        console.log("Redeeming reward:", reward);
                      } else {
                        // Open stamp dialog
                        const dialog = document.createElement("dialog");
                        dialog.className =
                          "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50";
                        dialog.innerHTML = `
                          <div class="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 class="text-lg font-medium mb-4">إضافة طابع</h3>
                            <p class="text-sm text-gray-500 mb-4">أدخل رمز تفعيل الطابع</p>
                            <input type="text" id="stampCode" class="w-full p-2 border rounded-md mb-4" placeholder="أدخل رمز التفعيل">
                            <div class="flex justify-end gap-2">
                              <button id="cancelBtn" class="px-4 py-2 border rounded-md">إلغاء</button>
                              <button id="confirmBtn" class="px-4 py-2 bg-primary text-white rounded-md">تأكيد</button>
                            </div>
                          </div>
                        `;
                        document.body.appendChild(dialog);
                        dialog.showModal();

                        document
                          .getElementById("cancelBtn")
                          ?.addEventListener("click", () => {
                            dialog.close();
                            document.body.removeChild(dialog);
                          });

                        document
                          .getElementById("confirmBtn")
                          ?.addEventListener("click", () => {
                            const code = (
                              document.getElementById(
                                "stampCode",
                              ) as HTMLInputElement
                            )?.value;
                            if (code && code.length > 0) {
                              dialog.innerHTML = `
                              <div class="bg-white rounded-lg p-6 w-full max-w-md">
                                <div class="flex items-center justify-center text-green-500 mb-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <h3 class="text-lg font-medium text-center mb-2">تم بنجاح!</h3>
                                <p class="text-sm text-gray-500 text-center">تم إضافة طابع بنجاح</p>
                              </div>
                            `;
                              setTimeout(() => {
                                dialog.close();
                                document.body.removeChild(dialog);
                              }, 2000);
                            }
                          });
                      }
                    }}
                    disabled={false}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    {reward.currentStamps >= reward.requiredStamps
                      ? "استبدال المكافأة"
                      : "إضافة طابع"}
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 sm:-left-6" />
        <CarouselNext className="-right-4 sm:-right-6" />
      </Carousel>
    </div>
  );
};

export default RewardsCarousel;
