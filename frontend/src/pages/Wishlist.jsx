import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';

function Wishlist() {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(saved);
    setLoading(false);
  }, []);

  const handleMoveToCart = (product) => {
    addToCart(product);
    const updated = wishlistItems.filter(item => item.id !== product.id);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleRemove = (productId) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  return (
    <CustomerLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Wishlist</h2>
        <p className="text-muted">Saved products that you want to buy later.</p>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom p-4">
          <h5 className="mb-0 fw-bold text-dark">Saved Items ({wishlistItems.length})</h5>
        </Card.Header>
        <Card.Body className="p-4">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-heart-break fs-1 mb-3 d-block"></i>
              <p className="fs-5">Your wishlist is empty.</p>
              <Button as={Link} to="/products" variant="primary" className="fw-bold px-4 border-0">Browse Products</Button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {wishlistItems.map((product) => (
                <Row key={product.id} className="align-items-center border-bottom pb-4">
                  <Col xs={3} md={2}>
                    <Image src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} fluid rounded className="border" />
                  </Col>
                  <Col xs={9} md={6}>
                    <h5 className="fw-bold mb-1 text-primary">{product.name}</h5>
                    <p className="text-muted small mb-2">{product.category}</p>
                    <h5 className="fw-bold mb-0">${parseFloat(product.price).toFixed(2)}</h5>
                  </Col>
                  <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="px-3 fw-bold rounded-pill"
                      onClick={() => handleRemove(product.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="px-4 fw-bold rounded-pill d-flex align-items-center border-0"
                      onClick={() => handleMoveToCart(product)}
                    >
                      <i className="bi bi-cart-plus me-2"></i> Move to Cart
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </CustomerLayout>
  );
}

export default Wishlist;
