import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
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
  Search,
  Eye,
  RefreshCw,
  Filter,
  Download,
  BarChart2,
  Coins,
  Gift,
  Award,
  User,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Transaction {
  id: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "rejected";
  type: "coins" | "reward" | "gift";
  notes?: string;
}

const TransactionsManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending" | "rejected"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "coins" | "reward" | "gift"
  >("all");

  // Dialog states
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);

  // Selected transaction
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [newStatus, setNewStatus] = useState<
    "completed" | "pending" | "rejected"
  >("completed");

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      // Mock transactions data
      const mockTransactions: Transaction[] = [
        {
          id: "TR-1001",
          senderName: "أحمد محمد",
          senderPhone: "+212 612345678",
          recipientName: "فاطمة العلوي",
          recipientPhone: "+212 623456789",
          amount: 500,
          date: "2023-07-01 14:30",
          status: "completed",
          type: "coins",
        },
        {
          id: "TR-1002",
          senderName: "يوسف الناصري",
          senderPhone: "+212 634567890",
          recipientName: "سارة بنعلي",
          recipientPhone: "+212 645678901",
          amount: 1,
          date: "2023-07-02 10:15",
          status: "completed",
          type: "reward",
          notes: "تحويل بطاقة مكافآت برجر",
        },
        {
          id: "TR-1003",
          senderName: "محمد العربي",
          senderPhone: "+212 656789012",
          recipientName: "ليلى المراكشي",
          recipientPhone: "+212 667890123",
          amount: 1,
          date: "2023-07-03 16:45",
          status: "pending",
          type: "gift",
          notes: "تحويل بطاقة هدية بقيمة 100 د.م",
        },
        {
          id: "TR-1004",
          senderName: "كريم الفاسي",
          senderPhone: "+212 678901234",
          recipientName: "نادية الرباطي",
          recipientPhone: "+212 689012345",
          amount: 200,
          date: "2023-07-04 09:20",
          status: "rejected",
          type: "coins",
          notes: "رصيد غير كافي",
        },
      ];

      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleChangeStatus = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewStatus(transaction.status);
    setShowStatusChangeDialog(true);
  };

  const confirmStatusChange = () => {
    if (!selectedTransaction) return;

    setTransactions(
      transactions.map((transaction) =>
        transaction.id === selectedTransaction.id
          ? { ...transaction, status: newStatus }
          : transaction,
      ),
    );

    setShowStatusChangeDialog(false);
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            مكتمل
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            قيد الانتظار
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            مرفوض
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "coins":
        return <Coins className="h-4 w-4 text-amber-500" />;
      case "reward":
        return <Award className="h-4 w-4 text-green-500" />;
      case "gift":
        return <Gift className="h-4 w-4 text-purple-500" />;
    }
  };

  const getTypeText = (type: Transaction["type"]) => {
    switch (type) {
      case "coins":
        return "رصيد كوينز";
      case "reward":
        return "بطاقة مكافآت";
      case "gift":
        return "بطاقة هدية";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search term
    const searchMatch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.senderPhone.includes(searchTerm) ||
      transaction.recipientPhone.includes(searchTerm);

    // Filter by status
    const statusMatch =
      statusFilter === "all" || transaction.status === statusFilter;

    // Filter by type
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter;

    return searchMatch && statusMatch && typeMatch;
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
        <h1 className="text-2xl font-bold mb-6">إدارة التحويلات</h1>

        {/* Transactions List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              قائمة التحويلات
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="بحث برقم التحويل أو رقم الهاتف"
                  className="pl-10 pr-4 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-md p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">جميع الحالات</option>
                <option value="completed">مكتمل</option>
                <option value="pending">قيد الانتظار</option>
                <option value="rejected">مرفوض</option>
              </select>
              <select
                className="border rounded-md p-2"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
              >
                <option value="all">جميع الأنواع</option>
                <option value="coins">رصيد كوينز</option>
                <option value="reward">بطاقة مكافآت</option>
                <option value="gift">بطاقة هدية</option>
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم التحويل</TableHead>
                  <TableHead className="text-right">المرسل</TableHead>
                  <TableHead className="text-right">المستلم</TableHead>
                  <TableHead className="text-right">القيمة</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.senderName}</TableCell>
                    <TableCell>{transaction.recipientName}</TableCell>
                    <TableCell>
                      {transaction.type === "coins"
                        ? `${transaction.amount} كوينز`
                        : transaction.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        {getTypeText(transaction.type)}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(transaction)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleChangeStatus(transaction)}
                          title="تغيير الحالة"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                لا توجد تحويلات مطابقة للبحث
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                تحليل التحويلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">الرسم البياني لتحليل التحويلات</p>
                {/* In a real app, you would use a chart library like Chart.js or Recharts */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                توزيع أنواع التحويلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">
                  الرسم البياني لتوزيع أنواع التحويلات
                </p>
                {/* In a real app, you would use a chart library like Chart.js or Recharts */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog
          open={showTransactionDetails}
          onOpenChange={setShowTransactionDetails}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>تفاصيل التحويل</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">رقم التحويل</h3>
                <p>{selectedTransaction.id}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  معلومات المرسل
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">الاسم</p>
                    <p>{selectedTransaction.senderName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p>{selectedTransaction.senderPhone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  معلومات المستلم
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">الاسم</p>
                    <p>{selectedTransaction.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p>{selectedTransaction.recipientPhone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  تفاصيل التحويل
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">القيمة</p>
                    <p>
                      {selectedTransaction.type === "coins"
                        ? `${selectedTransaction.amount} كوينز`
                        : selectedTransaction.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">النوع</p>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(selectedTransaction.type)}
                      {getTypeText(selectedTransaction.type)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">التاريخ</p>
                    <p>{selectedTransaction.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الحالة</p>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                </div>
              </div>

              {selectedTransaction.notes && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">ملاحظات</h3>
                  <p>{selectedTransaction.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleChangeStatus(selectedTransaction)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                تغيير الحالة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Status Dialog */}
      {selectedTransaction && (
        <Dialog
          open={showStatusChangeDialog}
          onOpenChange={setShowStatusChangeDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تغيير حالة التحويل</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>تغيير حالة التحويل رقم: {selectedTransaction.id}</p>

              <div className="mt-4 space-y-2">
                <label className="block font-medium">الحالة الجديدة</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      id="status-completed"
                      name="status"
                      value="completed"
                      checked={newStatus === "completed"}
                      onChange={() => setNewStatus("completed")}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="status-completed"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      مكتمل
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      id="status-pending"
                      name="status"
                      value="pending"
                      checked={newStatus === "pending"}
                      onChange={() => setNewStatus("pending")}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="status-pending"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4 text-amber-500" />
                      قيد الانتظار
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="radio"
                      id="status-rejected"
                      name="status"
                      value="rejected"
                      checked={newStatus === "rejected"}
                      onChange={() => setNewStatus("rejected")}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="status-rejected"
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                      مرفوض
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowStatusChangeDialog(false)}
              >
                إلغاء
              </Button>
              <Button onClick={confirmStatusChange}>تأكيد</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default TransactionsManagement;
