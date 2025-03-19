import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Gift,
  Award,
  Coins,
  Filter,
  Download,
  Calendar,
  Image as ImageIcon,
  Ban,
  Send,
  PlusCircle,
  MinusCircle,
  Stamp,
  MessageSquare,
} from "lucide-react";
import CardService, { AdminCardResponse } from "../../services/api/cardService";

interface CardData {
  id: string;
  cardNumber: string;
  type: "reward" | "gift" | "coins";
  status: "active" | "used" | "expired";
  creationDate: string;
  color: string;
  value?: number; // For gift and coins cards
  stamps?: number; // For reward cards
  title?: string;
  description?: string;
  ownerId?: string;
  ownerName?: string;
  expiryDate?: string;
  imageUrl?: string;
  giftType?: "discount" | "gift";
  discountValue?: number;
  stages?: {
    required: number;
    reward: string;
    rewardType: "discount" | "gift";
    discountValue?: number;
  }[];
  stampDetails?: {
    id: string;
    code: string;
    isActive: boolean;
    activatedBy?: string;
  }[];
}

interface StageForm {
  required: number;
  reward: string;
  rewardType: "discount" | "gift";
  discountValue?: number;
}

const CardsManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "reward" | "gift" | "coins"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "used" | "expired"
  >("all");

  // Dialog states
  const [showCreateCardDialog, setShowCreateCardDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeactivateConfirmation, setShowDeactivateConfirmation] =
    useState(false);
  const [showEditCardDialog, setShowEditCardDialog] = useState(false);
  const [showStampCodeDialog, setShowStampCodeDialog] = useState(false);

  // Form states
  const [cardType, setCardType] = useState<"reward" | "gift" | "coins">(
    "reward",
  );
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardCount, setCardCount] = useState("1");
  const [cardBackgroundColor, setCardBackgroundColor] = useState("#10b981");
  const [cardTextColor, setCardTextColor] = useState("#ffffff");
  const [cardValue, setCardValue] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");
  const [giftType, setGiftType] = useState<"discount" | "gift">("gift");
  const [discountValue, setDiscountValue] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stages, setStages] = useState<StageForm[]>([
    { required: 5, reward: "مكافأة مجانية", rewardType: "gift" },
  ]);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [selectedStamp, setSelectedStamp] = useState<{
    id: string;
    code: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Load cards data
    loadCards();
  }, [navigate]);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call the API
      // const response = await CardService.getAllCards();
      // setCards(response);

      // Mock cards data for now
      setTimeout(() => {
        const mockCards: CardData[] = [
          {
            id: "1",
            cardNumber: "1234567",
            title: "بطاقة مكافآت البرجر",
            description: "احصل على برجر مجاني بعد 5 طوابع",
            type: "reward",
            status: "active",
            creationDate: "2023-06-15",
            color: "blue",
            expiryDate: "2023-12-31",
            stages: [
              {
                required: 5,
                reward: "برجر مجاني",
                rewardType: "gift",
              },
              {
                required: 10,
                reward: "وجبة كاملة",
                rewardType: "gift",
              },
            ],
            stampDetails: [
              { id: "s1", code: "123456", isActive: false },
              { id: "s2", code: "234567", isActive: false },
              {
                id: "s3",
                code: "345678",
                isActive: true,
                activatedBy: "user123",
              },
              { id: "s4", code: "456789", isActive: false },
              { id: "s5", code: "567890", isActive: false },
            ],
          },
          {
            id: "2",
            cardNumber: "12345",
            title: "بطاقة هدية عيد الفطر",
            type: "gift",
            status: "active",
            creationDate: "2023-06-20",
            color: "green",
            value: 100,
            expiryDate: "2023-12-31",
            giftType: "discount",
            discountValue: 20,
            imageUrl:
              "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80",
          },
          {
            id: "3",
            cardNumber: "123456",
            title: "بطاقة كوينز ترحيبية",
            type: "coins",
            status: "used",
            creationDate: "2023-07-01",
            color: "gold",
            value: 500,
            ownerId: "user456",
            ownerName: "أحمد محمد",
          },
          {
            id: "4",
            cardNumber: "7654321",
            title: "بطاقة مكافآت البيتزا",
            description: "احصل على بيتزا مجانية بعد 8 طوابع",
            type: "reward",
            status: "expired",
            creationDate: "2023-05-10",
            color: "red",
            expiryDate: "2023-06-30",
            stages: [
              {
                required: 8,
                reward: "بيتزا مجانية",
                rewardType: "gift",
              },
            ],
            stampDetails: [
              {
                id: "s6",
                code: "111111",
                isActive: true,
                activatedBy: "user789",
              },
              {
                id: "s7",
                code: "222222",
                isActive: true,
                activatedBy: "user789",
              },
              { id: "s8", code: "333333", isActive: false },
              { id: "s9", code: "444444", isActive: false },
              { id: "s10", code: "555555", isActive: false },
              { id: "s11", code: "666666", isActive: false },
              { id: "s12", code: "777777", isActive: false },
              { id: "s13", code: "888888", isActive: false },
            ],
          },
          {
            id: "5",
            cardNumber: "54321",
            title: "بطاقة هدية رمضان",
            type: "gift",
            status: "used",
            creationDate: "2023-06-25",
            color: "purple",
            value: 200,
            expiryDate: "2023-07-31",
            giftType: "gift",
            imageUrl:
              "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=80",
            ownerId: "user789",
            ownerName: "فاطمة علي",
          },
        ];

        setCards(mockCards);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading cards:", error);
      setErrorMessage("حدث خطأ أثناء تحميل البطاقات");
      setIsLoading(false);
    }
  };

  const generateCardNumber = (type: "reward" | "gift" | "coins") => {
    let length = 0;
    switch (type) {
      case "reward":
        length = 7;
        break;
      case "gift":
        length = 5;
        break;
      case "coins":
        length = 6;
        break;
    }

    let result = "";
    const characters = "0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  };

  const generateStampCode = () => {
    let result = "";
    const characters = "0123456789";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addStage = () => {
    setStages([
      ...stages,
      { required: 5, reward: "مكافأة جديدة", rewardType: "gift" },
    ]);
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      const newStages = [...stages];
      newStages.splice(index, 1);
      setStages(newStages);
    }
  };

  const updateStage = (index: number, field: keyof StageForm, value: any) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  const resetForm = () => {
    setCardType("reward");
    setCardTitle("");
    setCardDescription("");
    setCardCount("1");
    setCardBackgroundColor("#10b981");
    setCardTextColor("#ffffff");
    setCardValue("");
    setCardExpiryDate("");
    setGiftType("gift");
    setDiscountValue("");
    setImageFile(null);
    setImagePreview(null);
    setStages([{ required: 5, reward: "مكافأة مجانية", rewardType: "gift" }]);
  };

  const validateForm = () => {
    // Common validations
    if (!cardTitle.trim()) {
      setErrorMessage("يرجى إدخال اسم البطاقة");
      return false;
    }

    const count = parseInt(cardCount);
    if (isNaN(count) || count <= 0) {
      setErrorMessage("يرجى إدخال عدد صحيح أكبر من صفر");
      return false;
    }

    if (!cardExpiryDate) {
      setErrorMessage("يرجى تحديد تاريخ الصلاحية");
      return false;
    }

    // Type-specific validations
    if (cardType === "reward") {
      if (stages.length === 0) {
        setErrorMessage("يجب إضافة مرحلة واحدة على الأقل");
        return false;
      }

      for (const stage of stages) {
        if (stage.required <= 0) {
          setErrorMessage("عدد الطوابع المطلوبة يجب أن يكون أكبر من صفر");
          return false;
        }
        if (!stage.reward.trim()) {
          setErrorMessage("يرجى إدخال وصف للمكافأة");
          return false;
        }
        if (
          stage.rewardType === "discount" &&
          (!stage.discountValue || stage.discountValue <= 0)
        ) {
          setErrorMessage("يرجى إدخال قيمة صحيحة للخصم");
          return false;
        }
      }
    } else if (cardType === "gift") {
      if (
        giftType === "discount" &&
        (!discountValue || parseInt(discountValue) <= 0)
      ) {
        setErrorMessage("يرجى إدخال قيمة صحيحة للخصم");
        return false;
      }
    } else if (cardType === "coins") {
      if (!cardValue || parseInt(cardValue) <= 0) {
        setErrorMessage("يرجى إدخال قيمة صحيحة للكوينز");
        return false;
      }
    }

    return true;
  };

  const handleCreateCards = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // In a real implementation, this would upload the image and call the API
      // let imageUrl = null;
      // if (imageFile && cardType === "gift") {
      //   const uploadResult = await CardService.uploadCardImage(imageFile);
      //   imageUrl = uploadResult.url;
      // }

      // let response;
      // if (cardType === "reward") {
      //   response = await CardService.createRewardCards({
      //     title: cardTitle,
      //     description: cardDescription,
      //     stages: stages,
      //     backgroundColor: cardBackgroundColor,
      //     textColor: cardTextColor,
      //     expiryDate: cardExpiryDate,
      //     count: parseInt(cardCount)
      //   });
      // } else if (cardType === "gift") {
      //   response = await CardService.createGiftCards({
      //     title: cardTitle,
      //     giftType: giftType,
      //     discountValue: giftType === "discount" ? parseInt(discountValue) : undefined,
      //     expiryDate: cardExpiryDate,
      //     imageUrl: imageUrl,
      //     backgroundColor: cardBackgroundColor,
      //     textColor: cardTextColor,
      //     count: parseInt(cardCount)
      //   });
      // } else {
      //   response = await CardService.createCoinsCards({
      //     title: cardTitle,
      //     coinsAmount: parseInt(cardValue),
      //     count: parseInt(cardCount)
      //   });
      // }

      // Mock response for now
      const count = parseInt(cardCount);
      const newCards: CardData[] = [];

      for (let i = 0; i < count; i++) {
        const newCard: CardData = {
          id: `new-${Date.now()}-${i}`,
          cardNumber: generateCardNumber(cardType),
          title: cardTitle,
          description: cardDescription,
          type: cardType,
          status: "active",
          creationDate: new Date().toISOString().split("T")[0],
          color: cardBackgroundColor,
          expiryDate: cardExpiryDate,
        };

        if (cardType === "reward") {
          newCard.stages = stages;
          newCard.stampDetails = [];

          // Generate stamp codes for each stage
          let totalStamps = 0;
          stages.forEach((stage) => {
            totalStamps += stage.required;
          });

          for (let j = 0; j < totalStamps; j++) {
            newCard.stampDetails.push({
              id: `stamp-${Date.now()}-${i}-${j}`,
              code: generateStampCode(),
              isActive: false,
            });
          }
        } else if (cardType === "gift") {
          newCard.giftType = giftType;
          if (giftType === "discount") {
            newCard.discountValue = parseInt(discountValue);
          }
          newCard.imageUrl =
            imagePreview ||
            "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80";
        } else if (cardType === "coins") {
          newCard.value = parseInt(cardValue);
        }

        newCards.push(newCard);
      }

      setCards([...cards, ...newCards]);
      setSuccessMessage(`تم إنشاء ${count} بطاقة بنجاح`);
      setShowCreateCardDialog(false);
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error creating cards:", error);
      setErrorMessage("حدث خطأ أثناء إنشاء البطاقات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = (card: CardData) => {
    setSelectedCard(card);
    setShowDeleteConfirmation(true);
  };

  const handleDeactivateCard = (card: CardData) => {
    setSelectedCard(card);
    setShowDeactivateConfirmation(true);
  };

  const handleEditCard = (card: CardData) => {
    setSelectedCard(card);
    // Populate form with card data
    setCardType(card.type);
    setCardTitle(card.title || "");
    setCardDescription(card.description || "");
    setCardBackgroundColor(card.color);
    setCardTextColor("#ffffff"); // Assuming white text
    setCardExpiryDate(card.expiryDate || "");

    if (card.type === "reward") {
      setStages(
        card.stages || [
          { required: 5, reward: "مكافأة مجانية", rewardType: "gift" },
        ],
      );
    } else if (card.type === "gift") {
      setGiftType(card.giftType || "gift");
      setDiscountValue(card.discountValue?.toString() || "");
      setImagePreview(card.imageUrl || null);
    } else if (card.type === "coins") {
      setCardValue(card.value?.toString() || "");
    }

    setShowEditCardDialog(true);
  };

  const handleGenerateStampCode = (stampId: string, code: string) => {
    setSelectedStamp({ id: stampId, code });
    setShowStampCodeDialog(true);
  };

  const confirmDeleteCard = async () => {
    if (!selectedCard) return;

    try {
      setIsLoading(true);

      // In a real implementation, this would call the API
      // await CardService.deleteCard(selectedCard.id);

      setCards(cards.filter((card) => card.id !== selectedCard.id));
      setShowDeleteConfirmation(false);
      setSelectedCard(null);
      setSuccessMessage("تم حذف البطاقة بنجاح");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting card:", error);
      setErrorMessage("حدث خطأ أثناء حذف البطاقة");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeactivateCard = async () => {
    if (!selectedCard) return;

    try {
      setIsLoading(true);

      // In a real implementation, this would call the API
      // await CardService.deactivateCard(selectedCard.id);

      // Update the card status in the local state
      const updatedCards = cards.map((card) => {
        if (card.id === selectedCard.id) {
          return { ...card, status: "expired" as const };
        }
        return card;
      });

      setCards(updatedCards);
      setShowDeactivateConfirmation(false);
      setSelectedCard(null);
      setSuccessMessage("تم تعطيل البطاقة بنجاح");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deactivating card:", error);
      setErrorMessage("حدث خطأ أثناء تعطيل البطاقة");
    } finally {
      setIsLoading(false);
    }
  };

  const sendStampCodeWhatsApp = (phoneNumber: string, code: string) => {
    // Format the message
    const message = `رمز تفعيل الطابع الخاص بك هو: ${code}`;

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open in a new tab
    window.open(whatsappUrl, "_blank");
  };

  const getCardTypeIcon = (type: CardData["type"]) => {
    switch (type) {
      case "reward":
        return <Award className="h-4 w-4" />;
      case "gift":
        return <Gift className="h-4 w-4" />;
      case "coins":
        return <Coins className="h-4 w-4" />;
    }
  };

  const getCardTypeText = (type: CardData["type"]) => {
    switch (type) {
      case "reward":
        return "مكافآت";
      case "gift":
        return "هدية";
      case "coins":
        return "كوينز";
    }
  };

  const getCardStatusText = (status: CardData["status"]) => {
    switch (status) {
      case "active":
        return "مفعّلة";
      case "used":
        return "مستخدمة";
      case "expired":
        return "منتهية الصلاحية";
    }
  };

  const getCardStatusVariant = (status: CardData["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "used":
        return "secondary";
      case "expired":
        return "destructive";
    }
  };

  const filteredCards = cards.filter((card) => {
    // Filter by search term
    const searchMatch =
      card.cardNumber.includes(searchTerm) ||
      card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    // Filter by type
    const typeMatch = typeFilter === "all" || card.type === typeFilter;

    // Filter by status
    const statusMatch = statusFilter === "all" || card.status === statusFilter;

    return searchMatch && typeMatch && statusMatch;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">إدارة البطاقات</h1>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Create Card Form */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              إنشاء بطاقات جديدة
            </CardTitle>
            <Button
              onClick={() => setShowCreateCardDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إنشاء بطاقات
            </Button>
          </CardHeader>
        </Card>

        {/* Cards List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              قائمة البطاقات
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="بحث برقم البطاقة أو الاسم"
                  className="pl-10 pr-4 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as any)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="نوع البطاقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="reward">بطاقات المكافآت</SelectItem>
                  <SelectItem value="gift">بطاقات الهدايا</SelectItem>
                  <SelectItem value="coins">بطاقات الكوينز</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as any)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="حالة البطاقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">مفعّلة</SelectItem>
                  <SelectItem value="used">مستخدمة</SelectItem>
                  <SelectItem value="expired">منتهية الصلاحية</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Reward Cards */}
              {filteredCards.some((card) => card.type === "reward") && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    بطاقات المكافآت
                  </h3>
                  <div className="bg-white rounded-md shadow overflow-hidden">
                    {filteredCards
                      .filter((card) => card.type === "reward")
                      .map((card) => (
                        <div
                          key={card.id}
                          className="border-b border-gray-200 p-4 last:border-b-0"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {card.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {card.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={getCardStatusVariant(card.status)}
                                >
                                  {getCardStatusText(card.status)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  رقم البطاقة: {card.cardNumber}
                                </span>
                                <span className="text-sm text-gray-500">
                                  تاريخ الإنشاء: {card.creationDate}
                                </span>
                                {card.expiryDate && (
                                  <span className="text-sm text-gray-500">
                                    تاريخ الانتهاء: {card.expiryDate}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCard(card)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                تعديل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateCard(card)}
                                className="flex items-center gap-1 text-amber-600 border-amber-600 hover:bg-amber-50"
                              >
                                <Ban className="h-4 w-4" />
                                تعطيل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCard(card)}
                                className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </Button>
                            </div>
                          </div>

                          {/* Stages */}
                          <div className="mb-3">
                            <h5 className="font-medium mb-2">المراحل:</h5>
                            <div className="space-y-2">
                              {card.stages?.map((stage, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-2 rounded-md"
                                >
                                  <div className="flex justify-between">
                                    <span>
                                      المرحلة {index + 1}: {stage.required}{" "}
                                      طوابع للحصول على {stage.reward}
                                      {stage.rewardType === "discount" &&
                                        ` (خصم ${stage.discountValue}%)`}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Stamps */}
                          <div>
                            <h5 className="font-medium mb-2">الطوابع:</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {card.stampDetails?.map((stamp, index) => (
                                <div
                                  key={stamp.id}
                                  className={`p-2 rounded-md border ${stamp.isActive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="flex items-center gap-1">
                                        <Stamp
                                          className={`h-4 w-4 ${stamp.isActive ? "text-green-600" : "text-gray-400"}`}
                                        />
                                        <span className="font-medium">
                                          طابع {index + 1}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        رقم التفعيل: {stamp.code}
                                      </div>
                                      {stamp.isActive && stamp.activatedBy && (
                                        <div className="text-xs text-green-600 mt-1">
                                          مفعل بواسطة: {stamp.activatedBy}
                                        </div>
                                      )}
                                    </div>
                                    {!stamp.isActive && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleGenerateStampCode(
                                            stamp.id,
                                            stamp.code,
                                          )
                                        }
                                        className="text-primary hover:text-primary-dark hover:bg-primary-50"
                                      >
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Gift Cards */}
              {filteredCards.some((card) => card.type === "gift") && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    بطاقات الهدايا
                  </h3>
                  <div className="bg-white rounded-md shadow overflow-hidden">
                    {filteredCards
                      .filter((card) => card.type === "gift")
                      .map((card) => (
                        <div
                          key={card.id}
                          className="border-b border-gray-200 p-4 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              {card.imageUrl && (
                                <div className="w-24 h-24 rounded-md overflow-hidden">
                                  <img
                                    src={card.imageUrl}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {card.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant={getCardStatusVariant(card.status)}
                                  >
                                    {getCardStatusText(card.status)}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    رقم البطاقة: {card.cardNumber}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-sm text-gray-500">
                                    النوع:{" "}
                                    {card.giftType === "discount"
                                      ? "خصم"
                                      : "هدية"}
                                  </span>
                                  {card.giftType === "discount" &&
                                    card.discountValue && (
                                      <span className="text-sm text-gray-500 mr-2">
                                        قيمة الخصم: {card.discountValue}%
                                      </span>
                                    )}
                                </div>
                                <div className="mt-1">
                                  <span className="text-sm text-gray-500">
                                    تاريخ الإنشاء: {card.creationDate}
                                  </span>
                                  {card.expiryDate && (
                                    <span className="text-sm text-gray-500 mr-2">
                                      تاريخ الانتهاء: {card.expiryDate}
                                    </span>
                                  )}
                                </div>
                                {card.ownerId && (
                                  <div className="mt-1 text-sm text-blue-600">
                                    مملوكة بواسطة: {card.ownerName}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCard(card)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                تعديل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateCard(card)}
                                className="flex items-center gap-1 text-amber-600 border-amber-600 hover:bg-amber-50"
                              >
                                <Ban className="h-4 w-4" />
                                تعطيل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCard(card)}
                                className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Coins Cards */}
              {filteredCards.some((card) => card.type === "coins") && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    بطاقات الكوينز
                  </h3>
                  <div className="bg-white rounded-md shadow overflow-hidden">
                    {filteredCards
                      .filter((card) => card.type === "coins")
                      .map((card) => (
                        <div
                          key={card.id}
                          className="border-b border-gray-200 p-4 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {card.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={getCardStatusVariant(card.status)}
                                >
                                  {getCardStatusText(card.status)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  رقم البطاقة: {card.cardNumber}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-sm font-medium text-amber-600">
                                  قيمة الكوينز: {card.value}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-sm text-gray-500">
                                  تاريخ الإنشاء: {card.creationDate}
                                </span>
                              </div>
                              {card.ownerId && (
                                <div className="mt-1 text-sm text-blue-600">
                                  مملوكة بواسطة: {card.ownerName}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCard(card)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                تعديل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateCard(card)}
                                className="flex items-center gap-1 text-amber-600 border-amber-600 hover:bg-amber-50"
                              >
                                <Ban className="h-4 w-4" />
                                تعطيل
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCard(card)}
                                className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {filteredCards.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  لا توجد بطاقات مطابقة للبحث
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Card Dialog */}
      <Dialog
        open={showCreateCardDialog}
        onOpenChange={setShowCreateCardDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إنشاء بطاقات جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="cardType">نوع البطاقة</Label>
              <Select
                value={cardType}
                onValueChange={(value) => {
                  setCardType(value as any);
                  // Reset form fields when changing card type
                  if (value === "reward") {
                    setStages([
                      {
                        required: 5,
                        reward: "مكافأة مجانية",
                        rewardType: "gift",
                      },
                    ]);
                  } else if (value === "gift") {
                    setGiftType("gift");
                    setDiscountValue("");
                    setImageFile(null);
                    setImagePreview(null);
                  } else if (value === "coins") {
                    setCardValue("");
                  }
                }}
              >
                <SelectTrigger id="cardType">
                  <SelectValue placeholder="اختر نوع البطاقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reward">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      بطاقة المكافآت
                    </div>
                  </SelectItem>
                  <SelectItem value="gift">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      بطاقة الهدايا
                    </div>
                  </SelectItem>
                  <SelectItem value="coins">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      بطاقة رصيد الكوينز
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardTitle">اسم البطاقة</Label>
              <Input
                id="cardTitle"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="أدخل اسم البطاقة"
              />
            </div>

            {cardType === "reward" && (
              <div className="space-y-2">
                <Label htmlFor="cardDescription">وصف مختصر</Label>
                <Textarea
                  id="cardDescription"
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="أدخل وصفًا مختصرًا للبطاقة"
                  rows={2}
                />
              </div>
            )}

            {/* Reward Card Specific Fields */}
            {cardType === "reward" && (
              <div className="space-y-4 border rounded-md p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">المراحل</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStage}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    إضافة مرحلة
                  </Button>
                </div>

                {stages.map((stage, index) => (
                  <div
                    key={index}
                    className="space-y-3 border rounded-md p-3 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">المرحلة {index + 1}</h4>
                      {stages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStage(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`stageRequired-${index}`}>
                          عدد الطوابع المطلوبة
                        </Label>
                        <Input
                          id={`stageRequired-${index}`}
                          type="number"
                          min="1"
                          value={stage.required}
                          onChange={(e) =>
                            updateStage(
                              index,
                              "required",
                              parseInt(e.target.value) || 1,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`stageReward-${index}`}>المكافأة</Label>
                        <Input
                          id={`stageReward-${index}`}
                          value={stage.reward}
                          onChange={(e) =>
                            updateStage(index, "reward", e.target.value)
                          }
                          placeholder="وصف المكافأة"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`stageRewardType-${index}`}>
                          نوع المكافأة
                        </Label>
                        <Select
                          value={stage.rewardType}
                          onValueChange={(value) =>
                            updateStage(
                              index,
                              "rewardType",
                              value as "discount" | "gift",
                            )
                          }
                        >
                          <SelectTrigger id={`stageRewardType-${index}`}>
                            <SelectValue placeholder="اختر نوع المكافأة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gift">هدية</SelectItem>
                            <SelectItem value="discount">خصم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {stage.rewardType === "discount" && (
                        <div className="space-y-2">
                          <Label htmlFor={`stageDiscountValue-${index}`}>
                            قيمة الخصم (%)
                          </Label>
                          <Input
                            id={`stageDiscountValue-${index}`}
                            type="number"
                            min="1"
                            max="100"
                            value={stage.discountValue || ""}
                            onChange={(e) =>
                              updateStage(
                                index,
                                "discountValue",
                                parseInt(e.target.value) || 0,
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gift Card Specific Fields */}
            {cardType === "gift" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="giftType">نوع الهدية</Label>
                  <Select
                    value={giftType}
                    onValueChange={(value) =>
                      setGiftType(value as "discount" | "gift")
                    }
                  >
                    <SelectTrigger id="giftType">
                      <SelectValue placeholder="اختر نوع الهدية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gift">هدية</SelectItem>
                      <SelectItem value="discount">خصم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {giftType === "discount" && (
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">قيمة الخصم (%)</Label>
                    <Input
                      id="discountValue"
                      type="number"
                      min="1"
                      max="100"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cardImage">صورة البطاقة</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      اختر صورة
                    </Button>
                    <input
                      type="file"
                      id="cardImage"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {imageFile && (
                      <span className="text-sm text-gray-600">
                        {imageFile.name}
                      </span>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-40 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Coins Card Specific Fields */}
            {cardType === "coins" && (
              <div className="space-y-2">
                <Label htmlFor="cardValue">قيمة الكوينز</Label>
                <Input
                  id="cardValue"
                  type="number"
                  min="1"
                  value={cardValue}
                  onChange={(e) => setCardValue(e.target.value)}
                />
              </div>
            )}

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardCount">عدد البطاقات</Label>
                <Input
                  id="cardCount"
                  type="number"
                  min="1"
                  value={cardCount}
                  onChange={(e) => setCardCount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardExpiryDate">تاريخ الصلاحية</Label>
                <div className="flex items-center">
                  <Input
                    id="cardExpiryDate"
                    type="date"
                    value={cardExpiryDate}
                    onChange={(e) => setCardExpiryDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardBackgroundColor">لون خلفية البطاقة</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="cardBackgroundColor"
                    value={cardBackgroundColor}
                    onChange={(e) => setCardBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: cardBackgroundColor }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardTextColor">لون النص</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="cardTextColor"
                    value={cardTextColor}
                    onChange={(e) => setCardTextColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <div
                    className="w-10 h-10 rounded border flex items-center justify-center"
                    style={{
                      backgroundColor: cardBackgroundColor,
                      color: cardTextColor,
                    }}
                  >
                    <span>أ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateCardDialog(false);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button type="button" onClick={handleCreateCards}>
              إنشاء البطاقات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={showEditCardDialog} onOpenChange={setShowEditCardDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بطاقة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCardTitle">اسم البطاقة</Label>
              <Input
                id="editCardTitle"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
              />
            </div>
            {/* Add other edit fields based on card type */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditCardDialog(false)}
            >
              إلغاء
            </Button>
            <Button>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              هل أنت متأكد من رغبتك في حذف هذه البطاقة؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            {selectedCard && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p>
                  <strong>رقم البطاقة:</strong> {selectedCard.cardNumber}
                </p>
                <p>
                  <strong>النوع:</strong> {getCardTypeText(selectedCard.type)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={showDeactivateConfirmation}
        onOpenChange={setShowDeactivateConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد تعطيل البطاقة</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              هل أنت متأكد من رغبتك في تعطيل هذه البطاقة؟ لن يتمكن المستخدمون من
              استخدامها بعد التعطيل.
            </p>
            {selectedCard && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p>
                  <strong>رقم البطاقة:</strong> {selectedCard.cardNumber}
                </p>
                <p>
                  <strong>النوع:</strong> {getCardTypeText(selectedCard.type)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDeactivateConfirmation(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDeactivateCard}>
              تعطيل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stamp Code Dialog */}
      <Dialog open={showStampCodeDialog} onOpenChange={setShowStampCodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إرسال رمز تفعيل الطابع</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              رمز التفعيل: <strong>{selectedStamp?.code}</strong>
            </p>
            <p className="mt-2">أدخل رقم الهاتف لإرسال الرمز عبر واتساب:</p>
            <Input
              className="mt-2"
              placeholder="مثال: 966512345678"
              id="phoneNumber"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStampCodeDialog(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={() => {
                const phoneInput = document.getElementById(
                  "phoneNumber",
                ) as HTMLInputElement;
                if (phoneInput && phoneInput.value && selectedStamp) {
                  sendStampCodeWhatsApp(phoneInput.value, selectedStamp.code);
                  setShowStampCodeDialog(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              إرسال عبر واتساب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CardsManagement;
