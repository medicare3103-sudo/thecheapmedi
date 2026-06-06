import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Badge, Form, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  
  const orderStatuses = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async (statusFilter) => {
    setLoading(true);
    try {
      const data = await getOrders(statusFilter);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh after update to ensure correct filtering
      fetchOrders(activeTab);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Processing': return 'primary';
      case 'Shipped': return 'info';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="g-0">
        
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-0 d-flex flex-column">
          <div className="p-4 bg-primary text-white text-center fw-bold fs-4">
            Medicare Admin
          </div>
          <Nav className="flex-column p-3 gap-2 flex-grow-1">
            <Nav.Link as={Link} to="/admin" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" className="text-white bg-white bg-opacity-10 rounded px-3 py-2">
              <i className="bi bi-box-seam me-2"></i> Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-tags me-2"></i> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/categories" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-grid me-2"></i> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/authors" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-person-badge me-2"></i> Authors & Reviewers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-people me-2"></i> Customers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/coupons" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-ticket-perforated me-2"></i> Coupons
            </Nav.Link>
            <Nav.Link as={Link} to="/admin" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-bar-chart me-2"></i> Analytics
            </Nav.Link>
          </Nav>
          <div className="p-3 mt-auto">
            <Nav.Link as={Link} to="/" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-arrow-left-circle me-2"></i> Back to Store
            </Nav.Link>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="bg-light min-vh-100">
          
          {/* Topbar */}
          <div className="bg-white px-4 py-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">Order Management</h4>
          </div>

          <div className="px-4 pb-5">
            {/* Tabs */}
            <Nav variant="pills" className="mb-4 gap-2">
              {orderStatuses.map(status => (
                <Nav.Item key={status}>
                  <Nav.Link 
                    active={activeTab === status}
                    onClick={() => setActiveTab(status)}
                    className={`rounded-pill px-4 fw-500 ${activeTab === status ? 'bg-primary text-white shadow-sm' : 'bg-white text-secondary'}`}
                    style={{cursor: 'pointer'}}
                  >
                    {status}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Order ID</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Customer</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Date</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Total</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Status</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Update Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                            No orders found in this category.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-4 py-3 fw-bold text-dark">#{order.id}</td>
                            <td className="px-4 py-3">{order.customer_email}</td>
                            <td className="px-4 py-3 text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 fw-500">${parseFloat(order.total_price).toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <Badge bg={getStatusBadge(order.status)} className="px-3 py-2 rounded-pill fw-normal">
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-end" style={{minWidth: '220px'}}>
                              {order.status === 'Pending' ? (
                                <div className="d-flex justify-content-end gap-2">
                                  <Button 
                                    variant="outline-success" 
                                    size="sm" 
                                    className="fw-bold px-3"
                                    onClick={() => handleStatusChange(order.id, 'Processing')}
                                  >
                                    <i className="bi bi-check-lg me-1"></i> Accept
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="fw-bold px-3"
                                    onClick={() => handleStatusChange(order.id, 'Cancelled')}
                                  >
                                    <i className="bi bi-x-lg me-1"></i> Reject
                                  </Button>
                                </div>
                              ) : (
                                <Form.Select 
                                  size="sm" 
                                  value={order.status} 
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  className="shadow-sm fw-500 bg-light border-0 w-auto ms-auto"
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </Form.Select>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminOrders;
