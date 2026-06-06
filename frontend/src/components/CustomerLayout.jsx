import React from 'react';
import { Container, Row, Col, Card, Nav, Badge, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function CustomerLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileCompleteness = () => {
    let score = 25;
    if (user?.username && user.username.trim()) score += 25;
    if (user?.email && user.email.trim()) score += 25;
    if ((user?.phone || user?.phone_number) && String(user.phone || user.phone_number).trim()) score += 25;
    return score;
  };

  const profileCompleteness = getProfileCompleteness();

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-5 flex-grow-1 page-fade-in">
        
        {/* Modern Profile Banner Card */}
        <Card className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
          <div className="p-4 p-md-5 text-white" style={{ background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)' }}>
            <Row className="align-items-center gy-4">
              <Col md={8} className="d-flex align-items-center flex-wrap flex-sm-nowrap gap-4 text-center text-sm-start">
                <div className="position-relative mx-auto mx-sm-0">
                  <div className="rounded-circle bg-white text-primary d-inline-flex align-items-center justify-content-center fw-bold shadow-lg" style={{width: '90px', height: '90px', fontSize: '2.5rem', border: '3px solid rgba(255,255,255,0.4)'}}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <Badge bg="success" className="position-absolute bottom-0 end-0 border border-2 border-white rounded-circle p-2" title="Account Active">
                    <span className="visually-hidden">Active</span>
                  </Badge>
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start gap-2 mb-1">
                    <h3 className="fw-bold mb-0 text-white">{user?.username || 'Customer'}</h3>
                    <Badge bg="info" className="text-white small fw-bold px-2 py-1" style={{ fontSize: '0.7rem' }}>Gold Patient Tier</Badge>
                  </div>
                  <p className="mb-2 opacity-90"><i className="bi bi-envelope me-2"></i>{user?.email || 'customer@medicare.com'}</p>
                  <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-3 text-white-50 small">
                    <span><i className="bi bi-calendar3 me-1"></i> Member Since: June 2025</span>
                    <span><i className="bi bi-shield-check me-1"></i> ID Verified</span>
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-center text-md-end">
                <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10 shadow-xs" style={{ maxWidth: '280px', margin: '0 auto' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-white-50">Profile Strength</span>
                    <span className="fw-bold text-white small">{profileCompleteness}%</span>
                  </div>
                  <ProgressBar now={profileCompleteness} variant="info" className="mb-2" style={{ height: '8px' }} />
                  <Link to="/profile-settings" className="text-info text-decoration-underline small fw-bold"><i className="bi bi-pencil-square me-1"></i>Complete Your Profile</Link>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <Row>
          {/* Sidebar Navigation */}
          <Col lg={3} md={4} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Body className="p-0">
                <div className="p-4 border-bottom bg-light">
                  <h6 className="fw-bold mb-1 text-dark">Navigation</h6>
                  <p className="text-muted small mb-0">Manage your prescription settings</p>
                </div>
                <Nav className="flex-column py-2 custom-dashboard-nav">
                  <Nav.Link as={Link} to="/dashboard" className={`fw-bold py-3 px-4 d-flex align-items-center ${location.pathname === '/dashboard' ? 'text-primary bg-primary bg-opacity-10 border-start border-4 border-primary' : 'text-secondary'}`}>
                    <i className="bi bi-grid-1x2 me-3 fs-5"></i> Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/my-orders" className={`fw-bold py-3 px-4 d-flex align-items-center ${location.pathname === '/my-orders' ? 'text-primary bg-primary bg-opacity-10 border-start border-4 border-primary' : 'text-secondary'}`}>
                    <i className="bi bi-box-seam me-3 fs-5"></i> My Orders
                  </Nav.Link>
                  <Nav.Link as={Link} to="/wishlist" className={`fw-bold py-3 px-4 d-flex align-items-center justify-content-between ${location.pathname === '/wishlist' ? 'text-primary bg-primary bg-opacity-10 border-start border-4 border-primary' : 'text-secondary'}`}>
                    <span className="d-flex align-items-center"><i className="bi bi-heart me-3 fs-5"></i> Wishlist</span>
                    <Badge bg="danger" pill className="px-2 py-1">3</Badge>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/addresses" className={`fw-bold py-3 px-4 d-flex align-items-center ${location.pathname === '/addresses' ? 'text-primary bg-primary bg-opacity-10 border-start border-4 border-primary' : 'text-secondary'}`}>
                    <i className="bi bi-geo-alt me-3 fs-5"></i> Addresses
                  </Nav.Link>
                  <Nav.Link as={Link} to="/profile-settings" className={`fw-bold py-3 px-4 d-flex align-items-center ${location.pathname === '/profile-settings' ? 'text-primary bg-primary bg-opacity-10 border-start border-4 border-primary' : 'text-secondary'}`}>
                    <i className="bi bi-person me-3 fs-5"></i> Profile Settings
                  </Nav.Link>
                  <hr className="my-2 opacity-10" />
                  <Nav.Link onClick={handleLogout} className="text-danger fw-bold py-3 px-4 cursor-pointer d-flex align-items-center">
                    <i className="bi bi-box-arrow-right me-3 fs-5"></i> Logout
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content Area */}
          <Col lg={9} md={8}>
            {children}
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default CustomerLayout;
