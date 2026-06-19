import React, { useState, useEffect } from 'react';
import { Nav, Card, Table, Badge, Form, Spinner, Button, Modal } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getOrders, updateOrderStatus } from '../api';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [modalEstimatedDelivery, setModalEstimatedDelivery] = useState('');
  const [modalCourier, setModalCourier] = useState('');
  const [modalTrackingNumber, setModalTrackingNumber] = useState('');
  const [savingTracking, setSavingTracking] = useState(false);
  
  const orderStatuses = ['All', 'Pending', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchOrders = async (statusFilter) => {
    setLoading(true);
    try {
      const data = await getOrders(statusFilter);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders(activeTab);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status.');
    }
  };

  const handleOpenTrackingModal = (order) => {
    setSelectedOrder(order);
    setModalStatus(order.status || 'Pending');
    setModalEstimatedDelivery(order.estimated_delivery || '');
    setModalCourier(order.courier || '');
    setModalTrackingNumber(order.tracking_number || '');
    setShowTrackingModal(true);
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    setSavingTracking(true);
    try {
      await updateOrderStatus(
        selectedOrder.id, 
        modalStatus, 
        modalEstimatedDelivery || null, 
        modalCourier || null, 
        modalTrackingNumber || null
      );
      setShowTrackingModal(false);
      fetchOrders(activeTab);
    } catch (error) {
      console.error('Error updating order tracking details:', error);
      alert('Failed to update tracking details.');
    } finally {
      setSavingTracking(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Processing': return 'primary';
      case 'Packed': return 'secondary';
      case 'Shipped': return 'info';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <AdminLayout title="Order Management">
      {/* Tabs */}
      <Nav variant="pills" className="mb-4 gap-2">
        {orderStatuses.map(status => (
          <Nav.Item key={status}>
            <Nav.Link 
              active={activeTab === status}
              onClick={() => setActiveTab(status)}
              className={`rounded-pill px-4 fw-500 ${activeTab === status ? 'bg-primary text-white shadow-sm' : 'bg-white text-secondary'}`}
            >
              {status}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Order ID</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Customer</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Total Amount</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Status</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No orders found under "{activeTab}" status.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 fw-bold text-dark">#{order.id}</td>
                      <td className="px-4 py-3">
                        {order.shipping_details ? (
                          <div className="fw-semibold text-dark">
                            {order.shipping_details.firstName} {order.shipping_details.lastName}
                          </div>
                        ) : (
                          <div className="fw-semibold text-muted">No Name</div>
                        )}
                        <div className="small text-muted">{order.customer_email}</div>
                      </td>
                      <td className="px-4 py-3 fw-500">${order.total_price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge bg={getStatusBadge(order.status)} className="px-3 py-2 rounded-pill fw-normal">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {order.status === 'Pending' && (
                            <>
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="fw-bold px-3 py-1.5"
                                onClick={() => handleStatusChange(order.id, 'Processing')}
                              >
                                <i className="bi bi-check-lg me-1"></i> Accept
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="fw-bold px-3 py-1.5"
                                onClick={() => handleStatusChange(order.id, 'Cancelled')}
                              >
                                <i className="bi bi-x-lg me-1"></i> Reject
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="fw-bold px-3 py-1.5 d-inline-flex align-items-center gap-1"
                            onClick={() => handleOpenTrackingModal(order)}
                          >
                            <i className="bi bi-eye-fill"></i> Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Order Details and Status Update Modal */}
      <Modal show={showTrackingModal} onHide={() => setShowTrackingModal(false)} size="lg" centered className="order-details-modal">
        <Modal.Header closeButton className="border-0 pb-0 bg-light p-4 rounded-top-4">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-receipt text-primary fs-4"></i>
            <span>Order Details: ORD-{selectedOrder?.id}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedOrder && (
            <Row className="g-4">
              {/* Left Column - Order Items & Customer Info */}
              <Col lg={7}>
                {/* Customer Details */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                        <i className="bi bi-person-fill text-primary"></i>
                        <span>Customer Contact</span>
                      </h6>
                      <div className="small lh-base text-secondary">
                        {selectedOrder.shipping_details ? (
                          <>
                            <div className="fw-bold text-dark">{selectedOrder.shipping_details.firstName} {selectedOrder.shipping_details.lastName}</div>
                            <div><i className="bi bi-telephone-fill me-1"></i> {selectedOrder.shipping_details.phone}</div>
                            <div className="text-truncate" title={selectedOrder.shipping_details.email}><i className="bi bi-envelope-fill me-1"></i> {selectedOrder.shipping_details.email}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-muted">No Name</div>
                            <div>{selectedOrder.customer_email}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                        <i className="bi bi-geo-alt-fill text-primary"></i>
                        <span>Shipping Address</span>
                      </h6>
                      <div className="small lh-base text-secondary">
                        {selectedOrder.shipping_details ? (
                          <>
                            <div className="fw-bold text-dark">{selectedOrder.shipping_details.firstName} {selectedOrder.shipping_details.lastName}</div>
                            <div>{selectedOrder.shipping_details.address}</div>
                            <div>{selectedOrder.shipping_details.city}, {selectedOrder.shipping_details.state} {selectedOrder.shipping_details.zip}</div>
                          </>
                        ) : (
                          <div className="text-muted">No Address Provided</div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Billing Details */}
                {selectedOrder.billing_details && (
                  <div className="p-3 bg-light rounded-3 mb-4 border border-dashed">
                    <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                      <i className="bi bi-credit-card-2-front-fill text-primary"></i>
                      <span>Billing Address</span>
                    </h6>
                    <div className="small lh-base text-secondary">
                      <div>{selectedOrder.billing_details.firstName} {selectedOrder.billing_details.lastName}</div>
                      <div>{selectedOrder.billing_details.address}</div>
                      <div>{selectedOrder.billing_details.city}, {selectedOrder.billing_details.state} {selectedOrder.billing_details.zip}</div>
                    </div>
                  </div>
                )}

                {/* Items Summary */}
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-box-seam-fill text-primary"></i>
                  <span>Items Ordered</span>
                </h6>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover size="sm" className="align-middle border-0 mb-0">
                      <thead className="bg-light">
                        <tr className="small text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>
                          <th className="border-0 py-2">Item</th>
                          <th className="border-0 py-2">Pack</th>
                          <th className="border-0 py-2">Price</th>
                          <th className="border-0 py-2 text-center">Qty</th>
                          <th className="border-0 py-2 text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item, idx) => (
                          <tr key={idx} className="small">
                            <td className="py-2 border-0">
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded d-flex justify-content-center align-items-center me-2 flex-shrink-0" style={{ width: '28px', height: '28px', overflow: 'hidden' }}>
                                  {item.image_url && item.image_url !== '__has_image__' ? (
                                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                  ) : (
                                    <span>💊</span>
                                  )}
                                </div>
                                <span className="fw-semibold text-truncate animate-fade-in" style={{ maxWidth: '140px' }} title={item.name}>{item.name}</span>
                              </div>
                            </td>
                            <td className="py-2 border-0 text-muted">{item.packSize || 'Standard'}</td>
                            <td className="py-2 border-0">${parseFloat(item.price).toFixed(2)}</td>
                            <td className="py-2 border-0 text-center text-muted">x{item.quantity}</td>
                            <td className="py-2 border-0 text-end fw-bold text-dark">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted small">No items listed in this order.</p>
                )}

                <hr className="my-3 opacity-10" />

                {/* Financial Summary */}
                <div className="d-flex flex-column align-items-end gap-1 small text-secondary">
                  <div className="d-flex justify-content-between w-100" style={{ maxWidth: '240px' }}>
                    <span>Subtotal:</span>
                    <span className="fw-semibold text-dark">${selectedOrder.total_price.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between w-100" style={{ maxWidth: '240px' }}>
                    <span>Shipping:</span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>
                  <div className="d-flex justify-content-between w-100 border-top pt-2 mt-1" style={{ maxWidth: '240px' }}>
                    <strong className="text-dark">Total:</strong>
                    <strong className="text-primary fs-5">${selectedOrder.total_price.toFixed(2)}</strong>
                  </div>
                </div>
              </Col>

              {/* Right Column - Status & Courier Settings */}
              <Col lg={5} className="border-start-lg ps-lg-4">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-gear-fill text-primary"></i>
                  <span>Manage Tracking</span>
                </h6>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-secondary small text-uppercase">Order Status</Form.Label>
                    <Form.Select 
                      value={modalStatus} 
                      onChange={(e) => setModalStatus(e.target.value)}
                      className="rounded-3 shadow-sm py-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-secondary small text-uppercase">Estimated Delivery Date</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. June 25, 2026"
                      value={modalEstimatedDelivery}
                      onChange={(e) => setModalEstimatedDelivery(e.target.value)}
                      className="rounded-3 shadow-sm py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-secondary small text-uppercase">Shipping Courier</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. FedEx Express"
                      value={modalCourier}
                      onChange={(e) => setModalCourier(e.target.value)}
                      className="rounded-3 shadow-sm py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-secondary small text-uppercase">Tracking Number</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="e.g. TRK123456789"
                      value={modalTrackingNumber}
                      onChange={(e) => setModalTrackingNumber(e.target.value)}
                      className="rounded-3 shadow-sm py-2"
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 bg-light p-3 rounded-bottom-4">
          <Button variant="outline-secondary" className="fw-bold px-4 rounded-pill" onClick={() => setShowTrackingModal(false)} disabled={savingTracking}>
            Cancel
          </Button>
          <Button variant="primary" className="fw-bold px-4 rounded-pill shadow-sm" onClick={handleSaveTracking} disabled={savingTracking}>
            {savingTracking ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}

export default AdminOrders;
