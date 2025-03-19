import React, { useState, useEffect } from "react";
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
import { Gift, Plus, Award, Clock, CreditCard } from "lucide-react";
import { Progress } from "../ui/progress";
import CardActivation from "./CardActivation";
import StampActivation from "./StampActivation";
import CardDiscovery from "./CardDiscovery";
import CardDetails from "./CardDetails";
import { RewardCard, GiftCard, CoinsCard } from "../../types/loyalty";

const LoyaltyPage = () => {
  const [activeTab, setActiveTab] = useState("gift-cards");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Mock data for gift cards
  const giftCards = [
    {
      id: "1",
      title: "بطاقة هدية وجبة غداء",
      code: "LUNCH-1234",
      expiryDate: "2023-12-31",
      backgroundColor: "#4f46e5",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user123",
      type: "gift" as const,
      giftType: "gift" as const,
    },
    {
      id: "2",
      title: "بطاقة هدية قهوة",
      code: "COFFEE-5678",
      expiryDate: "2023-12-31",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user123",
      type: "gift" as const,
      giftType: "discount" as const,
      discountValue: 20,
    },
  ];

  // Mock data for rewards
  const rewards = [
    {
      id: "1",
      title: "برجر مجاني",
      description: "احصل على برجر مجاني مع طلبك القادم",
      type: "reward" as const,
      code: "BURGER-123",
      expiryDate: "2023-12-31",
      backgroundColor: "#f59e0b",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user123",
      stages: [
        {
          required: 5,
          current: 3,
          reward: "برجر مجاني",
          rewardType: "gift" as const,
        },
        {
          required: 10,
          current: 3,
          reward: "وجبة برجر كاملة",
          rewardType: "gift" as const,
        },
        {
          required: 15,
          current: 3,
          reward: "وجبة عائلية",
          rewardType: "gift" as const,
        },
      ],
      stamps: [
        {
          id: "s1",
          cardId: "1",
          code: "123456",
          isActive: true,
          activatedBy: "user123",
          activatedAt: "2023-06-01",
        },
        {
          id: "s2",
          cardId: "1",
          code: "234567",
          isActive: true,
          activatedBy: "user123",
          activatedAt: "2023-06-05",
        },
        {
          id: "s3",
          cardId: "1",
          code: "345678",
          isActive: true,
          activatedBy: "user123",
          activatedAt: "2023-06-10",
        },
        { id: "s4", cardId: "1", code: "456789", isActive: false },
        { id: "s5", cardId: "1", code: "567890", isActive: false },
      ],
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
    },
    {
      id: "2",
      title: "بطاطس مجانية",
      description: "احصل على بطاطس مجانية مع أي ساندويتش",
      type: "reward" as const,
      code: "FRIES-456",
      expiryDate: "2023-12-31",
      backgroundColor: "#ef4444",
      textColor: "#ffffff",
      isActive: true,
      ownerId: "user123",
      stages: [
        {
          required: 3,
          current: 2,
          reward: "بطاطس صغيرة",
          rewardType: "gift" as const,
        },
        {
          required: 6,
          current: 2,
          reward: "بطاطس كبيرة",
          rewardType: "gift" as const,
        },
        {
          required: 9,
          current: 2,
          reward: "بطاطس مع جبنة",
          rewardType: "gift" as const,
        },
      ],
      stamps: [
        {
          id: "s6",
          cardId: "2",
          code: "111111",
          isActive: true,
          activatedBy: "user123",
          activatedAt: "2023-06-15",
        },
        {
          id: "s7",
          cardId: "2",
          code: "222222",
          isActive: true,
          activatedBy: "user123",
          activatedAt: "2023-06-16",
        },
        { id: "s8", cardId: "2", code: "333333", isActive: false },
        { id: "s9", cardId: "2", code: "444444", isActive: false },
        { id: "s10", cardId: "2", code: "555555", isActive: false },
        { id: "s11", cardId: "2", code: "666666", isActive: false },
        { id: "s12", cardId: "2", code: "777777", isActive: false },
        { id: "s13", cardId: "2", code: "888888", isActive: false },
      ],
      image:
        "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=300&q=80",
    },
  ];

  const handleActivateCard = async (code: string) => {
    // In a real app, this would be an API call
    console.log("Activating card with code:", code);

    // Mock implementation
    return new Promise<{ success: boolean; message: string; card?: any }>(
      (resolve) => {
        setTimeout(() => {
          // Simulate card already in use
          if (code === "9999999") {
            resolve({ success: false, message: "هذه البطاقة مستخدمة من قبل" });
            return;
          }

          // Simulate invalid code
          if (code.length < 5) {
            resolve({ success: false, message: "رمز البطاقة غير صالح" });
            return;
          }

          // Simulate success
          resolve({ success: true, message: "تم تفعيل البطاقة بنجاح" });
        }, 1000);
      },
    );
  };

  const handleActivateStamp = async (cardId: string, code: string) => {
    // In a real app, this would be an API call
    console.log("Activating stamp with code:", code, "for card:", cardId);

    // Mock implementation
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        // Simulate invalid code
        if (code.length < 5) {
          resolve({ success: false, message: "رمز الطابع غير صالح" });
          return;
        }

        // Simulate success
        resolve({ success: true, message: "تم تفعيل الطابع بنجاح" });
      }, 1000);
    });
  };

  const handleDiscoverCard = async (code: string) => {
    // In a real app, this would be an API call
    console.log("Discovering card with code:", code);

    // Mock implementation
    return new Promise<{ success: boolean; message: string; card?: any }>(
      (resolve) => {
        setTimeout(() => {
          // Simulate invalid code
          if (code.length < 5) {
            resolve({ success: false, message: "رمز البطاقة غير صالح" });
            return;
          }

          // Simulate card already in use
          if (code === "9999999") {
            resolve({ success: false, message: "هذه البطاقة مستخدمة من قبل" });
            return;
          }

          // Simulate discovering a new card
          const discoveredCard = {
            id: `discover-${Date.now()}`,
            title: "بطاقة مكتشفة",
            type: "reward" as const,
            code: code,
            expiryDate: "2023-12-31",
            backgroundColor: "#10b981",
            textColor: "#ffffff",
            isActive: false, // Not activated yet
            stages: [
              {
                required: 5,
                current: 0,
                reward: "هدية مجانية",
                rewardType: "gift" as const,
              },
            ],
            stamps: Array(5)
              .fill(0)
              .map((_, i) => ({
                id: `stamp-${Date.now()}-${i}`,
                cardId: `discover-${Date.now()}`,
                code: Math.floor(100000 + Math.random() * 900000).toString(),
                isActive: false,
              })),
          };

          resolve({
            success: true,
            message: "تم العثور على البطاقة",
            card: discoveredCard,
          });
        }, 1000);
      },
    );
  };

  const handleAddToAccount = async (cardId: string) => {
    // In a real app, this would be an API call
    console.log("Adding card to account:", cardId);

    // Mock implementation
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "تمت إضافة البطاقة إلى حسابك بنجاح",
        });
      }, 1000);
    });
  };

  const handleUseCard = (cardId: string) => {
    console.log("Using card:", cardId);
    // In a real app, this would open a dialog to confirm using the card
  };

  const handleOpenStampActivation = (cardId: string) => {
    setSelectedCardId(cardId);
    setActiveTab("rewards");
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">برنامج الولاء</h1>

        <Tabs
          defaultValue="gift-cards"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="gift-cards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              بطاقات الهدايا
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              المكافآت
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              اكتشاف البطاقات
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
                      onClick={() => handleUseCard(card.id)}
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
                  onClick={() => setActiveTab("discover")}
                >
                  إضافة بطاقة
                </Button>
              </Card>
            </div>

            <div className="mt-8">
              <CardActivation onActivateCard={handleActivateCard} />
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
                            {reward.stamps.filter((s) => s.isActive).length} /{" "}
                            {stage.required}
                          </span>
                        </div>
                        <Progress
                          value={
                            (reward.stamps.filter((s) => s.isActive).length /
                              stage.required) *
                            100
                          }
                          className="h-2 mb-2"
                        />
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: stage.required }).map(
                            (_, index) => (
                              <div
                                key={index}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${index < reward.stamps.filter((s) => s.isActive).length ? "bg-primary text-white" : "bg-gray-200"}`}
                              >
                                {index <
                                reward.stamps.filter((s) => s.isActive)
                                  .length ? (
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
                        onClick={() => setSelectedCardId(reward.id)}
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
                        reward.stamps.filter((s) => s.isActive).length <
                        reward.stages[0].required
                      }
                      variant={
                        reward.stamps.filter((s) => s.isActive).length >=
                        reward.stages[0].required
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleUseCard(reward.id)}
                    >
                      {reward.stamps.filter((s) => s.isActive).length >=
                      reward.stages[0].required
                        ? "استبدال المكافأة"
                        : "استبدال المكافأة"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {selectedCardId && (
              <div className="mt-8">
                <StampActivation
                  cardId={selectedCardId}
                  onActivateStamp={handleActivateStamp}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-4">
            <div className="max-w-md mx-auto">
              <CardDiscovery
                onDiscoverCard={handleDiscoverCard}
                onAddToAccount={handleAddToAccount}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LoyaltyPage;
