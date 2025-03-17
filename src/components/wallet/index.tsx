import React from "react";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Coins,
  ArrowRight,
  Send,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";

const WalletPage = () => {
  const transactions = [
    {
      id: "1",
      type: "add",
      amount: 500,
      date: "2023-06-15",
      description: "إضافة رصيد من بطاقة هدية",
    },
    {
      id: "2",
      type: "spend",
      amount: 250,
      date: "2023-06-20",
      description: "شراء وجبة برجر دجاج",
    },
    {
      id: "3",
      type: "receive",
      amount: 100,
      date: "2023-06-25",
      description: "استلام تحويل من أحمد",
    },
    {
      id: "4",
      type: "send",
      amount: 100,
      date: "2023-06-30",
      description: "تحويل إلى محمد",
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">محفظة الكوينز</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-amber-500" />
                رصيد الكوينز
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">1250</span>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-sm"
                    >
                      <Send className="h-4 w-4" />
                      تحويل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-sm"
                      onClick={() => (window.location.href = "/cards")}
                    >
                      <Plus className="h-4 w-4" />
                      إضافة رصيد
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  يمكنك استخدام الكوينز للحصول على خصومات وهدايا مجانية
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تحويل الكوينز</CardTitle>
              <CardDescription>أرسل الكوينز إلى مستخدم آخر</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  رقم الهاتف
                </label>
                <Input placeholder="أدخل رقم الهاتف" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  عدد الكوينز
                </label>
                <Input
                  type="number"
                  placeholder="أدخل عدد الكوينز"
                  min="1"
                  max="1250"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 1250) {
                      e.target.value = "1250";
                      alert("لا يمكن تحويل أكثر من رصيدك الحالي (1250 كوينز)");
                    }
                  }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                تحويل الكوينز
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>سجل المعاملات</CardTitle>
            <CardDescription>جميع معاملات الكوينز الخاصة بك</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="add">إضافات</TabsTrigger>
                <TabsTrigger value="spend">مشتريات</TabsTrigger>
                <TabsTrigger value="transfer">تحويلات</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {transactions.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </TabsContent>

              <TabsContent value="add" className="space-y-4">
                {transactions
                  .filter((t) => t.type === "add")
                  .map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="spend" className="space-y-4">
                {transactions
                  .filter((t) => t.type === "spend")
                  .map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="transfer" className="space-y-4">
                {transactions
                  .filter((t) => t.type === "receive" || t.type === "send")
                  .map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface Transaction {
  id: string;
  type: "add" | "spend" | "receive" | "send";
  amount: number;
  date: string;
  description: string;
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case "add":
        return <Plus className="h-5 w-5 text-green-500" />;
      case "spend":
        return <Coins className="h-5 w-5 text-amber-500" />;
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      default:
        return <Coins className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case "add":
      case "receive":
        return "text-green-600";
      case "spend":
      case "send":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  const getAmountPrefix = () => {
    switch (transaction.type) {
      case "add":
      case "receive":
        return "+";
      case "spend":
      case "send":
        return "-";
      default:
        return "";
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-gray-100 mr-3">{getIcon()}</div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className={`font-bold ${getAmountColor()}`}>
        {getAmountPrefix()}
        {transaction.amount}
      </div>
    </div>
  );
};

export default WalletPage;
