import React from "react";
import Layout from "../layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MapPin, Phone, Mail, Clock, Info } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">من نحن</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                عن وجباتي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                وجباتي هو تطبيق متكامل لطلب الوجبات السريعة وتوصيلها للمكاتب مع
                نظام مكافآت وبطاقات هدايا. نحن نقدم خدمة توصيل سريعة وموثوقة مع
                ضمان جودة الطعام.
              </p>
              <p className="mb-4">
                تأسست وجباتي في عام 2023 بهدف تقديم تجربة طعام فريدة ومميزة
                لعملائنا. نحن نعمل مع أفضل المطاعم والطهاة لضمان تقديم أفضل
                الوجبات.
              </p>
              <p>
                نحن نؤمن بأن الطعام الجيد يجب أن يكون متاحًا للجميع، ولذلك نقدم
                مجموعة متنوعة من الخيارات لتناسب جميع الأذواق والميزانيات.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                ساعات العمل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>الأحد - الخميس</span>
                  <span>10:00 صباحًا - 11:00 مساءً</span>
                </div>
                <div className="flex justify-between">
                  <span>الجمعة</span>
                  <span>2:00 مساءً - 11:00 مساءً</span>
                </div>
                <div className="flex justify-between">
                  <span>السبت</span>
                  <span>12:00 ظهرًا - 11:00 مساءً</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              موقعنا
            </CardTitle>
            <CardDescription>
              يمكنك زيارتنا في موقعنا الرئيسي أو التواصل معنا عبر وسائل الاتصال
              المختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-lg mb-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=1200&q=80"
                alt="موقع المطعم"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">العنوان</h3>
                  <p className="text-gray-600">
                    شارع الملك فهد، الرياض، المملكة العربية السعودية
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-primary mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">رقم الهاتف</h3>
                  <p className="text-gray-600">+966 50 123 4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-primary mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">البريد الإلكتروني</h3>
                  <p className="text-gray-600">info@wajbati.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">كيف يمكنني طلب الطعام؟</h3>
                <p className="text-gray-600">
                  يمكنك طلب الطعام من خلال تصفح المتجر واختيار الوجبات التي ترغب
                  بها، ثم إضافتها إلى السلة وإكمال عملية الشراء.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">ما هي طرق الدفع المتاحة؟</h3>
                <p className="text-gray-600">
                  نحن نقبل الدفع عند الاستلام، بطاقات الائتمان، وكذلك يمكنك
                  استخدام رصيد الكوينز الخاص بك للحصول على خصومات.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  كيف يمكنني الحصول على الكوينز؟
                </h3>
                <p className="text-gray-600">
                  يمكنك الحصول على الكوينز من خلال طلب الطعام، المشاركة في
                  العروض الترويجية، أو من خلال بطاقات الهدايا.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">ما هي مدة التوصيل؟</h3>
                <p className="text-gray-600">
                  مدة التوصيل تتراوح بين 30-45 دقيقة حسب موقعك والازدحام.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AboutPage;
