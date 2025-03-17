import React from "react";
import { useNavigate } from "react-router-dom";
import CoinsBalanceCard from "./home/CoinsBalanceCard";
import GiftCardsCarousel from "./home/GiftCardsCarousel";
import RewardsCarousel from "./home/RewardsCarousel";
import FlashDealsSection from "./home/FlashDealsSection";
import Layout from "./layout/Layout";
import { Button } from "./ui/button";
import { ShoppingBag, Clock } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <CoinsBalanceCard
          balance={1250}
          onSendCoins={() => handleNavigate("/wallet")}
          onViewHistory={() => handleNavigate("/wallet")}
        />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            مرحباً بك في تطبيق وجباتي
          </h2>
          <p className="text-gray-600 mb-4">
            استمتع بتجربة طلب الطعام مع برنامج الولاء الخاص بنا. اجمع الطوابع
            واحصل على مكافآت حصرية!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleNavigate("/store")}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              تصفح المتجر
            </Button>
            <Button variant="outline" onClick={() => handleNavigate("/orders")}>
              <Clock className="h-4 w-4 mr-2" />
              تتبع طلباتك
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <GiftCardsCarousel
          title="بطاقات الهدايا"
          onCardClick={(card) => handleNavigate(`/loyalty`)}
        />

        <RewardsCarousel title="المكافآت" />

        <FlashDealsSection title="عروض محدودة" />
      </div>
    </Layout>
  );
};

export default HomePage;
