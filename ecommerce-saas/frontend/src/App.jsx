import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';
import Dashboard from './pages/tenant/Dashboard';
import Stores from './pages/tenant/Stores';
import Categories from './pages/tenant/Categories';
import Products from './pages/tenant/Products';
import ProductVariants from './pages/tenant/ProductVariants';
import PackageSelection from './pages/tenant/PackageSelection';
import AdminDashboard from './pages/admin/AdminDashboard';
import PaymentChannels from './pages/admin/PaymentChannels';

// Phase 10B Proto imports
import Packages from './pages/admin/Packages';
import AdminStores from './pages/admin/AdminStores';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSalesReports from './pages/admin/AdminSalesReports';
import OwnerOrders from './pages/tenant/OwnerOrders';
import OwnerSalesReports from './pages/tenant/OwnerSalesReports';
import Invoice from './pages/tenant/Invoice';

import StorefrontHome from './pages/storefront/StorefrontHome';
import ProductDetails from './pages/storefront/ProductDetails';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import OrderSuccess from './pages/storefront/OrderSuccess';

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.type === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.type !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <Routes>
              <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/payment-channels" element={<AdminRoute><PaymentChannels /></AdminRoute>} />
              <Route path="/admin/packages" element={<AdminRoute><Packages /></AdminRoute>} />
              <Route path="/admin/stores" element={<AdminRoute><AdminStores /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/sales-reports" element={<AdminRoute><AdminSalesReports /></AdminRoute>} />

              {/* Management Scope */}
              <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
              <Route path="/stores/:storeId/packages" element={<ProtectedRoute><PackageSelection /></ProtectedRoute>} />
              <Route path="/stores/:storeId/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/stores/:storeId/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
              <Route path="/products/:productId/variants" element={<ProtectedRoute><ProductVariants /></ProtectedRoute>} />
              <Route path="/stores/:storeId/orders" element={<ProtectedRoute><OwnerOrders /></ProtectedRoute>} />
              <Route path="/stores/:storeId/sales-reports" element={<ProtectedRoute><OwnerSalesReports /></ProtectedRoute>} />
              <Route path="/invoices/:orderId" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />

              {/* Public Customer Scope mapping organically seamlessly natively structurally strictly decoupled natively explicitly! */}
              <Route path="/:storeSlug" element={<StorefrontHome />} />
              <Route path="/:storeSlug/products/:productSlug" element={<ProductDetails />} />
              <Route path="/:storeSlug/cart" element={<Cart />} />
              <Route path="/:storeSlug/checkout" element={<Checkout />} />
              <Route path="/:storeSlug/orders/:orderId/success" element={<OrderSuccess />} />

              {/* Default redirect to dashboard internally */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
