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
import OrderTracking from './pages/OrderTracking';
import OrderTrackingLookup from './pages/OrderTrackingLookup';
import EditorialPolicy from './pages/EditorialPolicy';
import AuthorProfile from './pages/AuthorProfile';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ShippingPolicy from './pages/ShippingPolicy';
import SecureShopping from './pages/SecureShopping';
import SecurePackaging from './pages/SecurePackaging';
import Categories from './pages/Categories';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminCoupons from './pages/AdminCoupons';
import AdminAuthors from './pages/AdminAuthors';
import AdminBlogs from './pages/AdminBlogs';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
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
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/secure-shopping" element={<SecureShopping />} />
        <Route path="/secure-packaging" element={<SecurePackaging />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/blogs" element={<BlogListing />} />
        <Route path="/blogs/category/:categoryName" element={<BlogListing />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
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
        <Route path="/track-order" element={<OrderTrackingLookup />} />
        <Route path="/track-order/:orderId" element={<OrderTracking />} />
        <Route path="/editorial-policy" element={<EditorialPolicy />} />
        <Route path="/author/:authorSlug" element={<AuthorProfile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/users" element={
          <PrivateRoute>
            <AdminUsers />
          </PrivateRoute>
        } />
        <Route path="/admin/coupons" element={
          <PrivateRoute>
            <AdminCoupons />
          </PrivateRoute>
        } />
        <Route path="/admin/orders" element={
          <PrivateRoute>
            <AdminOrders />
          </PrivateRoute>
        } />
        <Route path="/admin/products" element={
          <PrivateRoute>
            <AdminProducts />
          </PrivateRoute>
        } />
        <Route path="/admin/categories" element={
          <PrivateRoute>
            <AdminCategories />
          </PrivateRoute>
        } />
        <Route path="/admin/authors" element={
          <PrivateRoute>
            <AdminAuthors />
          </PrivateRoute>
        } />
        <Route path="/admin/blogs" element={
          <PrivateRoute>
            <AdminBlogs />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
