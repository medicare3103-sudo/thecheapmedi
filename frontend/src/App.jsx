import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';
import AddressManagement from './pages/AddressManagement';
import ProfileSettings from './pages/ProfileSettings';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Payment from './pages/Payment';
import OrderTracking from './pages/OrderTracking';
import OrderTrackingLookup from './pages/OrderTrackingLookup';
import EditorialPolicy from './pages/EditorialPolicy';
import AuthorProfile from './pages/AuthorProfile';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminPromotions from './pages/AdminPromotions';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminCoupons from './pages/AdminCoupons';
import AdminAuthors from './pages/AdminAuthors';
import AdminBlogs from './pages/AdminBlogs';
import AdminSEO from './pages/AdminSEO';
import Sitemap from './pages/Sitemap';
import StaticContentPage from './pages/StaticContentPage';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

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
      </Routes>
    </Router>
  );
}

export default App;
