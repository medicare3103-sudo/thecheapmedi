import React from 'react';
import { Container, Row, Col, Card, Nav, Badge, Table, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyOrders() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Expanded Mock Data for Orders
  const mockOrders = [
    { id: 'ORD-54321', date: '2026-06-01', total: '$120.50', status: 'Processing', items: 3, payment: 'Credit Card' },
    { id: 'ORD-54300', date: '2026-05-15', total: '$45.00', status: 'Shipped', items: 1, payment: 'PayPal' },
    { id: 'ORD-54210', date: '2026-04-22', total: '$210.00', status: 'Delivered', items: 5, payment: 'Credit Card' },
    { id: 'ORD-54105', date: '2026-03-10', total: '$85.75', status: 'Delivered', items: 2, payment: 'Google Pay' },
    { id: 'ORD-53999', date: '2026-02-05', total: '$340.00', status: 'Cancelled', items: 10, payment: 'Credit Card' }
  ];

  const handleDownloadInvoice = (orderId) => {
    // In a real app, this would generate and download a PDF or navigate to a printable route.
    // For this prototype, we'll open a simple print dialog.
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0b5cff; }
            .invoice-box { border: 1px solid #eee; padding: 30px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h1>The Cheap Pharma</h1>
            <h2>Invoice for ${orderId}</h2>
            <p><strong>Customer:</strong> ${user?.username || 'Valued Customer'}</p>
            <p><strong>Date:</strong> 2026-06-02</p>
            <hr />
            <p>This is a simulated invoice for demonstration purposes.</p>
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'info';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
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
              <h2 className="fw-bold mb-1">My Orders</h2>
              <p className="text-muted">View your order history, check statuses, and download invoices.</p>
            </div>

            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="mb-0 fw-bold">Order History</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Order Details</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Date Placed</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Total</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Status</th>
                      <th className="py-3 px-4 border-bottom-0 text-muted fw-bold text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3 px-4">
                          <div className="fw-bold text-primary mb-1">{order.id}</div>
                          <div className="text-muted small">{order.items} items • {order.payment}</div>
                        </td>
                        <td className="py-3 px-4 text-muted fw-500">{order.date}</td>
                        <td className="py-3 px-4 fw-bold">{order.total}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            bg={getStatusBadge(order.status)} 
                            className="px-3 py-2 fw-bold rounded-pill"
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-end">
                          <Button 
                            as={Link}
                            to={`/track-order/${order.id}`}
                            variant="outline-primary" 
                            size="sm" 
                            className="fw-500 d-inline-flex align-items-center me-2"
                          >
                            <i className="bi bi-geo-alt me-1"></i> Track
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            className="fw-500 d-inline-flex align-items-center"
                            onClick={() => handleDownloadInvoice(order.id)}
                          >
                            <i className="bi bi-download me-1"></i> Invoice
                          </Button>
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

export default MyOrders;
