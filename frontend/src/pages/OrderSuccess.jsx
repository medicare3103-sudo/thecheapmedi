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
  const [orderTotal, setOrderTotal] = useState('');
  const [orderDate, setOrderDate] = useState('');
  
  // Custom detailed order summary states
  const [orderItems, setOrderItems] = useState([]);
  const [orderSubtotal, setOrderSubtotal] = useState('0.00');
  const [orderShipping, setOrderShipping] = useState('0.00');
  const [billingAddr, setBillingAddr] = useState(null);
  const [shippingAddr, setShippingAddr] = useState(null);

  useEffect(() => {
    const lastId = localStorage.getItem('lastOrderId');
    const lastEmail = localStorage.getItem('lastOrderEmail');
    const lastTotal = localStorage.getItem('lastOrderTotal');
    const lastDate = localStorage.getItem('lastOrderDate');
    
    const lastItems = localStorage.getItem('lastOrderItems');
    const lastSubtotal = localStorage.getItem('lastOrderSubtotal');
    const lastShipping = localStorage.getItem('lastOrderShipping');
    const lastBilling = localStorage.getItem('lastOrderBilling');
    const lastShippingAddress = localStorage.getItem('lastOrderShippingAddress');

    if (lastId) {
      setOrderId(lastId);
    } else {
      setOrderId(`ORD-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    
    if (lastEmail) {
      setEmail(lastEmail);
    }
    
    if (lastTotal) {
      setOrderTotal(lastTotal);
    } else {
      setOrderTotal('0.00');
    }
    
    if (lastDate) {
      setOrderDate(lastDate);
    } else {
      setOrderDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    }

    if (lastItems) {
      try {
        setOrderItems(JSON.parse(lastItems));
      } catch (e) {
        console.error("Error parsing order items from localStorage:", e);
      }
    }

    if (lastSubtotal) {
      setOrderSubtotal(lastSubtotal);
    }

    if (lastShipping) {
      setOrderShipping(lastShipping);
    }

    if (lastBilling) {
      try {
        setBillingAddr(JSON.parse(lastBilling));
      } catch (e) {
        console.error("Error parsing billing address from localStorage:", e);
      }
    }

    if (lastShippingAddress) {
      try {
        setShippingAddr(JSON.parse(lastShippingAddress));
      } catch (e) {
        console.error("Error parsing shipping address from localStorage:", e);
      }
    }
  }, []);

  const handleDownloadInvoice = () => {
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
              <p><strong>Date:</strong> ${orderDate}</p>
              <p><strong>Total Amount:</strong> $${orderTotal}</p>
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
      
      {/* Stepper Header */}
      <div className="bg-light py-4 text-center border-bottom">
        <div className="d-flex align-items-center justify-content-center gap-3 text-uppercase fw-semibold text-secondary" style={{ letterSpacing: '0.1rem', fontSize: '0.85rem' }}>
          <span>Shopping Cart</span>
          <i className="bi bi-arrow-right"></i>
          <span>Checkout</span>
          <i className="bi bi-arrow-right"></i>
          <span className="text-dark border-bottom border-dark border-2 pb-1" style={{ fontWeight: '700' }}>Order Complete</span>
        </div>
      </div>

      <Container className="py-5 flex-grow-1" style={{ maxWidth: '800px' }}>
        <Card className="border-0 shadow-lg rounded-4 p-md-5 p-4 bg-white">
          <Card.Body>
            
            {/* Thank you dotted box */}
            <div className="text-center p-3 mb-5 rounded-3" style={{ border: '2px dashed #0dcaf0', backgroundColor: '#f0fbfc' }}>
              <h5 className="text-info fw-semibold mb-0" style={{ color: '#0891b2', fontSize: '1.25rem' }}>
                Thank you. Your order has been received.
              </h5>
            </div>

            {/* Important Notice */}
            <div className="text-center mb-5">
              <h2 className="text-danger fw-bold mb-4" style={{ fontSize: '2.2rem', letterSpacing: '-0.5px' }}>Important Notice</h2>
              
              <p className="text-success fw-semibold mb-4" style={{ lineHeight: '1.7', fontSize: '1.15rem', color: '#16a34a' }}>
                Please check your email for a payment detail. If you don't see it in your inbox, kindly check your spam folder. Still can't find it? Search for <strong style={{ color: '#15803d' }}>"thecheappharma"</strong> in your email's search bar. Once you locate the payment link, please use it to complete your order.
              </p>

              <p className="text-danger fw-semibold mb-4" style={{ lineHeight: '1.7', fontSize: '1.05rem', color: '#dc2626' }}>
                Important: Due to government payment policies, please avoid mentioning the keyword "medicine" when making your payment. If you receive a phone call from the payment gateway, kindly refrain from mentioning that the payment is related to purchasing medicine, as such payments are not allowed under the policy.
              </p>

              <p className="text-secondary mb-4" style={{ fontSize: '1.05rem', color: '#475569' }}>
                If you have any queries or need further assistance, please email us at <a href="mailto:medicare3103@gmail.com" className="fw-semibold text-primary text-decoration-none">medicare3103@gmail.com</a>.
              </p>

              <h5 className="fw-bold text-dark mt-4" style={{ fontSize: '1.15rem' }}>Thank you for your cooperation!</h5>
            </div>

            {/* Grid Summary Row */}
            <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 gap-sm-0 py-4 border-top border-bottom text-center mb-5" style={{ borderColor: '#e2e8f0' }}>
              <div className="px-sm-4 w-100">
                <span className="text-muted d-block small text-uppercase fw-semibold mb-1" style={{ letterSpacing: '0.05rem', fontSize: '0.75rem' }}>Order number:</span>
                <strong className="fs-5 text-dark">{orderId}</strong>
              </div>
              <div className="d-none d-sm-block" style={{ height: '40px', width: '1px', backgroundColor: '#e2e8f0' }}></div>
              <div className="px-sm-4 w-100">
                <span className="text-muted d-block small text-uppercase fw-semibold mb-1" style={{ letterSpacing: '0.05rem', fontSize: '0.75rem' }}>Date:</span>
                <strong className="fs-5 text-dark">{orderDate}</strong>
              </div>
              <div className="d-none d-sm-block" style={{ height: '40px', width: '1px', backgroundColor: '#e2e8f0' }}></div>
              <div className="px-sm-4 w-100">
                <span className="text-muted d-block small text-uppercase fw-semibold mb-1" style={{ letterSpacing: '0.05rem', fontSize: '0.75rem' }}>Total:</span>
                <strong className="fs-5 text-dark">${orderTotal}</strong>
              </div>
            </div>

            {/* Order Details Table */}
            {orderItems.length > 0 && (
              <div className="mt-5 pt-4 border-top">
                <h4 className="fw-bold mb-4 text-dark text-start" style={{ letterSpacing: '-0.3px', fontSize: '1.35rem' }}>ORDER DETAILS</h4>
                
                <table className="table table-borderless align-middle" style={{ fontSize: '0.95rem' }}>
                  <thead>
                    <tr className="border-bottom text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.05rem' }}>
                      <th className="pb-3 fw-semibold text-start" style={{ width: '75%', color: '#64748b' }}>PRODUCT</th>
                      <th className="pb-3 fw-semibold text-end" style={{ color: '#64748b' }}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, idx) => (
                      <tr key={idx} className="border-bottom">
                        <td className="py-3 text-start">
                          <span className="text-dark fw-bold">{item.name}</span>
                          {item.packSize && <span className="text-secondary small"> - {item.packSize}</span>}
                          <span className="text-muted small ms-1"> × {item.quantity}</span>
                        </td>
                        <td className="py-3 text-end fw-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-bottom">
                      <td className="py-3 text-start text-dark fw-semibold">Subtotal:</td>
                      <td className="py-3 text-end fw-semibold text-dark">${orderSubtotal}</td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="py-3 text-start text-dark fw-semibold">Shipping:</td>
                      <td className="py-3 text-end text-secondary small">
                        {parseFloat(orderShipping) === 0 ? (
                          <span className="text-success fw-semibold">Free shipping</span>
                        ) : (
                          <span>${orderShipping} <span className="text-muted">via Flat rate</span></span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-3 pb-0 text-start text-dark fw-bold" style={{ fontSize: '1.15rem' }}>TOTAL:</td>
                      <td className="pt-3 pb-0 text-end fw-bold text-primary" style={{ fontSize: '1.15rem' }}>${orderTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Address Columns */}
            {(billingAddr || shippingAddr) && (
              <div className="row mt-5 pt-4 border-top text-start">
                <div className="col-sm-6 mb-4 mb-sm-0">
                  <h5 className="fw-bold mb-3 text-dark" style={{ letterSpacing: '-0.2px', fontSize: '1.1rem' }}>BILLING ADDRESS</h5>
                  {billingAddr ? (
                    <div className="text-secondary lh-lg" style={{ fontSize: '0.95rem' }}>
                      <p className="mb-0 text-capitalize fw-semibold text-dark">{billingAddr.firstName} {billingAddr.lastName}</p>
                      <p className="mb-0">{billingAddr.address}</p>
                      <p className="mb-0">{billingAddr.city}, {billingAddr.state} {billingAddr.zip}</p>
                      {billingAddr.phone && <p className="mb-0">{billingAddr.phone}</p>}
                      {billingAddr.email && <p className="mb-0 text-primary">{billingAddr.email}</p>}
                    </div>
                  ) : (
                    <p className="text-muted small">No billing address found.</p>
                  )}
                </div>
                
                <div className="col-sm-6">
                  <h5 className="fw-bold mb-3 text-dark" style={{ letterSpacing: '-0.2px', fontSize: '1.1rem' }}>SHIPPING ADDRESS</h5>
                  {shippingAddr ? (
                    <div className="text-secondary lh-lg" style={{ fontSize: '0.95rem' }}>
                      <p className="mb-0 text-capitalize fw-semibold text-dark">{shippingAddr.firstName} {shippingAddr.lastName}</p>
                      <p className="mb-0">{shippingAddr.address}</p>
                      <p className="mb-0">{shippingAddr.city}, {shippingAddr.state} {shippingAddr.zip}</p>
                      {shippingAddr.phone && <p className="mb-0">{shippingAddr.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-muted small">No shipping address found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Store Policy Info Grids */}
            <div className="row mt-5 pt-5 border-top text-center justify-content-center g-4">
              <div className="col-md-3 col-sm-6 px-3">
                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-arrow-counterclockwise fs-3 text-dark"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Return Policy</h6>
                <p className="text-muted small mb-0 lh-base" style={{ fontSize: '0.8rem' }}>
                  You may return any eligible item within <strong>30 days</strong> of receiving your order.
                </p>
              </div>

              <div className="col-md-3 col-sm-6 px-3">
                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-wallet2 fs-3 text-dark"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Refund Policy</h6>
                <p className="text-muted small mb-0 lh-base" style={{ fontSize: '0.8rem' }}>
                  Approved refunds are issued within <strong>7 business days(Mon-Fri)</strong>.
                </p>
              </div>

              <div className="col-md-3 col-sm-6 px-3">
                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-truck fs-3 text-dark"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Delivery Time</h6>
                <p className="text-muted small mb-0 lh-base" style={{ fontSize: '0.8rem' }}>
                  Your order will arrive within <strong>15–18 business days(Mon-Fri)</strong>.
                </p>
              </div>

              <div className="col-md-3 col-sm-6 px-3">
                <div className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-exclamation-triangle fs-3 text-dark"></i>
                </div>
                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem' }}>Disclaimer</h6>
                <p className="text-muted small mb-0 lh-base" style={{ fontSize: '0.8rem' }}>
                  We don't promote cures. Consult your doctor before use.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center pt-5 mt-4 border-top">
              <Button 
                variant="outline-primary" 
                size="lg" 
                className="fw-bold px-4 py-3"
                onClick={handleDownloadInvoice}
                style={{ fontSize: '0.95rem' }}
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
                  style={{ fontSize: '0.95rem' }}
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
                  style={{ fontSize: '0.95rem' }}
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
