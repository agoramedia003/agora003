import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Phone, Lock, ArrowRight, UtensilsCrossed } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleLogin = () => {
    // Reset error
    setError(null);

    // Validate phone number and PIN
    if (!phoneNumber || phoneNumber.length < 9) {
      setError("يرجى إدخال رقم هاتف صحيح");
      return;
    }

    if (!pin || pin.length !== 4) {
      setError("يرجى إدخال رمز PIN مكون من 4 أرقام");
      return;
    }

    // For demo purposes, accept any valid format
    // In a real app, you would validate against a backend
    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-white p-4 rounded-full">
              <UtensilsCrossed size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">وجباتي</h1>
          <p className="text-gray-600">تطبيق توصيل الوجبات السريعة</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                رقم الهاتف
              </Label>
              <div className="flex">
                <div className="bg-gray-100 border border-r-0 rounded-r-none rounded-md px-3 flex items-center text-gray-500">
                  +966
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="5XXXXXXXX"
                  className="rounded-r-none"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                رمز PIN
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Input
                    key={index}
                    type="password"
                    maxLength={1}
                    className="text-center"
                    value={pin[index] || ""}
                    readOnly
                  />
                ))}
              </div>
              <Input
                id="pin"
                type="password"
                className="opacity-0 h-0 m-0 p-0 absolute"
                value={pin}
                onChange={handlePinChange}
                autoComplete="off"
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "clear"].map(
                  (num, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={num === "clear" ? "destructive" : "outline"}
                      className="h-12"
                      onClick={() => {
                        if (num === "clear") {
                          setPin("");
                        } else if (num !== null && pin.length < 4) {
                          setPin((prev) => prev + num);
                        }
                      }}
                    >
                      {num === "clear" ? "مسح" : num}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogin}
            >
              <span>تسجيل الدخول</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
