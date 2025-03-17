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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, MapPin, Lock, History, CreditCard } from "lucide-react";

const ProfilePage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">الملف الشخصي</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                    مح
                  </div>
                  <CardTitle>محمد أحمد</CardTitle>
                  <CardDescription>+966 50 123 4567</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">الرياض، السعودية</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">1250 كوينز</span>
                  </div>
                  <div className="flex items-center">
                    <History className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">عضو منذ يناير 2023</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    window.location.href = "/login";
                  }}
                >
                  تسجيل الخروج
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  المعلومات الشخصية
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  العنوان
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  كلمة المرور
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>
                      قم بتعديل معلوماتك الشخصية هنا
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">الاسم الأول</Label>
                        <Input id="firstName" defaultValue="محمد" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">الاسم الأخير</Label>
                        <Input id="lastName" defaultValue="أحمد" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="mohammed@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input id="phone" defaultValue="+966 50 123 4567" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>حفظ التغييرات</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="address">
                <Card>
                  <CardHeader>
                    <CardTitle>العنوان</CardTitle>
                    <CardDescription>
                      قم بتعديل عنوان التوصيل الخاص بك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">الشارع</Label>
                      <Input id="street" defaultValue="شارع الملك فهد" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة</Label>
                        <Input id="city" defaultValue="الرياض" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">الرمز البريدي</Label>
                        <Input id="postalCode" defaultValue="12345" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">معلومات إضافية</Label>
                      <Input
                        id="additionalInfo"
                        defaultValue="بجانب مسجد الملك فهد"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>حفظ العنوان</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                    <CardDescription>
                      قم بتغيير كلمة المرور الخاصة بك (4 أرقام)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        كلمة المرور الحالية
                      </Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>تغيير كلمة المرور</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
