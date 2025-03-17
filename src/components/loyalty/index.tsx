import React from "react";
import Layout from "../layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Gift, Plus, Award, Clock } from "lucide-react";
import { Progress } from "../ui/progress";

const LoyaltyPage = () => {
  const giftCards = [
    {
      id: "1",
      title: "بطاقة هدية وجبة غداء",
      code: "LUNCH-1234",
      expiryDate: "2023-12-31",
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
    },
    {
      id: "2",
      title: "بطاقة هدية قهوة",
      code: "COFFEE-5678",
      expiryDate: "2023-12-31",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
    },
  ];

  const rewards = [
    {
      id: "1",
      title: "برجر مجاني",
      description: "احصل على برجر مجاني مع طلبك القادم",
      stages: [
        { requiredStamps: 5, currentStamps: 3, reward: "برجر مجاني" },
        { requiredStamps: 10, currentStamps: 1, reward: "وجبة برجر كاملة" },
        { requiredStamps: 15, currentStamps: 0, reward: "وجبة عائلية" },
      ],
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    },
    {
      id: "2",
      title: "بطاطس مجانية",
      description: "احصل على بطاطس مجانية مع أي ساندويتش",
      stages: [
        { requiredStamps: 3, currentStamps: 2, reward: "بطاطس صغيرة" },
        { requiredStamps: 6, currentStamps: 0, reward: "بطاطس كبيرة" },
        { requiredStamps: 9, currentStamps: 0, reward: "بطاطس مع جبنة" },
      ],
      image:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&q=80",
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">برنامج الولاء</h1>

        <Tabs defaultValue="gift-cards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="gift-cards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              بطاقات الهدايا
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              المكافآت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gift-cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {giftCards.map((card) => (
                <Card
                  key={card.id}
                  style={{ backgroundColor: card.backgroundColor }}
                  className="overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <CardTitle style={{ color: card.textColor }}>
                      {card.title}
                    </CardTitle>
                    <CardDescription style={{ color: `${card.textColor}99` }}>
                      رقم البطاقة: {card.code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div
                      className="flex items-center"
                      style={{ color: card.textColor }}
                    >
                      <Gift className="h-5 w-5 mr-2" />
                      <span>صالحة حتى: {card.expiryDate}</span>
                    </div>
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
                      استخدام البطاقة
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {/* Add Gift Card Button */}
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-full">
                <Plus className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">إضافة بطاقة هدية</p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => (window.location.href = "/cards")}
                >
                  إضافة بطاقة
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div
              className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {rewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="overflow-hidden flex-shrink-0 w-[300px] snap-start"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reward.stages.map((stage, stageIndex) => (
                      <div key={stageIndex} className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">
                            المرحلة {stageIndex + 1}: {stage.reward}
                          </span>
                          <span>
                            {stage.currentStamps} / {stage.requiredStamps}
                          </span>
                        </div>
                        <Progress
                          value={
                            (stage.currentStamps / stage.requiredStamps) * 100
                          }
                          className="h-2 mb-2"
                        />
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: stage.requiredStamps }).map(
                            (_, index) => (
                              <div
                                key={index}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${index < stage.currentStamps ? "bg-primary text-white" : "bg-gray-200"}`}
                              >
                                {index < stage.currentStamps ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M3 15a7.5 7.5 0 1 0 15 0" />
                                    <path d="M13 3h7v7" />
                                    <path d="m16 10-5.5 5.5" />
                                  </svg>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // Create stamp activation dialog
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
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M3 15a7.5 7.5 0 1 0 15 0" />
                          <path d="M13 3h7v7" />
                          <path d="m16 10-5.5 5.5" />
                        </svg>
                        إضافة طابع
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={
                        reward.stages[0].currentStamps <
                        reward.stages[0].requiredStamps
                      }
                      variant={
                        reward.stages[0].currentStamps >=
                        reward.stages[0].requiredStamps
                          ? "default"
                          : "outline"
                      }
                    >
                      {reward.stages[0].currentStamps >=
                      reward.stages[0].requiredStamps
                        ? "استبدال المكافأة"
                        : "استبدال المكافأة"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LoyaltyPage;
