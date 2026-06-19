import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Customer Facing Pages
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AddressManagement = lazy(() => import('./pages/AddressManagement'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const OrderTrackingLookup = lazy(() => import('./pages/OrderTrackingLookup'));
const EditorialPolicy = lazy(() => import('./pages/EditorialPolicy'));
const AuthorProfile = lazy(() => import('./pages/AuthorProfile'));
const BlogListing = lazy(() => import('./pages/BlogListing'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Categories = lazy(() => import('./pages/Categories'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const StaticContentPage = lazy(() => import('./pages/StaticContentPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/AdminCategories'));
const AdminPromotions = lazy(() => import('./pages/AdminPromotions'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminCoupons = lazy(() => import('./pages/AdminCoupons'));
const AdminAuthors = lazy(() => import('./pages/AdminAuthors'));
const AdminBlogs = lazy(() => import('./pages/AdminBlogs'));
const AdminSEO = lazy(() => import('./pages/AdminSEO'));
const AdminPaymentSettings = lazy(() => import('./pages/AdminPaymentSettings'));

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user && (user.username === 'admin' || user.role === 'admin');
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fw-500">Loading page...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Customer Facing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/info/:slug" element={<StaticContentPage />} />
          <Route path="/privacy" element={<Navigate to="/info/privacy-policy" replace />} />
          <Route path="/terms" element={<Navigate to="/info/terms-and-conditions" replace />} />
          <Route path="/shipping" element={<Navigate to="/info/shipping-and-dispatch-policy" replace />} />
          <Route path="/secure-shopping" element={<Navigate to="/info/safe-and-secure-shopping" replace />} />
          <Route path="/secure-packaging" element={<Navigate to="/info/protect-yourself" replace />} />
          <Route path="/cancellation-policy" element={<Navigate to="/info/refund-and-cancellation-policy" replace />} />
          <Route path="/communication-policy" element={<Navigate to="/info/communication-policy" replace />} />
          <Route path="/drug-policy" element={<Navigate to="/info/medicine-and-prescription-policy" replace />} />
          <Route path="/cookie-policy" element={<Navigate to="/info/cookie-policy" replace />} />
          <Route path="/disclaimer" element={<Navigate to="/info/disclaimer" replace />} />
          <Route path="/guarantee" element={<Navigate to="/info/best-price" replace />} />
          <Route path="/medical-disclaimer" element={<Navigate to="/info/warning" replace />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category/:categoryName" element={<Products />} />
          <Route path="/search/:searchQuery" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/blogs" element={<BlogListing />} />
          <Route path="/blogs/category/:categoryName" element={<BlogListing />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/sitemap" element={<Sitemap />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          } />
          <Route path="/my-orders" element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          } />
          <Route path="/wishlist" element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          } />
          <Route path="/addresses" element={
            <PrivateRoute>
              <AddressManagement />
            </PrivateRoute>
          } />
          <Route path="/profile-settings" element={
            <PrivateRoute>
              <ProfileSettings />
            </PrivateRoute>
          } />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/track-order" element={<OrderTrackingLookup />} />
          <Route path="/track-order/:orderId" element={<OrderTracking />} />
          <Route path="/editorial-policy" element={<EditorialPolicy />} />
          <Route path="/author/:authorSlug" element={<AuthorProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/coupons" element={
            <AdminRoute>
              <AdminCoupons />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/promotions" element={
            <AdminRoute>
              <AdminPromotions />
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          } />
          <Route path="/admin/authors" element={
            <AdminRoute>
              <AdminAuthors />
            </AdminRoute>
          } />
          <Route path="/admin/blogs" element={
            <AdminRoute>
              <AdminBlogs />
            </AdminRoute>
          } />
          <Route path="/admin/seo" element={
            <AdminRoute>
              <AdminSEO />
            </AdminRoute>
          } />
          <Route path="/admin/settings/payment" element={
            <AdminRoute>
              <AdminPaymentSettings />
            </AdminRoute>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
