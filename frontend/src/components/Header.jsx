import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Navbar, Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar d-none d-md-block">
        <Container>
          <Row>
            <Col md={6}>
              <span>Support: +1 (800) 123-4567 | info@medicareshop.com</span>
            </Col>
            <Col md={6} className="text-end">
              <span className="me-3">Currency: USD</span>
              <span>Language: English</span>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Header */}
      <header className="main-header py-3">
        <Container>
          <Row className="align-items-center">
            {/* Logo */}
            <Col xs={12} md={3} className="mb-3 mb-md-0 text-center text-md-start">
              <Link to="/" className="text-decoration-none">
                <h2 className="text-primary fw-bold mb-0">Medicare Shop</h2>
              </Link>
            </Col>

            {/* Search Bar */}
            <Col xs={12} md={5} className="mb-3 mb-md-0">
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <Form.Control
                    placeholder="Search for medicines, health products..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="primary" className="rounded-end px-4" style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>

            {/* Account & Cart */}
            <Col xs={12} md={4} className="text-center text-md-end">
              {user ? (
                <span className="me-4 text-secondary fw-500">
                  Hi, {user.username || user.email || user.phone} | <span style={{cursor: 'pointer', color: 'red'}} onClick={logout}>Logout</span>
                </span>
              ) : (
                <Link to="/login" className="me-4 text-decoration-none text-secondary fw-500">
                  👤 Sign In / Register
                </Link>
              )}
              
              <Link to="/cart" className="text-decoration-none text-secondary position-relative">
                <span className="fs-5">🛒 Cart</span>
                {cartCount > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Mega Menu / Categories Navigation */}
      <Navbar bg="light" expand="lg" className="border-bottom">
        <Container>
          <Navbar.Toggle aria-controls="category-nav" />
          <Navbar.Collapse id="category-nav">
            <Nav className="me-auto fw-500">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/categories">All Categories</Nav.Link>
              <Nav.Link as={Link} to="/products?category=Diabetes">Diabetes Care</Nav.Link>
              <Nav.Link as={Link} to="/products?category=Skin%20Care">Skin Care</Nav.Link>
              <Nav.Link as={Link} to="/products?category=Antibiotics">Antibiotics</Nav.Link>
              <Nav.Link as={Link} to="/blogs">Health Blog</Nav.Link>
            </Nav>
            {user && (
              <Nav>
                <Link to="/admin" className="btn btn-outline-danger btn-sm fw-bold me-2">Admin Dashboard</Link>
                <Link to="/dashboard" className="btn btn-outline-primary btn-sm fw-bold">My Dashboard</Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
