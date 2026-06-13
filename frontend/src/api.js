import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const getBlogs = async () => {
  const response = await api.get('/blogs/');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products/', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories/', categoryData);
  return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`/categories/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};

export const getOrders = async (status = null) => {
  const params = status && status !== 'All' ? { status } : {};
  const response = await api.get('/orders/', { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, status, estimatedDelivery = null, courier = null, trackingNumber = null) => {
  const response = await api.put(`/orders/${orderId}/status`, { 
    status,
    estimated_delivery: estimatedDelivery,
    courier,
    tracking_number: trackingNumber
  });
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users/');
  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await api.put(`/users/${userId}/status`, { is_active: isActive });
  return response.data;
};

export const getCoupons = async () => {
  const response = await api.get('/coupons/');
  return response.data;
};

export const createCoupon = async (couponData) => {
  const response = await api.post('/coupons/', couponData);
  return response.data;
};

export const updateCoupon = async (couponId, couponData) => {
  const response = await api.put(`/coupons/${couponId}`, couponData);
  return response.data;
};

export const deleteCoupon = async (couponId) => {
  const response = await api.delete(`/coupons/${couponId}`);
  return response.data;
};

export const createBlog = async (blogData) => {
  const response = await api.post('/blogs/', blogData);
  return response.data;
};

export const getBlog = async (blogId) => {
  const response = await api.get(`/blogs/${blogId}`);
  return response.data;
};

export const updateBlog = async (blogId, blogData) => {
  const response = await api.put(`/blogs/${blogId}`, blogData);
  return response.data;
};

export const deleteBlog = async (blogId) => {
  const response = await api.delete(`/blogs/${blogId}`);
  return response.data;
};

export const loginUser = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const signupUser = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const loginPhone = async (phone_number, otp) => {
  const response = await api.post('/auth/login/phone', { phone_number, otp });
  return response.data;
};

export const loginGoogle = async (token) => {
  const response = await api.post('/auth/login/google', { token });
  return response.data;
};

export const forgotPassword = async (contact) => {
  const response = await api.post('/auth/forgot-password', { contact });
  return response.data;
};

export const verifyOtp = async (contact, otp) => {
  const response = await api.post('/auth/verify-otp', { contact, otp });
  return response.data;
};

export const resetPassword = async (contact, otp, new_password) => {
  const response = await api.post('/auth/reset-password', { contact, otp, new_password });
  return response.data;
};

export const getAdminAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const getAuthors = async () => {
  const response = await api.get('/authors/');
  return response.data;
};

export const getAuthor = async (slug) => {
  const response = await api.get(`/authors/${slug}`);
  return response.data;
};

export const createAuthor = async (authorData) => {
  const response = await api.post('/authors/', authorData);
  return response.data;
};

export const updateAuthor = async (slug, authorData) => {
  const response = await api.put(`/authors/${slug}`, authorData);
  return response.data;
};

export const deleteAuthor = async (slug) => {
  const response = await api.delete(`/authors/${slug}`);
  return response.data;
};

export const sendCheckoutOtp = async (email) => {
  const response = await api.post('/auth/send-email-otp', { email });
  return response.data;
};

export const verifyCheckoutOtp = async (email, otp) => {
  const response = await api.post('/auth/verify-email-otp', { email, otp });
  return response.data;
};

export const loginEmailOtp = async (email, otp) => {
  const response = await api.post('/auth/login/email-otp', { email, otp });
  return response.data;
};

export const getSEOSettings = async () => {
  const response = await api.get('/settings/seo');
  return response.data;
};

export const updateSEOSettings = async (settingsData) => {
  const response = await api.post('/settings/seo', settingsData);
  return response.data;
};

export default api;

