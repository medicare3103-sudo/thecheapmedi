import React, { useState, useEffect } from 'react';
import { Nav, Card, Table, Badge, Form, Spinner, Button } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
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
    <AdminLayout title="Order Management">
      {/* Tabs */}
      <Nav variant="pills" className="mb-4 gap-2">
        {orderStatuses.map(status => (
          <Nav.Item key={status}>
            <Nav.Link 
              active={activeTab === status}
              onClick={() => setActiveTab(status)}
              className={`rounded-pill px-4 fw-500 ${activeTab === status ? 'bg-primary text-white shadow-sm' : 'bg-white text-secondary'}`}
            >
              {status}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Order ID</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Customer Email</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Total Amount</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Status</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No orders found under "{activeTab}" status.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 fw-bold text-dark">#{order.id}</td>
                      <td className="px-4 py-3 text-muted">{order.customer_email}</td>
                      <td className="px-4 py-3 fw-500">${order.total_price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge bg={getStatusBadge(order.status)} className="px-3 py-2 rounded-pill fw-normal">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {order.status === 'Pending' ? (
                          <div className="d-flex justify-content-end gap-2">
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="fw-bold px-3 py-1.5"
                              onClick={() => handleStatusChange(order.id, 'Processing')}
                            >
                              <i className="bi bi-check-lg me-1"></i> Accept
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="fw-bold px-3 py-1.5"
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
    </AdminLayout>
  );
}

export default AdminOrders;
