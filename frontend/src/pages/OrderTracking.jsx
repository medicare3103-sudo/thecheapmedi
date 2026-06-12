import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrder } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderTracking() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const numericId = orderId.startsWith('ORD-') ? orderId.replace('ORD-', '') : orderId;
        const data = await getOrder(numericId);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Order not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 0;
      case 'Packed': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const statuses = [
    { label: 'Processing', icon: 'bi-box', desc: 'Order received and being processed' },
    { label: 'Packed', icon: 'bi-box-seam', desc: 'Items packed and ready for dispatch' },
    { label: 'Shipped', icon: 'bi-truck', desc: 'Order is on the way to your address' },
    { label: 'Delivered', icon: 'bi-house-check', desc: 'Order delivered successfully' }
  ];

  const getTrackingHistory = (order) => {
    if (!order) return [];
    const createdAt = new Date(order.created_at);
    
    const formatDate = (date, hoursOffset, minutesOffset) => {
      const d = new Date(date.getTime());
      d.setHours(d.getHours() + hoursOffset);
      d.setMinutes(d.getMinutes() + minutesOffset);
      
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const dateStr = d.toLocaleDateString('en-US', options);
      
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = d.getMinutes().toString().padStart(2, '0');
      
      return `${dateStr} - ${hours}:${minutesStr} ${ampm}`;
    };

    const history = [];

    history.push({
      title: 'Order Received & Processing',
      time: formatDate(createdAt, 0, 15),
      location: 'System'
    });

    const hasPacked = ['Packed', 'Shipped', 'Delivered'].includes(order.status);
    if (hasPacked) {
      history.push({
        title: 'Order Packed',
        time: formatDate(createdAt, 4, 30),
        location: 'Warehouse 4B'
      });
    }

    const hasShipped = ['Shipped', 'Delivered'].includes(order.status);
    if (hasShipped) {
      history.push({
        title: 'Order Shipped from Facility',
        time: formatDate(createdAt, 24, 45),
        location: order.courier ? `${order.courier} Sort Facility` : 'New York Distribution Center'
      });
    }

    const hasDelivered = order.status === 'Delivered';
    if (hasDelivered) {
      const deliveryDate = order.estimated_delivery ? new Date(order.estimated_delivery) : new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
      const finalDeliveryDate = isNaN(deliveryDate.getTime()) ? new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000) : deliveryDate;
      
      history.push({
        title: 'Order Delivered',
        time: formatDate(finalDeliveryDate, 10, 0),
        location: 'Delivered to recipient address'
      });
    }

    if (order.status === 'Cancelled') {
      history.push({
        title: 'Order Cancelled',
        time: formatDate(createdAt, 1, 0),
        location: 'System / Merchant Rejected'
      });
    }

    return history.reverse();
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header hideAuth />
        <Container className="py-5 flex-grow-1 d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" size="lg" />
        </Container>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header hideAuth />
        <Container className="py-5 flex-grow-1 text-center">
          <Card className="border-0 shadow-sm rounded-4 p-5 mx-auto mt-5" style={{ maxWidth: '600px' }}>
            <i className="bi bi-exclamation-triangle text-warning display-1 mb-4"></i>
            <h3 className="fw-bold mb-3">Unable to Track Order</h3>
            <p className="text-muted mb-4">{error || 'The requested order details could not be found.'}</p>
            <Button as={Link} to="/" variant="primary" className="fw-bold px-4 py-2">
              Back to Home
            </Button>
          </Card>
        </Container>
        <Footer />
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

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

        {order.status === 'Cancelled' && (
          <Card className="border-0 shadow-sm rounded-4 mb-4 bg-danger bg-opacity-10 border-start border-4 border-danger">
            <Card.Body className="p-4 d-flex align-items-center">
              <i className="bi bi-x-circle-fill text-danger fs-1 me-4"></i>
              <div>
                <h5 className="fw-bold mb-1 text-danger">Order Cancelled</h5>
                <p className="mb-0 text-muted">This order has been cancelled and will not be shipped. Please contact customer support if you believe this was an error.</p>
              </div>
            </Card.Body>
          </Card>
        )}

        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4 p-md-5">
            
            {/* Header Info */}
            <Row className="mb-5 border-bottom pb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <span className="text-muted d-block small mb-1">Order Number</span>
                <span className="fw-bold text-dark fs-5">ORD-{order.id}</span>
              </Col>
              <Col md={4} className="mb-3 mb-md-0 border-start border-end">
                <span className="text-muted d-block small mb-1">Estimated Delivery</span>
                <span className="fw-bold text-success fs-5">
                  {order.estimated_delivery || new Date(new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </Col>
              <Col md={4}>
                <span className="text-muted d-block small mb-1">Shipping Courier & Tracking</span>
                <span className="fw-bold text-dark fs-5">
                  {order.courier || 'FedEx Express'}
                  {order.tracking_number && <span className="text-muted small d-block">#{order.tracking_number}</span>}
                </span>
              </Col>
            </Row>

            {/* Tracking Stepper */}
            {order.status !== 'Cancelled' && (
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
            )}

          </Card.Body>
        </Card>

        {/* Tracking Details / Logs */}
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Header className="bg-white border-bottom p-4">
            <h5 className="fw-bold mb-0">Tracking History</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="border-start border-2 border-primary ms-3 ms-md-4 ps-4 position-relative">
              {getTrackingHistory(order).map((log, idx) => (
                <div key={idx} className={`${idx < getTrackingHistory(order).length - 1 ? 'mb-4' : ''} position-relative`}>
                  <span className={`position-absolute bg-primary rounded-circle ${idx > 0 ? 'opacity-50' : ''}`} style={{width: '14px', height: '14px', left: '-31px', top: '5px'}}></span>
                  <h6 className="fw-bold mb-1 text-dark">{log.title}</h6>
                  <p className="text-muted small mb-0">{log.time} • {log.location}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

      </Container>
      
      <Footer />
    </div>
  );
}

export default OrderTracking;
