import React from 'react';
import { Container, Row, Col, Card, Nav, Badge, Table, Button, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Expanded Mock Data
  const mockOrders = [
    { id: 'ORD-54321', date: '2026-06-01', total: '$120.50', status: 'Processing', items: 3, tracking: 'USPS: 9400100000000000000000' },
    { id: 'ORD-54300', date: '2026-05-15', total: '$45.00', status: 'Delivered', items: 1, tracking: 'USPS: 9400100000000000000011' },
    { id: 'ORD-54210', date: '2026-04-22', total: '$210.00', status: 'Delivered', items: 5, tracking: 'USPS: 9400100000000000000022' }
  ];

  const mockPrescriptions = [
    { id: 'RX-9821', drug: 'Lantus Solostar Insulin Pen', dosage: '100 U/mL', doctor: 'Dr. Sarah Jenkins', status: 'Approved', expiry: 'Dec 15, 2026' },
    { id: 'RX-7740', drug: 'Amoxil (Amoxicillin Capsules)', dosage: '500mg', doctor: 'Dr. Sarah Jenkins', status: 'Expired', expiry: 'May 01, 2026' }
  ];

  const profileCompleteness = 85;

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-5 flex-grow-1">
        
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
            
            {/* Quick Metrics Cards */}
            <Row className="g-4 mb-4">
              <Col sm={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="d-flex align-items-center p-4">
                    <div className="rounded-3 bg-primary bg-opacity-10 p-3 me-3 text-primary">
                      <i className="bi bi-bag-check fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0 text-dark">12</h3>
                      <span className="text-muted small fw-bold">Total Orders</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="d-flex align-items-center p-4">
                    <div className="rounded-3 bg-success bg-opacity-10 p-3 me-3 text-success">
                      <i className="bi bi-currency-dollar fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0 text-dark">$15.00</h3>
                      <span className="text-muted small fw-bold">Wallet Balance</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Card.Body className="d-flex align-items-center p-4">
                    <div className="rounded-3 bg-danger bg-opacity-10 p-3 me-3 text-danger">
                      <i className="bi bi-file-earmark-medical fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0 text-dark">2</h3>
                      <span className="text-muted small fw-bold">Active Rx Docs</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Smart Refill Callout Card */}
            <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white overflow-hidden border-start border-4 border-warning">
              <Card.Body className="p-4">
                <Row className="align-items-center gy-3">
                  <Col md={9}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-warning text-dark fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Refill Due</span>
                      <span className="text-muted small fw-500">Last ordered 30 days ago</span>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Lantus Solostar Insulin Pen (5x 3mL)</h5>
                    <p className="text-secondary small mb-0">It is recommended to reorder now to ensure your prescription therapy is not interrupted. USPS shipping takes approximately 3-5 business days.</p>
                  </Col>
                  <Col md={3} className="text-md-end">
                    <Button as={Link} to="/cart" variant="primary" className="fw-bold px-4 py-2 rounded-pill shadow-sm border-0">
                      <i className="bi bi-arrow-repeat me-1"></i> Quick Refill
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Prescriptions Section */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Header className="bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-file-earmark-medical me-2 text-primary"></i>My Prescriptions</h5>
                <Button variant="link" className="text-primary text-decoration-none fw-bold p-0">Upload New Rx</Button>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  {mockPrescriptions.map((rx) => (
                    <Col md={6} key={rx.id}>
                      <div className="border rounded-3 p-3 bg-light d-flex justify-content-between align-items-center h-100">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <strong className="text-dark" style={{ fontSize: '0.9rem' }}>{rx.drug}</strong>
                            <Badge bg={rx.status === 'Approved' ? 'success' : 'secondary'} className="small">{rx.status}</Badge>
                          </div>
                          <span className="d-block text-secondary small">Dosage: {rx.dosage}</span>
                          <span className="d-block text-secondary small">Authorized by: {rx.doctor}</span>
                          <span className="d-block text-secondary small mt-1 text-muted">Expires: {rx.expiry}</span>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Recent Orders Section */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Header className="bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-clock-history me-2 text-primary"></i>Recent Orders</h5>
                <Button as={Link} to="/my-orders" variant="outline-primary" size="sm" className="fw-bold px-3 rounded-pill">View All</Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle mt-3">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Order ID</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Date</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Items</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Total</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Status</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3 px-4 fw-bold text-primary">{order.id}</td>
                        <td className="py-3 px-4 text-muted">{order.date}</td>
                        <td className="py-3 px-4 text-muted">{order.items} items</td>
                        <td className="py-3 px-4 fw-bold text-dark">{order.total}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            bg={order.status === 'Delivered' ? 'success' : 'warning'} 
                            className="px-3 py-2 fw-bold rounded-pill"
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-end">
                          <Button as={Link} to={`/track-order/${order.id}`} variant="link" size="sm" className="text-decoration-none fw-bold">Track</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default CustomerDashboard;
