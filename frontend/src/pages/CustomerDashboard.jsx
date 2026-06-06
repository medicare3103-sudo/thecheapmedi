import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';
import { getOrders } from '../api';
import { useAuth } from '../context/AuthContext';

function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Orders
        const allOrders = await getOrders();
        const userOrders = allOrders.filter(o => o.customer_email === user?.email);
        setOrders(userOrders);

        // Fetch Wishlist count from localStorage
        const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlistCount(savedWishlist.length);
      } catch (e) {
        console.error("Error loading dashboard backend data:", e);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <CustomerLayout>
      {/* Quick Metrics Cards */}
      <Row className="g-4 mb-4">
        <Col sm={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="d-flex align-items-center p-4">
              <div className="rounded-3 bg-primary bg-opacity-10 p-3 me-3 text-primary">
                <i className="bi bi-bag-check fs-4"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-dark">{loading ? '...' : orders.length}</h3>
                <span className="text-muted small fw-bold">Total Orders</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="d-flex align-items-center p-4">
              <div className="rounded-3 bg-danger bg-opacity-10 p-3 me-3 text-danger">
                <i className="bi bi-heart fs-4"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-dark">{loading ? '...' : wishlistCount}</h3>
                <span className="text-muted small fw-bold">Wishlist Items</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="d-flex align-items-center p-4">
              <div className="rounded-3 bg-success bg-opacity-10 p-3 me-3 text-success">
                <i className="bi bi-geo-alt fs-4"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0 text-dark">2</h3>
                <span className="text-muted small fw-bold">Saved Addresses</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Header className="bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-clock-history me-2 text-primary"></i>Recent Orders</h5>
          <Button as={Link} to="/my-orders" variant="outline-primary" size="sm" className="fw-bold px-3 rounded-pill">View All</Button>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5 text-secondary">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
              <p className="mb-0">No orders placed yet.</p>
              <Button as={Link} to="/products" variant="primary" size="sm" className="mt-3 px-4 rounded-pill border-0">Shop Now</Button>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle mt-3">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Order ID</th>
                  <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Date</th>
                  <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Total</th>
                  <th className="py-3 px-4 border-bottom-0 text-muted fw-bold">Status</th>
                  <th className="py-3 px-4 border-bottom-0 text-muted fw-bold text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-4 fw-bold text-primary">ORD-{order.id}</td>
                    <td className="py-3 px-4 text-muted">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 fw-bold text-dark">${parseFloat(order.total_price || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        bg={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'warning'} 
                        className="px-3 py-2 fw-bold rounded-pill"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button as={Link} to={`/track-order/ORD-${order.id}`} variant="link" size="sm" className="text-decoration-none fw-bold">Track</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </CustomerLayout>
  );
}

export default CustomerDashboard;
