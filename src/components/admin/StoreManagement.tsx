import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Package,
  Edit,
  Trash2,
  Plus,
  Image,
  Tag,
  Calendar,
  Clock,
  Coins,
  DollarSign,
  Search,
  Filter,
  LayoutGrid,
  Star,
  MessageSquare,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  coinsPrice: number;
  image: string;
  category: string;
  available: boolean;
}

interface FlashDeal {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  discountPrice: number;
  coinsPrice: number;
  image: string;
  startDate: string;
  endDate: string;
  timeRemaining: string;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface Review {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
}

const StoreManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Dialog states
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showFlashDealDialog, setShowFlashDealDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingFlashDeal, setEditingFlashDeal] = useState<FlashDeal | null>(
    null,
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "برجر دجاج مقرمش",
          description: "برجر دجاج مقرمش مع صلصة خاصة وخضروات طازجة",
          price: 45,
          discountPrice: 35,
          coinsPrice: 350,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
          category: "burgers",
          available: true,
        },
        {
          id: "2",
          name: "بيتزا خضار",
          description: "بيتزا طازجة مع تشكيلة من الخضروات والجبن",
          price: 60,
          discountPrice: 45,
          coinsPrice: 450,
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
          category: "pizza",
          available: true,
        },
        {
          id: "3",
          name: "شاورما لحم",
          description: "شاورما لحم مع صلصة طحينة وخضروات",
          price: 50,
          discountPrice: 38,
          coinsPrice: 380,
          image:
            "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=300&q=80",
          category: "sandwiches",
          available: true,
        },
        {
          id: "4",
          name: "عصير برتقال طازج",
          description: "عصير برتقال طازج 100%",
          price: 20,
          discountPrice: 15,
          coinsPrice: 150,
          image:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&q=80",
          category: "drinks",
          available: true,
        },
        {
          id: "5",
          name: "كيك الشوكولاتة",
          description: "كيك الشوكولاتة الفاخر مع صوص الشوكولاتة",
          price: 30,
          discountPrice: 25,
          coinsPrice: 250,
          image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80",
          category: "desserts",
          available: false,
        },
      ];

      // Mock flash deals data
      const mockFlashDeals: FlashDeal[] = [
        {
          id: "1",
          productId: "1",
          productName: "برجر دجاج مقرمش",
          originalPrice: 45,
          discountPrice: 35,
          coinsPrice: 350,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
          startDate: "2023-07-01",
          endDate: "2023-07-07",
          timeRemaining: "2 أيام",
          active: true,
        },
        {
          id: "2",
          productId: "2",
          productName: "بيتزا خضار",
          originalPrice: 60,
          discountPrice: 45,
          coinsPrice: 450,
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
          startDate: "2023-07-02",
          endDate: "2023-07-05",
          timeRemaining: "1 يوم",
          active: true,
        },
      ];

      // Mock categories data
      const mockCategories: Category[] = [
        {
          id: "burgers",
          name: "برجر",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&q=80",
          productCount: 2,
        },
        {
          id: "pizza",
          name: "بيتزا",
          image:
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80",
          productCount: 1,
        },
        {
          id: "sandwiches",
          name: "ساندويتش",
          image:
            "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=100&q=80",
          productCount: 1,
        },
        {
          id: "drinks",
          name: "مشروبات",
          image:
            "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100&q=80",
          productCount: 1,
        },
        {
          id: "desserts",
          name: "حلويات",
          image:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&q=80",
          productCount: 1,
        },
      ];

      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: "1",
          customerName: "أحمد محمد",
          productName: "برجر دجاج مقرمش",
          rating: 5,
          comment: "طعم رائع وخدمة ممتازة!",
          date: "2023-06-30",
        },
        {
          id: "2",
          customerName: "فاطمة العلوي",
          productName: "بيتزا خضار",
          rating: 4,
          comment: "بيتزا لذيذة ولكن كان يمكن أن تكون أكثر سخونة.",
          date: "2023-06-29",
        },
        {
          id: "3",
          customerName: "يوسف الناصري",
          productName: "شاورما لحم",
          rating: 5,
          comment: "من أفضل الشاورما التي تذوقتها!",
          date: "2023-06-28",
        },
      ];

      setProducts(mockProducts);
      setFlashDeals(mockFlashDeals);
      setCategories(mockCategories);
      setReviews(mockReviews);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const handleAddFlashDeal = () => {
    setEditingFlashDeal(null);
    setShowFlashDealDialog(true);
  };

  const handleEditFlashDeal = (flashDeal: FlashDeal) => {
    setEditingFlashDeal(flashDeal);
    setShowFlashDealDialog(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    const { type, id } = itemToDelete;

    switch (type) {
      case "product":
        setProducts((prev) => prev.filter((item) => item.id !== id));
        break;
      case "flashDeal":
        setFlashDeals((prev) => prev.filter((item) => item.id !== id));
        break;
      case "category":
        setCategories((prev) => prev.filter((item) => item.id !== id));
        break;
      case "review":
        setReviews((prev) => prev.filter((item) => item.id !== id));
        break;
    }

    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const saveProduct = (formData: any) => {
    // In a real app, you would save the product to the database
    // For now, we'll just simulate it with mock data

    // Get form values
    const productName = document.getElementById(
      "productName",
    ) as HTMLInputElement;
    const productDescription = document.getElementById(
      "productDescription",
    ) as HTMLTextAreaElement;
    const productPrice = document.getElementById(
      "productPrice",
    ) as HTMLInputElement;
    const productDiscountPrice = document.getElementById(
      "productDiscountPrice",
    ) as HTMLInputElement;
    const productCoinsPrice = document.getElementById(
      "productCoinsPrice",
    ) as HTMLInputElement;
    const productAvailable = document.getElementById(
      "productAvailable",
    ) as HTMLInputElement;

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productDiscountPrice ||
      !productCoinsPrice
    ) {
      return;
    }

    const newProductData = {
      name: productName.value,
      description: productDescription.value,
      price: parseInt(productPrice.value),
      discountPrice: parseInt(productDiscountPrice.value),
      coinsPrice: parseInt(productCoinsPrice.value),
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
      category: "burgers", // Default category
      available: productAvailable ? productAvailable.checked : true,
    };

    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? { ...newProductData, id: item.id }
            : item,
        ),
      );
    } else {
      // Add new product
      const newProduct: Product = {
        ...newProductData,
        id: `${products.length + 1}`,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowProductDialog(false);
  };

  const saveFlashDeal = (formData: any) => {
    if (editingFlashDeal) {
      // Update existing flash deal
      setFlashDeals((prev) =>
        prev.map((item) =>
          item.id === editingFlashDeal.id ? { ...formData, id: item.id } : item,
        ),
      );
    } else {
      // Add new flash deal
      const newFlashDeal: FlashDeal = {
        ...formData,
        id: `${flashDeals.length + 1}`,
        timeRemaining: "7 أيام", // Default value
        active: true,
      };
      setFlashDeals((prev) => [...prev, newFlashDeal]);
    }
    setShowFlashDealDialog(false);
  };

  const saveCategory = (formData: any) => {
    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingCategory.id ? { ...formData, id: item.id } : item,
        ),
      );
    } else {
      // Add new category
      const newCategory: Category = {
        ...formData,
        id: formData.name.toLowerCase().replace(/\s+/g, "-"),
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setShowCategoryDialog(false);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (product) =>
        categoryFilter === "all" || product.category === categoryFilter,
    );

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
        <h1 className="text-2xl font-bold mb-6">إدارة المتجر</h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="flashDeals" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              العروض المحدودة
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              الفئات
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              التعليقات والتقييمات
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  إدارة المنتجات
                </CardTitle>
                <Button
                  onClick={handleAddProduct}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة منتج جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ابحث عن منتج..."
                      className="pl-10 pr-4"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-48">
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="جميع الفئات" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-right">المنتج</th>
                        <th className="p-3 text-right">الفئة</th>
                        <th className="p-3 text-right">السعر الأصلي</th>
                        <th className="p-3 text-right">السعر بعد الخصم</th>
                        <th className="p-3 text-right">سعر الكوينز</th>
                        <th className="p-3 text-right">الحالة</th>
                        <th className="p-3 text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {categories.find((c) => c.id === product.category)
                              ?.name || "-"}
                          </td>
                          <td className="p-3">{product.price} د.م</td>
                          <td className="p-3">{product.discountPrice} د.م</td>
                          <td className="p-3">{product.coinsPrice}</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                product.available ? "success" : "destructive"
                              }
                              className="font-normal"
                            >
                              {product.available ? "متوفر" : "غير متوفر"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  handleDelete("product", product.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      لا توجد منتجات مطابقة للبحث
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flash Deals Tab */}
          <TabsContent value="flashDeals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  إدارة العروض المحدودة
                </CardTitle>
                <Button
                  onClick={handleAddFlashDeal}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة عرض جديد
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-right">المنتج</th>
                        <th className="p-3 text-right">السعر الأصلي</th>
                        <th className="p-3 text-right">سعر العرض</th>
                        <th className="p-3 text-right">سعر الكوينز</th>
                        <th className="p-3 text-right">تاريخ البداية</th>
                        <th className="p-3 text-right">تاريخ النهاية</th>
                        <th className="p-3 text-right">الوقت المتبقي</th>
                        <th className="p-3 text-right">الحالة</th>
                        <th className="p-3 text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flashDeals.map((deal) => (
                        <tr key={deal.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={deal.image}
                                alt={deal.productName}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                              <p className="font-medium">{deal.productName}</p>
                            </div>
                          </td>
                          <td className="p-3">{deal.originalPrice} د.م</td>
                          <td className="p-3">{deal.discountPrice} د.م</td>
                          <td className="p-3">{deal.coinsPrice}</td>
                          <td className="p-3">{deal.startDate}</td>
                          <td className="p-3">{deal.endDate}</td>
                          <td className="p-3">{deal.timeRemaining}</td>
                          <td className="p-3">
                            <Badge
                              variant={deal.active ? "success" : "destructive"}
                              className="font-normal"
                            >
                              {deal.active ? "نشط" : "منتهي"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditFlashDeal(deal)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() =>
                                  handleDelete("flashDeal", deal.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {flashDeals.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      لا توجد عروض محدودة حالياً
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                  إدارة الفئات
                </CardTitle>
                <Button
                  onClick={handleAddCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة فئة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-lg border p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-500">
                            {category.productCount} منتج
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete("category", category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    لا توجد فئات حالياً
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  التعليقات والتقييمات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-lg border p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <p className="text-sm text-gray-500">
                            {review.productName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete("review", review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {reviews.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      لا توجد تعليقات حالياً
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="productName">اسم المنتج</Label>
                <Input id="productName" defaultValue={editingProduct?.name} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="productDescription">وصف المنتج</Label>
                <Textarea
                  id="productDescription"
                  defaultValue={editingProduct?.description}
                />
              </div>
              <div>
                <Label htmlFor="productCategory">الفئة</Label>
                <Select defaultValue={editingProduct?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="productImage">صورة المنتج</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="productImage"
                    defaultValue={editingProduct?.image}
                  />
                  <Button variant="outline" size="icon">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="productPrice">السعر الأصلي</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="productPrice"
                    type="number"
                    className="pl-10"
                    defaultValue={editingProduct?.price}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="productDiscountPrice">السعر بعد الخصم</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="productDiscountPrice"
                    type="number"
                    className="pl-10"
                    defaultValue={editingProduct?.discountPrice}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="productCoinsPrice">سعر الكوينز</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="productCoinsPrice"
                    type="number"
                    className="pl-10"
                    defaultValue={editingProduct?.coinsPrice}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Label htmlFor="productAvailable">متوفر</Label>
                <Switch
                  id="productAvailable"
                  defaultChecked={editingProduct?.available}
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Label htmlFor="productFeatured">منتج مميز</Label>
                <Switch id="productFeatured" defaultChecked={false} />
              </div>

              {/* Product Extras Section */}
              <div className="col-span-2 mt-4 border-t pt-4">
                <Label className="mb-2 block">الإضافات</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="اسم الإضافة" className="flex-1" />
                    <Input type="number" placeholder="السعر" className="w-24" />
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="اسم الإضافة"
                      className="flex-1"
                      value="جبنة إضافية"
                    />
                    <Input
                      type="number"
                      placeholder="السعر"
                      className="w-24"
                      value="5"
                    />
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="اسم الإضافة"
                      className="flex-1"
                      value="صلصة حارة"
                    />
                    <Input
                      type="number"
                      placeholder="السعر"
                      className="w-24"
                      value="3"
                    />
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProductDialog(false)}
            >
              إلغاء
            </Button>
            <Button onClick={() => saveProduct({})}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flash Deal Dialog */}
      <Dialog open={showFlashDealDialog} onOpenChange={setShowFlashDealDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingFlashDeal ? "تعديل عرض" : "إضافة عرض جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="flashDealProduct">المنتج</Label>
              <Select defaultValue={editingFlashDeal?.productId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flashDealDiscountPrice">سعر العرض</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="flashDealDiscountPrice"
                    type="number"
                    className="pl-10"
                    defaultValue={editingFlashDeal?.discountPrice}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="flashDealCoinsPrice">سعر الكوينز</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="flashDealCoinsPrice"
                    type="number"
                    className="pl-10"
                    defaultValue={editingFlashDeal?.coinsPrice}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="flashDealStartDate">تاريخ البداية</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="flashDealStartDate"
                    type="date"
                    className="pl-10"
                    defaultValue={editingFlashDeal?.startDate}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="flashDealEndDate">تاريخ النهاية</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="flashDealEndDate"
                    type="date"
                    className="pl-10"
                    defaultValue={editingFlashDeal?.endDate}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Label htmlFor="flashDealTime">توقيت العرض</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="flashDealStartTime"
                      type="time"
                      className="pl-10"
                      placeholder="وقت البداية"
                      defaultValue="08:00"
                    />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="flashDealEndTime"
                      type="time"
                      className="pl-10"
                      placeholder="وقت النهاية"
                      defaultValue="20:00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFlashDealDialog(false)}
            >
              إلغاء
            </Button>
            <Button onClick={() => saveFlashDeal({})}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "تعديل فئة" : "إضافة فئة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="categoryName">اسم الفئة</Label>
              <Input id="categoryName" defaultValue={editingCategory?.name} />
            </div>
            <div>
              <Label htmlFor="categoryImage">صورة الفئة</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="categoryImage"
                  defaultValue={editingCategory?.image}
                />
                <Button variant="outline" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCategoryDialog(false)}
            >
              إلغاء
            </Button>
            <Button onClick={() => saveCategory({})}>حفظ</Button>
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
              هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StoreManagement;
