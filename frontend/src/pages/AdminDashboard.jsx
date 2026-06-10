import React, { useState, useEffect } from 'react';
import { Card, Badge, Table, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { getAdminAnalytics, getOrders, updateOrderStatus } from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminAnalytics();
      setAnalytics(data);

      const orders = await getOrders();
      setRecentOrders(orders.slice(0, 5)); // Just the 5 most recent
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchDashboardData(); // Refresh to get the latest status
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Processing': return 'primary';
      case 'Shipped': return 'info';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545'];

  const actions = (
    <div className="d-flex align-items-center gap-3">
      <Button variant="outline-primary" size="sm">
        <i className="bi bi-download me-2"></i>Export Report
      </Button>
      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{width: '40px', height: '40px'}}>
        A
      </div>
    </div>
  );

  return (
    <AdminLayout title="Seller Dashboard Overview" actions={actions}>
      {isLoading || !analytics ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Metrics Cards Grid (3x2) */}
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                    <i className="bi bi-cart fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Today's Orders</p>
                    <h3 className="fw-bold mb-0">{analytics.metrics.todays_orders}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle me-3">
                    <i className="bi bi-currency-dollar fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Revenue</p>
                    <h3 className="fw-bold mb-0">${analytics.metrics.revenue.toFixed(2)}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle me-3">
                    <i className="bi bi-box fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Products</p>
                    <h3 className="fw-bold mb-0">{analytics.metrics.products_count}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle me-3">
                    <i className="bi bi-people fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Customers</p>
                    <h3 className="fw-bold mb-0">{analytics.metrics.customers_count}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4 d-flex align-items-center">
                  <div className="bg-secondary bg-opacity-10 text-secondary p-3 rounded-circle me-3">
                    <i className="bi bi-file-medical fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Pending Prescriptions</p>
                    <h3 className="fw-bold mb-0">{analytics.metrics.pending_prescriptions}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100 border-start border-danger border-5">
                <Card.Body className="p-4 d-flex align-items-center">
                  <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle me-3">
                    <i className="bi bi-exclamation-triangle fs-3"></i>
                  </div>
                  <div>
                    <p className="text-muted fw-bold mb-1 small text-uppercase tracking-wide">Low Stock Alert</p>
                    <h3 className="fw-bold mb-0 text-danger">{analytics.metrics.low_stock_count}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row 1 */}
          <Row className="g-4 mb-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Daily Sales</h5>
                  <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.charts.daily_sales}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{fill: '#f8f9fa'}} />
                        <Bar dataKey="sales" fill="#0d6efd" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Top Products</h5>
                  <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.charts.top_products}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.charts.top_products.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
                    {analytics.charts.top_products.map((entry, index) => (
                      <div key={index} className="d-flex align-items-center small">
                        <span className="d-inline-block rounded-circle me-1" style={{width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length]}}></span>
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row 2 */}
          <Row className="g-4 mb-4">
            <Col lg={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Monthly Sales</h5>
                  <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.charts.monthly_sales}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="sales" stroke="#198754" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Revenue Trend</h5>
                  <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.charts.revenue_trend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Orders Table with Accept/Reject Workflow */}
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-0">
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Orders</h5>
                <Button as={Link} to="/admin/orders" variant="link" className="text-decoration-none fw-bold p-0">View All Orders</Button>
              </div>
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Order ID</th>
                      <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Customer</th>
                      <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Date</th>
                      <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Total</th>
                      <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Status</th>
                      <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">No orders found.</td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 fw-bold text-dark">#{order.id}</td>
                          <td className="px-4 py-3">{order.customer_email}</td>
                          <td className="px-4 py-3 text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 fw-500">${order.total_price.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <Badge bg={getStatusBadge(order.status)} className="px-3 py-2 rounded-pill fw-normal">
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-end">
                            {order.status === 'Pending' ? (
                              <div className="d-flex justify-content-end gap-2">
                                <Button 
                                  variant="outline-success" 
                                  size="sm" 
                                  className="fw-bold px-3"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                                >
                                  <i className="bi bi-check-lg me-1"></i> Accept
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="fw-bold px-3"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                >
                                  <i className="bi bi-x-lg me-1"></i> Reject
                                </Button>
                              </div>
                            ) : (
                              <Button as={Link} to={`/admin/orders`} variant="light" size="sm" className="fw-bold shadow-sm">View Details</Button>
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
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
