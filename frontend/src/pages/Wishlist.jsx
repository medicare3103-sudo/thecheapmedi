import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProducts } from '../api';

function Wishlist() {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(saved);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    // Remove from wishlist
    const updated = wishlistItems.filter(item => item.id !== product.id);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    alert(`${product.name} has been moved to your cart!`);
  };

  const handleRemove = (productId) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-5 flex-grow-1">
        <Row>
          {/* Sidebar Navigation */}
          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="p-0">
                <div className="p-4 bg-primary text-white rounded-top-3 text-center">
                  <div className="rounded-circle bg-white text-primary d-inline-flex align-items-center justify-content-center fw-bold fs-3 mb-3" style={{width: '80px', height: '80px'}}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h5 className="fw-bold mb-1">{user?.username || 'Customer'}</h5>
                  <small className="opacity-75">{user?.email || user?.phone || 'Premium Member'}</small>
                </div>
                
                <Nav className="flex-column py-3 custom-dashboard-nav">
                  <Nav.Link as={Link} to="/dashboard" className={`text-dark fw-500 py-3 px-4 ${location.pathname === '/dashboard' ? 'active border-start border-4 border-primary bg-light' : 'text-secondary'}`}>
                    <i className="bi bi-grid-1x2 me-2"></i> Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-orders" className={`text-dark fw-500 py-3 px-4 ${location.pathname === '/my-orders' ? 'active border-start border-4 border-primary bg-light' : 'text-secondary'}`}>
                    <i className="bi bi-box-seam me-2"></i> My Orders
                  </Nav.Link>
                  <Nav.Link as={Link} to="/wishlist" className={`text-dark fw-500 py-3 px-4 d-flex justify-content-between align-items-center ${location.pathname === '/wishlist' ? 'active border-start border-4 border-primary bg-light' : 'text-secondary'}`}>
                    <span><i className="bi bi-heart me-2"></i> Wishlist</span>
                    <Badge bg="danger" pill>{wishlistItems.length}</Badge>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/addresses" className={`text-dark fw-500 py-3 px-4 ${location.pathname === '/addresses' ? 'active border-start border-4 border-primary bg-light' : 'text-secondary'}`}>
                    <i className="bi bi-geo-alt me-2"></i> Addresses
                  </Nav.Link>
                  <Nav.Link as={Link} to="/profile-settings" className={`text-dark fw-500 py-3 px-4 ${location.pathname === '/profile-settings' ? 'active border-start border-4 border-primary bg-light' : 'text-secondary'}`}>
                    <i className="bi bi-person me-2"></i> Profile Settings
                  </Nav.Link>
                  <hr className="my-2 opacity-10" />
                  <Nav.Link onClick={handleLogout} className="text-danger fw-500 py-3 px-4 cursor-pointer">
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content Area */}
          <Col md={9}>
            <div className="mb-4">
              <h2 className="fw-bold mb-1">My Wishlist</h2>
              <p className="text-muted">Saved products that you want to buy later.</p>
            </div>

            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="mb-0 fw-bold">Saved Items ({wishlistItems.length})</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {loading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-heart-break fs-1 mb-3 d-block"></i>
                    <p className="fs-5">Your wishlist is empty.</p>
                    <Button as={Link} to="/products" variant="primary" className="fw-bold px-4">Browse Products</Button>
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
                          <p className="text-muted small mb-2">{product.brand || 'Generic'} • {product.category}</p>
                          <h5 className="fw-bold mb-0">${parseFloat(product.price).toFixed(2)}</h5>
                        </Col>
                        <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="px-3 fw-500"
                            onClick={() => handleRemove(product.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="px-4 fw-500 d-flex align-items-center"
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
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default Wishlist;
