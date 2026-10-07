import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductVariants from './pages/ProductVariants';
import PackageSelection from './pages/PackageSelection';
import AdminDashboard from './pages/AdminDashboard';
import PaymentChannels from './pages/admin/PaymentChannels';

// Phase 10B Proto imports
import Packages from './pages/admin/Packages';
import AdminStores from './pages/admin/AdminStores';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSalesReports from './pages/admin/AdminSalesReports';
import OwnerOrders from './pages/OwnerOrders';
import OwnerSalesReports from './pages/OwnerSalesReports';
import Invoice from './pages/Invoice';

import StorefrontHome from './pages/storefront/StorefrontHome';
import ProductDetails from './pages/storefront/ProductDetails';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import OrderSuccess from './pages/storefront/OrderSuccess';

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
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

              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/payment-channels" element={<ProtectedRoute><PaymentChannels /></ProtectedRoute>} />
              <Route path="/admin/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
              <Route path="/admin/stores" element={<ProtectedRoute><AdminStores /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/sales-reports" element={<ProtectedRoute><AdminSalesReports /></ProtectedRoute>} />

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
