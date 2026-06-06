import React, { createContext, useState, useContext } from 'react';
import { getCoupons } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const addToCart = (product, packSize = null, qty = 1, priceOverride = null) => {
    setCartItems(prev => {
      const uniqueId = packSize ? `${product.id}-${packSize}` : `${product.id}`;
      const existing = prev.find(item => (item.uniqueId || item.id.toString()) === uniqueId.toString());
      if (existing) {
        return prev.map(item => 
          (item.uniqueId || item.id.toString()) === uniqueId.toString() ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, uniqueId, packSize, quantity: qty, price: priceOverride !== null ? priceOverride : product.price }];
    });
  };

  const updateQuantity = (uniqueId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      (item.uniqueId || item.id.toString()) === uniqueId.toString() ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (uniqueId) => {
    setCartItems(prev => prev.filter(item => (item.uniqueId || item.id.toString()) !== uniqueId.toString()));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const coupons = await getCoupons();
      let matched = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      
      // Fallback for default mock coupon if not created in backend yet
      if (!matched && code.trim().toUpperCase() === 'SAVE20') {
        matched = {
          code: 'SAVE20',
          discount_type: 'percentage',
          discount_value: 20,
          is_active: true
        };
      }
      
      if (!matched) {
        return { success: false, message: 'Invalid coupon code.' };
      }
      if (!matched.is_active) {
        return { success: false, message: 'This coupon is inactive.' };
      }
      if (matched.expiry_date && new Date(matched.expiry_date) < new Date()) {
        return { success: false, message: 'This coupon has expired.' };
      }
      if (matched.min_purchase && cartTotal < parseFloat(matched.min_purchase)) {
        return { success: false, message: `Minimum purchase of $${parseFloat(matched.min_purchase).toFixed(2)} required.` };
      }
      
      setAppliedCoupon(matched);
      return { success: true };
    } catch (err) {
      console.error("Error applying coupon:", err);
      // Fallback to SAVE20 check if API fails
      if (code.trim().toUpperCase() === 'SAVE20') {
        const fallback = {
          code: 'SAVE20',
          discount_type: 'percentage',
          discount_value: 20,
          is_active: true
        };
        setAppliedCoupon(fallback);
        return { success: true };
      }
      return { success: false, message: 'Error validating coupon with backend.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'fixed' 
        ? Math.min(parseFloat(appliedCoupon.discount_value), cartTotal) 
        : cartTotal * (parseFloat(appliedCoupon.discount_value) / 100))
    : 0;
    
  const finalTotal = Math.max(0, cartTotal - discountAmount);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartTotal, cartCount, appliedCoupon, applyCoupon, removeCoupon,
      discountAmount, finalTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
