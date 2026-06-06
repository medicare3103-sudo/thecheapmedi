import React from 'react';
import { Card, Badge, Table, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';

function MyOrders() {
  const { user } = useAuth();

  // Expanded Mock Data for Orders
  const mockOrders = [
    { id: 'ORD-54321', date: '2026-06-01', total: '$120.50', status: 'Processing', items: 3, payment: 'Credit Card' },
    { id: 'ORD-54300', date: '2026-05-15', total: '$45.00', status: 'Shipped', items: 1, payment: 'PayPal' },
    { id: 'ORD-54210', date: '2026-04-22', total: '$210.00', status: 'Delivered', items: 5, payment: 'Credit Card' },
    { id: 'ORD-54105', date: '2026-03-10', total: '$85.75', status: 'Delivered', items: 2, payment: 'Google Pay' },
    { id: 'ORD-53999', date: '2026-02-05', total: '$340.00', status: 'Cancelled', items: 10, payment: 'Credit Card' }
  ];

  const handleDownloadInvoice = (orderId) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0284c7; }
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
                  <td className="py-3 px-4 fw-bold text-dark">{order.total}</td>
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
                      to={`/track-order/${order.id}`}
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
    </CustomerLayout>
  );
}

export default MyOrders;
