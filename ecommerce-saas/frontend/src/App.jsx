import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ManagementLogin from './pages/auth/ManagementLogin';
import Dashboard from './pages/admin/Dashboard';
import Stores from './pages/admin/Stores';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import ProductVariants from './pages/admin/ProductVariants';
import PackageSelection from './pages/admin/PackageSelection';
import ManagementDashboard from './pages/management/ManagementDashboard';
import PaymentChannels from './pages/management/PaymentChannels';

// Phase 10B Proto imports
import Packages from './pages/management/Packages';
import ManagementStores from './pages/management/ManagementStores';
import ManagementOrders from './pages/management/ManagementOrders';
import ManagementSalesReports from './pages/management/ManagementSalesReports';
import ManagementMerchants from './pages/management/ManagementMerchants';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSalesReports from './pages/admin/AdminSalesReports';
import PrintSalesReport from './pages/admin/PrintSalesReport';
import AdminDashboard from './pages/admin/AdminDashboard';
import Invoice from './pages/admin/Invoice';

import StorefrontHome from './pages/storefront/StorefrontHome';
import ProductDetails from './pages/storefront/ProductDetails';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import OrderSuccess from './pages/storefront/OrderSuccess';
import StorefrontLayout from './components/storefront/StorefrontLayout';
import Landing from './pages/landing/Landing';
import TrackOrder from './pages/storefront/TrackOrder';
import CustomerInvoice from './pages/storefront/CustomerInvoice';

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.type === 'admin') return <Navigate to="/management" replace />;
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.type !== 'admin') return <Navigate to="/management/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen print:h-auto print:bg-white font-sans text-gray-900">
            <Routes>
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              <Route path="/management/login" element={<GuestRoute><ManagementLogin /></GuestRoute>} />

              <Route path="/management" element={<AdminRoute><ManagementDashboard /></AdminRoute>} />
              <Route path="/management/payment-channels" element={<AdminRoute><PaymentChannels /></AdminRoute>} />
              <Route path="/management/packages" element={<AdminRoute><Packages /></AdminRoute>} />
              <Route path="/management/stores" element={<AdminRoute><ManagementStores /></AdminRoute>} />
              <Route path="/management/merchants" element={<AdminRoute><ManagementMerchants /></AdminRoute>} />
              <Route path="/management/orders" element={<AdminRoute><ManagementOrders /></AdminRoute>} />
              <Route path="/management/sales-reports" element={<AdminRoute><ManagementSalesReports /></AdminRoute>} />

              {/* Store Owner (Admin Panel) Scope */}
              <Route path="/admin" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
              <Route path="/admin/:storeId/packages" element={<ProtectedRoute><PackageSelection /></ProtectedRoute>} />
              <Route path="/admin/:storeId/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/admin/:storeId/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/admin/:storeId/products/:productId/variants" element={<ProtectedRoute><ProductVariants /></ProtectedRoute>} />
              <Route path="/admin/:storeId/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/:storeId/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/:storeId/sales-reports" element={<ProtectedRoute><AdminSalesReports /></ProtectedRoute>} />
              <Route path="/admin/:storeId/sales-reports/print" element={<ProtectedRoute><PrintSalesReport /></ProtectedRoute>} />
              <Route path="/admin/:storeId/invoices/:orderId" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />

              {/* Standalone Storefront Print Routes */}
              <Route path="/:storeSlug/orders/:orderId/invoice" element={<CustomerInvoice />} />

              {/* Public Customer Scope mapping organically seamlessly natively structurally strictly decoupled natively explicitly! */}
              <Route path="/:storeSlug" element={<StorefrontLayout />}>
                <Route index element={<StorefrontHome />} />
                <Route path="products/:productSlug" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="orders/:orderId/success" element={<OrderSuccess />} />
                <Route path="track-order" element={<TrackOrder />} />
              </Route>

              {/* Public SaaS Landing Page mapped fluently securely efficiently structurally smartly explicitly softly dynamically smartly confidently */}
              <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
            </Routes>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'font-sans text-sm font-medium shadow-xl border border-gray-100 rounded-2xl',
              duration: 3000,
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
