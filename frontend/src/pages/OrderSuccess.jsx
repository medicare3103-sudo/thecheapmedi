import React, { useEffect, useState } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderSuccess() {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const lastId = localStorage.getItem('lastOrderId');
    const lastEmail = localStorage.getItem('lastOrderEmail');
    if (lastId) {
      setOrderId(lastId);
    } else {
      setOrderId(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    if (lastEmail) {
      setEmail(lastEmail);
    }
  }, []);

  const handleDownloadInvoice = () => {
    // Reusing the same mock print logic from MyOrders
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #0b5cff; margin-bottom: 5px; }
            .invoice-box { border: 1px solid #e0e0e0; padding: 40px; border-radius: 8px; max-width: 800px; margin: auto; }
            .details { margin-top: 20px; font-size: 14px; }
            .details strong { width: 120px; display: inline-block; }
            hr { border: 0; border-top: 1px solid #eee; margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h1>The Cheap Pharma</h1>
            <p>Official Order Invoice</p>
            <hr />
            <div class="details">
              <p><strong>Order Number:</strong> ${orderId}</p>
              <p><strong>Customer:</strong> ${user?.username || 'Valued Customer'}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Status:</strong> Processing</p>
            </div>
            <hr />
            <p style="text-align: center; color: #777;">Thank you for shopping with The Cheap Pharma!</p>
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-5 flex-grow-1 d-flex align-items-center justify-content-center">
        <Card className="border-0 shadow-lg rounded-4 text-center p-md-5 p-4" style={{maxWidth: '600px'}}>
          <Card.Body>
            
            {/* Success Icon */}
            <div className="mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle" style={{width: '100px', height: '100px'}}>
                <i className="bi bi-check-lg text-success" style={{fontSize: '4rem'}}></i>
              </div>
            </div>

            <h2 className="fw-bold text-dark mb-3">Order Placed Successfully!</h2>
            <p className="text-muted fs-5 mb-4">
              Thank you for your purchase. We have received your order and will begin processing it shortly.
            </p>

            <div className="bg-light border rounded-3 p-3 mb-4 d-inline-block">
              <span className="text-muted fw-500 me-2">Order Reference:</span>
              <span className="fw-bold text-primary fs-5">{orderId}</span>
            </div>

            <p className="text-muted small mb-5">
              A confirmation email has been sent to <strong>{email || user?.email || 'your email'}</strong>.
            </p>

            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <Button 
                variant="outline-primary" 
                size="lg" 
                className="fw-bold px-4 py-3"
                onClick={handleDownloadInvoice}
              >
                <i className="bi bi-download me-2"></i> Download Invoice
              </Button>
              {user ? (
                <Button 
                  as={Link} 
                  to="/my-orders" 
                  variant="primary" 
                  size="lg" 
                  className="fw-bold px-5 py-3 shadow-sm"
                >
                  View My Orders
                </Button>
              ) : (
                <Button 
                  as={Link} 
                  to={`/track-order/${orderId}`} 
                  variant="primary" 
                  size="lg" 
                  className="fw-bold px-5 py-3 shadow-sm"
                >
                  Track Your Order
                </Button>
              )}
            </div>

          </Card.Body>
        </Card>
      </Container>
      
      <Footer />
    </div>
  );
}

export default OrderSuccess;
