import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, ListGroup, Tab, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('card');

  // Form State
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please check the link or contact support.');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format card number
    if (name === 'number') {
      const formatted = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
      setCardData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    // Auto-format expiry date MM/YY
    if (name === 'expiry') {
      const formatted = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim().substring(0, 5);
      if (formatted.endsWith('/')) {
        setCardData(prev => ({ ...prev, [name]: formatted.substring(0, 2) }));
      } else {
        setCardData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    // Limit CVV
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setCardData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardPaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      // Update order status on the backend to Processing (meaning paid/verifying)
      await updateOrderStatus(order.id, 'Processing');
      
      // Store in localStorage so order success page displays correct info
      localStorage.setItem('lastOrderId', `ORD-${order.id}`);
      localStorage.setItem('lastOrderEmail', order.customer_email);
      localStorage.setItem('lastOrderTotal', order.total_price.toFixed(2));
      localStorage.setItem('lastOrderDate', new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      if (order.items) {
        localStorage.setItem('lastOrderItems', JSON.stringify(order.items));
      }
      if (order.shipping_details) {
        localStorage.setItem('lastOrderShippingAddress', JSON.stringify(order.shipping_details));
        localStorage.setItem('lastOrderBilling', JSON.stringify(order.billing_details || order.shipping_details));
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/order-success');
      }, 2000);
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Payment simulation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAlternativePaymentSubmit = async (status, isCrypto) => {
    setProcessing(true);
    try {
      const finalTotal = isCrypto ? cryptoTotal : order.total_price;
      // Update order status on the backend
      await updateOrderStatus(order.id, status);
      
      // Store in localStorage so order success page displays correct info
      localStorage.setItem('lastOrderId', `ORD-${order.id}`);
      localStorage.setItem('lastOrderEmail', order.customer_email);
      localStorage.setItem('lastOrderTotal', finalTotal.toFixed(2));
      localStorage.setItem('lastOrderDate', new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      if (order.items) {
        localStorage.setItem('lastOrderItems', JSON.stringify(order.items));
      }
      if (order.shipping_details) {
        localStorage.setItem('lastOrderShippingAddress', JSON.stringify(order.shipping_details));
        localStorage.setItem('lastOrderBilling', JSON.stringify(order.billing_details || order.shipping_details));
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/order-success');
      }, 2000);
    } catch (err) {
      console.error('Error processing alternative payment:', err);
      alert('Payment submission failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-5 my-5 text-center">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Securing payment gateway connection...</p>
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <Container className="py-5 my-5">
          <Alert variant="danger" className="border-0 shadow-sm rounded-4 p-4 text-center">
            <i className="bi bi-exclamation-triangle-fill fs-1 text-danger d-block mb-3"></i>
            <h4 className="fw-bold">Payment Error</h4>
            <p className="mb-0">{error || 'Order could not be found.'}</p>
            <Button variant="primary" href="/" className="mt-4 px-4 py-2 rounded-3">Back to Store</Button>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  const discountAmount = order.total_price * 0.10;
  const cryptoTotal = order.total_price - discountAmount;

  return (
    <>
      <Header />
      <div className="bg-light py-5">
        <Container style={{ maxWidth: '1100px' }}>
          {success && (
            <Alert variant="success" className="border-0 shadow rounded-4 p-4 text-center mb-4">
              <i className="bi bi-check-circle-fill fs-1 text-success d-block mb-2"></i>
              <h4 className="fw-bold mb-0">Payment Successful!</h4>
              <p className="text-muted mb-0 mt-2">Simulating bank clearance... Redirecting to receipt invoice page.</p>
            </Alert>
          )}

          <Row className="g-4">
            {/* Payment Forms Card */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                <Card.Header className="bg-dark text-white p-4 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-0"><i className="bi bi-shield-lock-fill text-success me-2"></i>Secure Checkout</h5>
                    <small className="text-white-50">Select your preferred payment method below</small>
                  </div>
                  <i className="bi bi-credit-card-2-front fs-2 text-white-50"></i>
                </Card.Header>
                <Card.Body className="p-4">
                  <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="pills" className="custom-payment-pills mb-4 gap-2">
                      <Nav.Item className="flex-fill">
                        <Nav.Link eventKey="card" className="text-center py-2 fw-semibold rounded-3">
                          <i className="bi bi-credit-card me-2"></i>Card
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="flex-fill">
                        <Nav.Link eventKey="paypal" className="text-center py-2 fw-semibold rounded-3">
                          <i className="bi bi-paypal me-2"></i>PayPal
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="flex-fill">
                        <Nav.Link eventKey="bank" className="text-center py-2 fw-semibold rounded-3">
                          <i className="bi bi-bank me-2"></i>Bank Transfer
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="flex-fill">
                        <Nav.Link eventKey="crypto" className="text-center py-2 fw-semibold rounded-3">
                          <i className="bi bi-currency-bitcoin me-2"></i>Crypto (-10%)
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    <Tab.Content>
                      {/* 1. Credit/Debit Card */}
                      <Tab.Pane eventKey="card">
                        <Form onSubmit={handleCardPaymentSubmit}>
                          <Row className="g-3">
                            <Col md={12}>
                              <Form.Group>
                                <Form.Label className="small text-muted fw-bold">CARDHOLDER NAME</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="name" 
                                  value={cardData.name} 
                                  onChange={handleInputChange} 
                                  required 
                                  placeholder="e.g. John Doe"
                                  className="bg-light border-0 py-2.5 px-3"
                                  style={{ borderRadius: '8px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={12}>
                              <Form.Group>
                                <Form.Label className="small text-muted fw-bold">CARD NUMBER</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="number" 
                                  value={cardData.number} 
                                  onChange={handleInputChange} 
                                  required 
                                  placeholder="0000 0000 0000 0000"
                                  className="bg-light border-0 py-2.5 px-3"
                                  style={{ borderRadius: '8px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small text-muted fw-bold">EXPIRY DATE (MM/YY)</Form.Label>
                                <Form.Control 
                                  type="text" 
                                  name="expiry" 
                                  value={cardData.expiry} 
                                  onChange={handleInputChange} 
                                  required 
                                  placeholder="MM/YY"
                                  className="bg-light border-0 py-2.5 px-3"
                                  style={{ borderRadius: '8px' }}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small text-muted fw-bold">SECURITY CODE (CVV)</Form.Label>
                                <Form.Control 
                                  type="password" 
                                  name="cvv" 
                                  value={cardData.cvv} 
                                  onChange={handleInputChange} 
                                  required 
                                  placeholder="123"
                                  className="bg-light border-0 py-2.5 px-3"
                                  style={{ borderRadius: '8px' }}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <div className="mt-4 p-3 bg-danger bg-opacity-10 text-danger rounded-3 small border border-danger border-opacity-20 mb-4">
                            <i className="bi bi-exclamation-octagon-fill me-2"></i>
                            <strong>Important Notice:</strong> When reviewing card charges, this transaction will appear as <strong>"Health Consulting Services"</strong>. Please avoid contacting your bank claiming fraud, and do not mention the keyword "medicine" on payment queries.
                          </div>

                          <Button variant="primary" type="submit" disabled={processing} className="w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center">
                            {processing ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Processing Transaction...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-lock-fill me-2"></i>
                                Pay ${order.total_price.toFixed(2)} Securely
                              </>
                            )}
                          </Button>
                        </Form>
                      </Tab.Pane>

                      {/* 2. PayPal */}
                      <Tab.Pane eventKey="paypal">
                        <div className="p-3 border rounded-3 bg-light mb-4 text-center">
                          <div className="d-flex align-items-center justify-content-center mb-3">
                            <div className="bg-white p-3 border rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                              <i className="bi bi-paypal text-primary" style={{ fontSize: '2.2rem' }}></i>
                            </div>
                          </div>
                          <h6 className="fw-bold mb-2 text-dark">PayPal Payment Instructions</h6>
                          <p className="text-muted small mb-4">
                            To complete your purchase, please send payment via PayPal and submit your receipt screenshot.
                          </p>

                          <div className="p-3 bg-white border rounded-3 text-start mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2.5 pb-2 border-bottom">
                              <span className="small text-muted fw-bold">Pay To PayPal Email:</span>
                              <strong className="text-dark small select-all">medicare3103@gmail.com</strong>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="small text-muted fw-bold">Amount Due:</span>
                              <strong className="text-primary">${order.total_price.toFixed(2)} USD</strong>
                            </div>
                          </div>

                          <div className="text-start p-3 bg-danger bg-opacity-10 text-danger rounded-3 small border border-danger border-opacity-20 mb-3">
                            <i className="bi bi-exclamation-octagon-fill me-2"></i>
                            <strong>Crucial Note:</strong> When sending payment on PayPal, please do **NOT** write the word "medicine", "pharmacy", "pills", or any drug names in the transaction notes. This is required to comply with payment policies.
                          </div>

                          <div className="text-start p-3 bg-info bg-opacity-10 text-info rounded-3 small border border-info border-opacity-20">
                            <h6 className="fw-bold text-dark mb-2 small"><i className="bi bi-whatsapp me-2 text-success"></i>Send Screenshot Reference</h6>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                              Once the transfer is complete, take a screenshot of your successful transaction receipt and send it along with your Order ID <strong>ORD-{order.id}</strong> to:
                            </p>
                            <ul className="mb-0 mt-2 text-muted ps-3" style={{ fontSize: '0.85rem' }}>
                              <li><strong>Email:</strong> <a href="mailto:medicare3103@gmail.com" className="text-decoration-none fw-bold">medicare3103@gmail.com</a></li>
                              <li><strong>WhatsApp Support:</strong> <a href="https://wa.me/919737250868" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">+91 9737250868</a></li>
                            </ul>
                          </div>
                        </div>

                        <Button variant="secondary" onClick={() => handleAlternativePaymentSubmit('Processing', false)} disabled={processing} className="w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center">
                          {processing ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Processing Order...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle-fill me-2"></i>
                              I Have Paid & Sent Screenshot
                            </>
                          )}
                        </Button>
                      </Tab.Pane>

                      {/* 3. Bank Transfer */}
                      <Tab.Pane eventKey="bank">
                        <div className="p-3 border rounded-3 bg-light mb-4">
                          <h6 className="fw-bold mb-3 text-dark">Direct Wire Instructions</h6>
                          <table className="table table-borderless table-sm mb-0 text-muted small">
                            <tbody>
                              <tr><td className="fw-bold ps-0" style={{ width: '130px' }}>Bank Name:</td><td>Federal Merchant Bank</td></tr>
                              <tr><td className="fw-bold ps-0">Account Name:</td><td>The Cheap Pharma LLC</td></tr>
                              <tr><td className="fw-bold ps-0">Account Number:</td><td>7889-0112-4456-112</td></tr>
                              <tr><td className="fw-bold ps-0">Routing / ABA:</td><td>021000021</td></tr>
                              <tr><td className="fw-bold ps-0">SWIFT/BIC Code:</td><td>FEDMUSH12XX</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <Alert variant="warning" className="border-0 shadow-sm rounded-3 small">
                          <i className="bi bi-info-circle-fill me-2 text-warning fs-5"></i>
                          Please include the Order ID <strong>ORD-{order.id}</strong> as the transfer description reference. **Crucial:** Do NOT write the words "medicine", "tablets", or specific prescription names anywhere on your wire order.
                        </Alert>
                        <Button variant="secondary" onClick={() => handleAlternativePaymentSubmit('Processing', false)} disabled={processing} className="w-100 py-2.5 rounded-3 fw-bold">
                          {processing ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Processing Order...
                            </>
                          ) : (
                            "Place Order (Pay via Wire Transfer)"
                          )}
                        </Button>
                      </Tab.Pane>

                      {/* 3. Bitcoin / Crypto */}
                      <Tab.Pane eventKey="crypto">
                        <div className="text-center p-3 border rounded-3 bg-slate-50 mb-4" style={{ backgroundColor: '#f8fafc' }}>
                          <h6 className="fw-bold text-success mb-2"><i className="bi bi-gift-fill me-1"></i>10% Bitcoin Discount Applied</h6>
                          <div className="fs-5 fw-bold text-dark mb-3">Pay Only ${cryptoTotal.toFixed(2)} BTC</div>
                          
                          <div className="d-flex align-items-center justify-content-center mb-3">
                            {/* Dummy QR placeholder using a beautiful SVG rendering */}
                            <div className="p-2 bg-white border rounded shadow-sm">
                              <i className="bi bi-qr-code fs-1 text-dark" style={{ fontSize: '4.5rem' }}></i>
                            </div>
                          </div>

                          <div className="small text-muted mb-2">BTC Target Address:</div>
                          <div className="p-2 bg-light border text-truncate fw-mono rounded-3 text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                            1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
                          </div>
                          
                          <Button variant="outline-primary" size="sm" onClick={() => alert('Address copied to clipboard!')} className="px-3 rounded-pill fw-bold">
                            <i className="bi bi-clipboard me-2"></i>Copy BTC Address
                          </Button>
                        </div>
                        <Button variant="secondary" onClick={() => handleAlternativePaymentSubmit('Processing', true)} disabled={processing} className="w-100 py-2.5 rounded-3 fw-bold">
                          {processing ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Processing Order...
                            </>
                          ) : (
                            "Place Order (I have sent the Crypto)"
                          )}
                        </Button>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Summary Sidebar */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
                  <h5 className="fw-bold mb-0 text-slate-800">Order Summary</h5>
                  <p className="text-muted small mb-0 mt-1">Details of your pending transaction</p>
                </Card.Header>
                <Card.Body className="p-4">
                  <ListGroup className="list-group-flush mb-4">
                    <ListGroup.Item className="px-0 py-2.5 d-flex justify-content-between border-slate-100 text-muted small">
                      <span>Order Reference</span>
                      <strong className="text-dark">ORD-{order.id}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 py-2.5 d-flex justify-content-between border-slate-100 text-muted small">
                      <span>Order Date</span>
                      <strong className="text-dark">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 py-2.5 d-flex justify-content-between border-slate-100 text-muted small">
                      <span>Customer Email</span>
                      <strong className="text-dark text-truncate" style={{ maxWidth: '200px' }}>{order.customer_email}</strong>
                    </ListGroup.Item>
                  </ListGroup>

                  <h6 className="fw-bold mb-3 small text-secondary text-uppercase tracking-wider">Ordered Items</h6>
                  <div className="overflow-auto max-h-200 border rounded-3 p-3 bg-light mb-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary-subtle last-border-0">
                          <div className="small text-muted text-truncate me-2" style={{ maxWidth: '200px' }}>
                            {item.name} <span className="small text-secondary-500 font-semibold">x{item.quantity}</span>
                          </div>
                          <span className="small fw-bold text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted small mb-0">No item details stored.</p>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <span className="fw-bold text-secondary">Total Amount:</span>
                    <span className="fs-3 fw-bold text-slate-800">${order.total_price.toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />

      <style>{`
        .custom-payment-pills .nav-link {
          background-color: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        .custom-payment-pills .nav-link.active {
          background-color: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }
        .max-h-200 {
          max-height: 200px;
        }
        .last-border-0:last-child {
          border-bottom: 0 !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>
    </>
  );
}

export default Payment;
