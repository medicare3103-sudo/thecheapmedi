import React, { createContext, useState, useContext } from 'react';

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

  const applyCoupon = (code) => {
    // Mock logic: 20% discount if code is SAVE20
    if (code.toUpperCase() === 'SAVE20') {
      setAppliedCoupon({ code: 'SAVE20', discountPercent: 20 });
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? cartTotal * (appliedCoupon.discountPercent / 100) : 0;
  const finalTotal = cartTotal - discountAmount;
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
