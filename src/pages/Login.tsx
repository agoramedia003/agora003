import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Lock, Phone } from "lucide-react";
import userApi from "../services/api/userApi";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || !pin) {
      setError("يرجى إدخال رقم الهاتف والرمز السري");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would call the API
      // const response = await userApi.login({ phone, pin });

      // Mock successful login
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ name: "مستخدم", phone }));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-6">
          <div className="w-24 h-24 mb-4">
            <img
              src="/logo.png"
              alt="شعار التطبيق"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-center">تسجيل الدخول</h1>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pr-10 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="password"
                  placeholder="الرمز السري"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pr-10 text-right"
                  maxLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="text-center mt-4">
              <Button
                variant="link"
                className="text-primary"
                onClick={() => navigate("/register")}
              >
                ليس لديك حساب؟ سجل الآن
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
