import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { getCoupons } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Custom Premium Toast Notification for Cart Additions
const CartToast = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const duration = 4000; // 4 seconds auto-dismiss

  const startTimer = () => {
    const startTime = Date.now();
    const endTime = startTime + duration * (progress / 100);
    
    timerRef.current = setTimeout(() => {
      onClose();
    }, duration * (progress / 100));

    progressIntervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();
      const pct = Math.max(0, (remaining / duration) * 100);
      setProgress(pct);
      if (pct <= 0) {
        clearInterval(progressIntervalRef.current);
      }
    }, 10);
  };

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    if (toast.show) {
      setProgress(100);
      startTimer();
    }
    return () => {
      pauseTimer();
    };
  }, [toast.show, toast.product?.id, toast.packSize, toast.timestamp]);

  if (!toast.show || !toast.product) return null;

  const { product, packSize, quantity, price } = toast;
  const imageUrl = product.image_url || 'https://cmedia.cheapmedicineshop.com/media/all_cat/herbal.png';

  return (
    <div 
      className="cart-toast-wrapper shadow-lg border"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      {/* Toast Header */}
      <div className="cart-toast-header">
        <div className="d-flex align-items-center gap-2">
          <span className="success-icon">✓</span>
          <span className="success-title">Item Added to Cart</span>
        </div>
        <button className="btn-close-toast" onClick={onClose}>&times;</button>
      </div>

      {/* Toast Body */}
      <div className="cart-toast-body">
        <div className="cart-toast-img-wrap">
          <img src={imageUrl} alt={product.name} />
        </div>
        <div className="cart-toast-info">
          <div className="cart-toast-name">{product.name}</div>
          {packSize && (
            <div className="cart-toast-meta text-muted">
              Pack Size: <span className="fw-semibold text-dark">{packSize}</span>
            </div>
          )}
          <div className="cart-toast-price-qty">
            <span className="qty-badge">{quantity}x</span>
            <span className="price-tag">${parseFloat(price).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Toast Actions */}
      <div className="cart-toast-actions">
        <button className="btn-toast-secondary" onClick={onClose}>
          Continue Shopping
        </button>
        <button
          className="btn-toast-primary"
          onClick={() => { window.location.href = '/cart'; }}
        >
          View Cart & Checkout
        </button>
      </div>

      {/* Animated Progress Bar */}
      <div className="cart-toast-progress-bar-container">
        <div 
          className="cart-toast-progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <style>{`
        .cart-toast-wrapper {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 10000;
          width: 360px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(229, 231, 235, 0.8) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          overflow: hidden;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        @keyframes slideIn {
          from {
            transform: translateX(120%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        .cart-toast-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(243, 244, 246, 0.8);
        }

        .success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background-color: #10b981;
          color: white;
          border-radius: 50%;
          font-size: 11px;
          font-weight: bold;
        }

        .success-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
        }

        .btn-close-toast {
          background: none;
          border: none;
          font-size: 1.5rem;
          line-height: 1;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          margin: 0;
          transition: color 0.2s ease;
        }

        .btn-close-toast:hover {
          color: #4b5563;
        }

        .cart-toast-body {
          display: flex;
          gap: 16px;
          padding: 16px;
        }

        .cart-toast-img-wrap {
          flex-shrink: 0;
          width: 68px;
          height: 68px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 4px;
        }

        .cart-toast-img-wrap img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .cart-toast-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-grow: 1;
          min-width: 0;
        }

        .cart-toast-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-toast-meta {
          font-size: 0.8rem;
          margin-bottom: 6px;
        }

        .cart-toast-price-qty {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qty-badge {
          font-size: 0.8rem;
          font-weight: 600;
          color: #0b5cff;
          background: rgba(11, 92, 255, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
        }

        .price-tag {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
        }

        .cart-toast-actions {
          display: flex;
          gap: 12px;
          padding: 0 16px 16px 16px;
        }

        .btn-toast-secondary {
          flex: 1;
          background: #f3f4f6;
          color: #4b5563;
          border: none;
          padding: 9px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          text-align: center;
        }

        .btn-toast-secondary:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .btn-toast-primary {
          flex: 1.2;
          background: #0b5cff;
          color: white;
          border: none;
          padding: 9px 12px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
          text-align: center;
          text-decoration: none;
        }

        .btn-toast-primary:hover {
          background: #004ecc;
          color: white;
        }

        .btn-toast-primary:active {
          transform: scale(0.98);
        }

        .cart-toast-progress-bar-container {
          width: 100%;
          height: 3px;
          background: #f3f4f6;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .cart-toast-progress-bar {
          height: 100%;
          background: #10b981;
          transition: width 0.01s linear;
        }

        @media (max-width: 480px) {
          .cart-toast-wrapper {
            top: 12px;
            right: 12px;
            left: 12px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on first render
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toast, setToast] = useState({ show: false, product: null, packSize: null, quantity: 1, price: 0, timestamp: 0 });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, packSize = null, qty = 1, priceOverride = null) => {
    const finalPrice = priceOverride !== null ? priceOverride : product.price;
    setCartItems(prev => {
      const uniqueId = packSize ? `${product.id}-${packSize}` : `${product.id}`;
      const existing = prev.find(item => (item.uniqueId || item.id.toString()) === uniqueId.toString());
      if (existing) {
        return prev.map(item => 
          (item.uniqueId || item.id.toString()) === uniqueId.toString() ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, uniqueId, packSize, quantity: qty, price: finalPrice }];
    });

    // Trigger toast notification
    setToast({
      show: true,
      product,
      packSize,
      quantity: qty,
      price: finalPrice,
      timestamp: Date.now()
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
      <CartToast toast={toast} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
    </CartContext.Provider>
  );
};
