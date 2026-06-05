import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderTrackingLookup() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('order'); // 'order' or 'tracking'
  const [verifyMethod, setVerifyMethod] = useState('email'); // 'email' or 'phone'

  // Input states
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    const idToTrack = activeTab === 'order' ? orderNumber.trim() : trackingNumber.trim();
    
    if (idToTrack) {
      // Store verification details locally to pretend we authenticated them
      if (activeTab === 'order') {
        localStorage.setItem('lastOrderId', idToTrack);
        if (verifyMethod === 'email') {
          localStorage.setItem('lastOrderEmail', email.trim());
        } else {
          localStorage.setItem('lastOrderPhone', phone.trim());
        }
      }
      navigate(`/track-order/${idToTrack}`);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      {/* Main Content Area */}
      <Container className="py-5 flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        
        {/* Tracking Lookup Card */}
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4 w-100" style={{ maxWidth: '600px', border: '1px solid #e2e8f0' }}>
          <Card.Body className="p-0">
            <h2 className="text-center fw-bold text-dark mb-4">Track your order</h2>
            
            {/* Custom Tabs using Website Theme Colors */}
            <div className="d-flex border-bottom mb-4 justify-content-center text-center">
              <div 
                className={`pb-2 px-4 cursor-pointer fw-600`}
                style={{ 
                  color: activeTab === 'order' ? 'var(--primary-color)' : '#64748b', 
                  borderBottom: activeTab === 'order' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  fontSize: '0.95rem'
                }}
                onClick={() => setActiveTab('order')}
              >
                Order number
              </div>
              <div 
                className={`pb-2 px-4 cursor-pointer fw-600`}
                style={{ 
                  color: activeTab === 'tracking' ? 'var(--primary-color)' : '#64748b', 
                  borderBottom: activeTab === 'tracking' ? '3px solid var(--primary-color)' : '3px solid transparent',
                  fontSize: '0.95rem'
                }}
                onClick={() => setActiveTab('tracking')}
              >
                Tracking number
              </div>
            </div>

            <Form onSubmit={handleTrack}>
              {activeTab === 'order' ? (
                /* Search by Order Number Form */
                <div className="d-flex flex-column gap-3">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Order number"
                      required
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="py-3 shadow-none"
                      style={{ borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </Form.Group>

                  {verifyMethod === 'email' ? (
                    <Form.Group>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-3 shadow-none"
                        style={{ borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group>
                      <Form.Control
                        type="tel"
                        placeholder="Phone number"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="py-3 shadow-none"
                        style={{ borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </Form.Group>
                  )}

                  {/* Toggle Verification Method Link */}
                  <div className="text-center mt-2">
                    <Button 
                      variant="link" 
                      onClick={() => setVerifyMethod(verifyMethod === 'email' ? 'phone' : 'email')}
                      className="p-0 text-decoration-none small fw-bold"
                      style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}
                    >
                      Verify by {verifyMethod === 'email' ? 'phone number' : 'email'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Search by Tracking Number Form */
                <div>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Tracking number"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="py-3 shadow-none"
                      style={{ borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </Form.Group>
                </div>
              )}

              {/* Submit Button using Theme Class */}
              <div className="mt-4">
                <Button 
                  type="submit" 
                  className="w-100 py-3 fw-bold btn-primary"
                  style={{ borderRadius: '6px', fontSize: '1rem' }}
                >
                  Track
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Back to Shop link */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-decoration-none small text-muted hover-primary fw-bold">
            <i className="bi bi-arrow-left me-1"></i> Back to Shop
          </Link>
        </div>

      </Container>

      <Footer />
    </div>
  );
}

export default OrderTrackingLookup;
