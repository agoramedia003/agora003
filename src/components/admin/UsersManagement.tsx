import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  User,
  Phone,
  Key,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  phone: string;
  pin: string;
  status: "active" | "inactive";
  registrationDate: string;
  balance: number;
  cards: {
    type: "reward" | "gift";
    id: string;
    title: string;
  }[];
}

const UsersManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Dialog states
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Form states
  const [newUserPhone, setNewUserPhone] = useState("");
  const [generatedPin, setGeneratedPin] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      // Mock users data
      const mockUsers: UserData[] = [
        {
          id: "1",
          name: "أحمد محمد",
          phone: "+212 612345678",
          pin: "1234",
          status: "active",
          registrationDate: "2023-05-15",
          balance: 1500,
          cards: [
            { type: "reward", id: "r1", title: "بطاقة مكافآت برجر" },
            { type: "gift", id: "g1", title: "بطاقة هدية" },
          ],
        },
        {
          id: "2",
          name: "فاطمة العلوي",
          phone: "+212 623456789",
          pin: "5678",
          status: "active",
          registrationDate: "2023-06-20",
          balance: 800,
          cards: [{ type: "reward", id: "r2", title: "بطاقة مكافآت بيتزا" }],
        },
        {
          id: "3",
          name: null,
          phone: "+212 634567890",
          pin: "9012",
          status: "inactive",
          registrationDate: "2023-07-01",
          balance: 0,
          cards: [],
        },
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPin(pin);
    return pin;
  };

  const handleCreateUser = () => {
    if (!newUserPhone) {
      setErrorMessage("يرجى إدخال رقم الهاتف");
      return;
    }

    const pin = generatedPin || generatePin();

    // Create new user
    const newUser: UserData = {
      id: (users.length + 1).toString(),
      name: null,
      phone: newUserPhone,
      pin: pin,
      status: "active",
      registrationDate: new Date().toISOString().split("T")[0],
      balance: 0,
      cards: [],
    };

    setUsers([...users, newUser]);
    setSuccessMessage(`تم إنشاء المستخدم بنجاح. رقم PIN: ${pin}`);
    setNewUserPhone("");
    setGeneratedPin("");
    setShowCreateUserDialog(false);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleViewUserDetails = (user: UserData) => {
    setSelectedUser(user);
    setShowUserDetailsDialog(true);
  };

  const handleDeleteUser = (user: UserData) => {
    setSelectedUser(user);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setShowDeleteConfirmation(false);
    setSelectedUser(null);
    setSuccessMessage("تم حذف المستخدم بنجاح");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleResendPin = (user: UserData) => {
    // Create WhatsApp URL with message
    const whatsappMessage = `مرحباً، رقم PIN الخاص بك هو: ${user.pin}`;
    const whatsappUrl = `https://wa.me/${user.phone.replace(/\+|\s/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    setSuccessMessage(`تم إرسال رقم PIN إلى ${user.phone} بنجاح`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const filteredUsers = users.filter((user) => {
    // Filter by search term
    const searchMatch =
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by status
    const statusMatch = statusFilter === "all" || user.status === statusFilter;

    return searchMatch && statusMatch;
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
        <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>

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

        {/* Create User Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              إنشاء مستخدم جديد
            </CardTitle>
            <Button
              onClick={() => setShowCreateUserDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة مستخدم
            </Button>
          </CardHeader>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              قائمة المستخدمين
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="بحث بالاسم أو رقم الهاتف"
                  className="pl-10 pr-4 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md p-2"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "inactive",
                  )
                }
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">رقم PIN</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name || "غير محدد"}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.pin}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "success" : "destructive"
                        }
                        className="font-normal"
                      >
                        {user.status === "active" ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewUserDetails(user)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResendPin(user)}
                          title="إعادة إرسال PIN"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user)}
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                لا يوجد مستخدمين مطابقين للبحث
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog
        open={showCreateUserDialog}
        onOpenChange={setShowCreateUserDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إنشاء مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                رقم الهاتف
              </Label>
              <Input
                id="userPhone"
                placeholder="أدخل رقم الهاتف"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPin" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                رقم PIN
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="userPin"
                  placeholder="سيتم توليده تلقائيًا"
                  value={generatedPin}
                  readOnly
                />
                <Button
                  variant="outline"
                  onClick={generatePin}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  توليد
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCreateUser}>
              إنشاء المستخدم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog
          open={showUserDetailsDialog}
          onOpenChange={setShowUserDetailsDialog}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>تفاصيل المستخدم</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">الاسم</Label>
                  <p>{selectedUser.name || "غير محدد"}</p>
                </div>
                <div>
                  <Label className="text-gray-500">رقم الهاتف</Label>
                  <p>{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">رقم PIN</Label>
                  <p>{selectedUser.pin}</p>
                </div>
                <div>
                  <Label className="text-gray-500">الحالة</Label>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "success"
                        : "destructive"
                    }
                    className="font-normal"
                  >
                    {selectedUser.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-500">تاريخ التسجيل</Label>
                  <p>{selectedUser.registrationDate}</p>
                </div>
                <div>
                  <Label className="text-gray-500">الرصيد</Label>
                  <p>{selectedUser.balance} كوينز</p>
                </div>
              </div>

              {selectedUser.cards.length > 0 && (
                <div>
                  <Label className="text-gray-500 block mb-2">البطاقات</Label>
                  <div className="space-y-2">
                    {selectedUser.cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-2 p-2 border rounded-md"
                      >
                        <Badge
                          variant={
                            card.type === "reward" ? "secondary" : "outline"
                          }
                        >
                          {card.type === "reward" ? "مكافآت" : "هدية"}
                        </Badge>
                        <span>{card.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleResendPin(selectedUser)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة إرسال PIN
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
              هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            {selectedUser && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p>
                  <strong>الهاتف:</strong> {selectedUser.phone}
                </p>
                {selectedUser.name && (
                  <p>
                    <strong>الاسم:</strong> {selectedUser.name}
                  </p>
                )}
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
            <Button variant="destructive" onClick={confirmDeleteUser}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UsersManagement;
