import React, { useState, useEffect } from 'react';
import { Card, Badge, Table, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';
import { getOrders } from '../api';

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const allOrders = await getOrders();
        const userOrders = allOrders.filter(o => o.customer_email === user?.email);
        setOrders(userOrders);
      } catch (e) {
        console.error("Error loading user orders:", e);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleDownloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ORD-${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0284c7; }
            .invoice-box { border: 1px solid #eee; padding: 30px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h1>The Cheap Pharma</h1>
            <h2>Invoice for ORD-${order.id}</h2>
            <p><strong>Customer:</strong> ${user?.username || 'Valued Customer'}</p>
            <p><strong>Email:</strong> ${order.customer_email || user?.email}</p>
            <p><strong>Date Placed:</strong> ${order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Total Price:</strong> $${parseFloat(order.total_price || 0).toFixed(2)}</p>
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
    <CustomerLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">My Orders</h2>
        <p className="text-muted">View your order history, check statuses, and download invoices.</p>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom p-4">
          <h5 className="mb-0 fw-bold text-dark">Order History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5 text-secondary">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
              <p className="fs-5">You haven't placed any orders yet.</p>
              <Button as={Link} to="/products" variant="primary" className="fw-bold px-4 border-0 rounded-pill mt-3">Shop Products</Button>
            </div>
          ) : (
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-4">
                      <div className="fw-bold text-primary mb-1">ORD-{order.id}</div>
                      <div className="text-muted small">{order.customer_email}</div>
                    </td>
                    <td className="py-3 px-4 text-muted fw-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 fw-bold text-dark">${parseFloat(order.total_price || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        bg={getStatusBadge(order.status)} 
                        className={`px-3 py-2 fw-bold rounded-pill ${order.status === 'Shipped' ? 'text-dark bg-info bg-opacity-25' : ''}`}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button 
                        as={Link}
                        to={`/track-order/ORD-${order.id}`}
                        variant="outline-primary" 
                        size="sm" 
                        className="fw-bold px-3 rounded-pill me-2 border-0"
                      >
                        <i className="bi bi-geo-alt me-1"></i> Track
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="fw-bold px-3 rounded-pill"
                        onClick={() => handleDownloadInvoice(order)}
                      >
                        <i className="bi bi-download me-1"></i> Invoice
                      </Button>
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

export default MyOrders;
