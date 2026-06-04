import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProfileSettings() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || ''
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Simulate API Call Delay
    setTimeout(() => {
      try {
        updateUser({
          username: formData.name,
          email: formData.email,
          phone: formData.phone
        });
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile.');
      } finally {
        setLoading(false);
      }
    }, 800);
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
                    <Badge bg="danger" pill>3</Badge>
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
              <h2 className="fw-bold mb-1">Profile Settings</h2>
              <p className="text-muted">Update your personal information and contact details.</p>
            </div>

            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="mb-0 fw-bold">Personal Information</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {success && <Alert variant="success" className="rounded-3">{success}</Alert>}
                {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-500 text-secondary">Full Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          required 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          placeholder="John Doe"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-500 text-secondary">Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          placeholder="john@example.com"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-500 text-secondary">Mobile Number</Form.Label>
                        <Form.Control 
                          type="tel" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          placeholder="+1 (555) 000-0000"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-4 pt-3 border-top">
                    <Button variant="primary" type="submit" className="fw-bold px-4 py-2" disabled={loading}>
                      {loading ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default ProfileSettings;
