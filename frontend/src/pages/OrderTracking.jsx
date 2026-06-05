import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderTracking() {
  const { orderId } = useParams();
  const { user } = useAuth();

  // Mocking status logic. In reality, fetch order details by orderId
  // We will simulate that the order is currently "Shipped"
  const currentStatusIndex = 2; // 0: Processing, 1: Packed, 2: Shipped, 3: Delivered

  const statuses = [
    { label: 'Processing', icon: 'bi-box', desc: 'Order received and being processed' },
    { label: 'Packed', icon: 'bi-box-seam', desc: 'Items packed and ready for dispatch' },
    { label: 'Shipped', icon: 'bi-truck', desc: 'Order is on the way to your address' },
    { label: 'Delivered', icon: 'bi-house-check', desc: 'Order delivered successfully' }
  ];

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header hideAuth />
      
      <Container className="py-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Track Order</h2>
          {user ? (
            <Button as={Link} to="/my-orders" variant="outline-secondary" className="fw-500">
              <i className="bi bi-arrow-left me-2"></i> Back to Orders
            </Button>
          ) : (
            <Button as={Link} to="/" variant="outline-secondary" className="fw-500">
              <i className="bi bi-arrow-left me-2"></i> Return to Shop
            </Button>
          )}
        </div>

        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4 p-md-5">
            
            {/* Header Info */}
            <Row className="mb-5 border-bottom pb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <span className="text-muted d-block small mb-1">Order Number</span>
                <span className="fw-bold text-dark fs-5">{orderId || 'ORD-UNKNOWN'}</span>
              </Col>
              <Col md={4} className="mb-3 mb-md-0 border-start border-end">
                <span className="text-muted d-block small mb-1">Estimated Delivery</span>
                <span className="fw-bold text-success fs-5">June 5, 2026</span>
              </Col>
              <Col md={4}>
                <span className="text-muted d-block small mb-1">Shipping Courier</span>
                <span className="fw-bold text-dark fs-5">FedEx Express</span>
              </Col>
            </Row>

            {/* Tracking Stepper */}
            <div className="position-relative mt-5 mb-4 px-2 px-md-5">
              {/* Connecting Line background */}
              <div 
                className="position-absolute bg-light" 
                style={{ height: '6px', width: 'calc(100% - 6rem)', top: '30px', left: '3rem', zIndex: 1 }}
              ></div>
              
              {/* Connecting Line active */}
              <div 
                className="position-absolute bg-primary" 
                style={{ height: '6px', width: `calc(${(currentStatusIndex / (statuses.length - 1)) * 100}% - 4rem)`, top: '30px', left: '3rem', zIndex: 1, transition: 'width 1s ease-in-out' }}
              ></div>

              <Row className="position-relative text-center g-0" style={{ zIndex: 2 }}>
                {statuses.map((status, index) => {
                  const isActive = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <Col key={index} className="px-2">
                      <div 
                        className={`mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm transition-all ${isActive ? 'bg-primary text-white' : 'bg-white border text-muted'}`}
                        style={{ width: '64px', height: '64px', border: isActive ? 'none' : '4px solid #eee' }}
                      >
                        <i className={`bi ${status.icon}`} style={{ fontSize: '1.8rem' }}></i>
                      </div>
                      <h6 className={`fw-bold mb-1 ${isActive ? 'text-dark' : 'text-muted'}`}>{status.label}</h6>
                      <p className="small text-muted d-none d-md-block mx-auto" style={{maxWidth: '150px'}}>
                        {status.desc}
                      </p>
                      {isCurrent && <Badge bg="primary" className="mt-1">Current Status</Badge>}
                    </Col>
                  );
                })}
              </Row>
            </div>

          </Card.Body>
        </Card>

        {/* Tracking Details / Logs */}
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Header className="bg-white border-bottom p-4">
            <h5 className="fw-bold mb-0">Tracking History</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="border-start border-2 border-primary ms-3 ms-md-4 ps-4 position-relative">
              
              <div className="mb-4 position-relative">
                <span className="position-absolute bg-primary rounded-circle" style={{width: '14px', height: '14px', left: '-31px', top: '5px'}}></span>
                <h6 className="fw-bold mb-1 text-dark">Order Shipped from Facility</h6>
                <p className="text-muted small mb-0">June 3, 2026 - 10:45 AM • New York Distribution Center</p>
              </div>

              <div className="mb-4 position-relative">
                <span className="position-absolute bg-primary rounded-circle opacity-50" style={{width: '14px', height: '14px', left: '-31px', top: '5px'}}></span>
                <h6 className="fw-bold mb-1 text-dark">Order Packed</h6>
                <p className="text-muted small mb-0">June 2, 2026 - 04:30 PM • Warehouse 4B</p>
              </div>

              <div className="position-relative">
                <span className="position-absolute bg-primary rounded-circle opacity-50" style={{width: '14px', height: '14px', left: '-31px', top: '5px'}}></span>
                <h6 className="fw-bold mb-1 text-dark">Order Received & Processing</h6>
                <p className="text-muted small mb-0">June 2, 2026 - 02:15 PM • System</p>
              </div>

            </div>
          </Card.Body>
        </Card>

      </Container>
      
      <Footer />
    </div>
  );
}

export default OrderTracking;
