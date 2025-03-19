import { Suspense, lazy, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Lazy load pages for better performance
const StorePage = lazy(() => import("./components/store"));
const LoyaltyPage = lazy(() => import("./components/loyalty"));
const WalletPage = lazy(() => import("./components/wallet"));
const OrdersPage = lazy(() => import("./components/orders"));
const ProfilePage = lazy(() => import("./components/profile"));
const AboutPage = lazy(() => import("./components/about"));
const CartPage = lazy(() => import("./components/cart"));
const CardsDiscoveryPage = lazy(() => import("./components/cards"));
const LoginPage = lazy(() => import("./components/login"));
const PromotionsPage = lazy(() => import("./components/promotions"));

// Admin pages
const AdminLoginPage = lazy(() => import("./components/admin/LoginPage"));
const AdminDashboardPage = lazy(() => import("./components/admin/Dashboard"));
const AdminStoreManagementPage = lazy(
  () => import("./components/admin/StoreManagement"),
);
const AdminOrdersManagementPage = lazy(
  () => import("./components/admin/OrdersManagement"),
);
const AdminUsersManagementPage = lazy(
  () => import("./components/admin/UsersManagement"),
);
const AdminTransactionsManagementPage = lazy(
  () => import("./components/admin/TransactionsManagement"),
);
const AdminAnalyticsDashboardPage = lazy(
  () => import("./components/admin/AnalyticsDashboard"),
);
const AdminCardsManagementPage = lazy(
  () => import("./components/admin/CardsManagement"),
);

// Protected route component for user interface
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protected route component for admin dashboard
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Check if the app is running in Tempo environment
    if (import.meta.env.VITE_TEMPO !== "true") {
      // Set a default login state for demo purposes
      if (localStorage.getItem("isLoggedIn") === null) {
        localStorage.setItem("isLoggedIn", "true");
      }
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <StorePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/loyalty"
            element={
              <ProtectedRoute>
                <LoyaltyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cards"
            element={
              <ProtectedRoute>
                <CardsDiscoveryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/promotions"
            element={
              <ProtectedRoute>
                <PromotionsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/store"
            element={
              <AdminProtectedRoute>
                <AdminStoreManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminOrdersManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsersManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <AdminProtectedRoute>
                <AdminTransactionsManagementPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <AdminAnalyticsDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/cards"
            element={
              <AdminProtectedRoute>
                <AdminCardsManagementPage />
              </AdminProtectedRoute>
            }
          />

          {/* Add this before the catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}

          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
