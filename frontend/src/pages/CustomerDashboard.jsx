import { Container, Row, Col, Card, Nav, Badge, Table, Button } from 'react-bootstrap';
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

  // Mock Data
  const mockOrders = [
    { id: 'ORD-54321', date: '2026-06-01', total: '$120.50', status: 'Processing', items: 3 },
    { id: 'ORD-54300', date: '2026-05-15', total: '$45.00', status: 'Delivered', items: 1 },
    { id: 'ORD-54210', date: '2026-04-22', total: '$210.00', status: 'Delivered', items: 5 }
  ];

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
              <h2 className="fw-bold mb-1">My Dashboard</h2>
              <p className="text-muted">Manage your account, track orders, and view your wishlist.</p>
            </div>

            {/* Metrics Row */}
            <Row className="g-4 mb-4">
              <Col sm={4}>
                <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-primary">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3 text-primary">
                      <i className="bi bi-cart-check fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">12</h3>
                      <span className="text-muted small fw-500">Total Orders</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-warning">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3 text-warning">
                      <i className="bi bi-clock-history fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">1</h3>
                      <span className="text-muted small fw-500">Pending Orders</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={4}>
                <Card className="border-0 shadow-sm rounded-3 h-100 border-start border-4 border-danger">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle bg-danger bg-opacity-10 p-3 me-3 text-danger">
                      <i className="bi bi-heart fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">5</h3>
                      <span className="text-muted small fw-500">Wishlist Items</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Orders Section */}
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Recent Orders</h5>
                <Button variant="outline-primary" size="sm" className="fw-500">View All</Button>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle">
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
                        <td className="py-3 px-4 fw-500">{order.id}</td>
                        <td className="py-3 px-4 text-muted">{order.date}</td>
                        <td className="py-3 px-4 text-muted">{order.items}</td>
                        <td className="py-3 px-4 fw-bold">{order.total}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            bg={order.status === 'Delivered' ? 'success' : 'warning'} 
                            className="px-2 py-1 fw-500"
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-end">
                          <Button variant="link" size="sm" className="text-decoration-none fw-bold">Details</Button>
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
