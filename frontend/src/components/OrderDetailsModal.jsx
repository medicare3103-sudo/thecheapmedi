import React from 'react';
import { Modal, Row, Col, Table, Badge, Button } from 'react-bootstrap';

function OrderDetailsModal({ show, onHide, order }) {
  if (!order) return null;

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
    <Modal show={show} onHide={onHide} size="lg" centered className="order-details-modal">
      <Modal.Header closeButton className="border-0 pb-0 bg-light p-4 rounded-top-4">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-receipt text-primary fs-4"></i>
          <span>Order Details: ORD-{order.id}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
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
                    {order.shipping_details ? (
                      <>
                        <div className="fw-bold text-dark">{order.shipping_details.firstName} {order.shipping_details.lastName}</div>
                        <div><i className="bi bi-telephone-fill me-1"></i> {order.shipping_details.phone}</div>
                        <div className="text-truncate" title={order.shipping_details.email}><i className="bi bi-envelope-fill me-1"></i> {order.shipping_details.email}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-muted">No Name</div>
                        <div>{order.customer_email}</div>
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
                    {order.shipping_details ? (
                      <>
                        <div className="fw-bold text-dark">{order.shipping_details.firstName} {order.shipping_details.lastName}</div>
                        <div>{order.shipping_details.address}</div>
                        <div>{order.shipping_details.city}, {order.shipping_details.state} {order.shipping_details.zip}</div>
                      </>
                    ) : (
                      <div className="text-muted">No Address Provided</div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Billing Details */}
            {order.billing_details && (
              <div className="p-3 bg-light rounded-3 mb-4 border border-dashed">
                <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-credit-card-2-front-fill text-primary"></i>
                  <span>Billing Address</span>
                </h6>
                <div className="small lh-base text-secondary">
                  <div>{order.billing_details.firstName} {order.billing_details.lastName}</div>
                  <div>{order.billing_details.address}</div>
                  <div>{order.billing_details.city}, {order.billing_details.state} {order.billing_details.zip}</div>
                </div>
              </div>
            )}

            {/* Items Summary */}
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-box-seam-fill text-primary"></i>
              <span>Items Ordered</span>
            </h6>
            {order.items && order.items.length > 0 ? (
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
                    {order.items.map((item, idx) => (
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
                            <span className="fw-semibold text-truncate" style={{ maxWidth: '140px' }} title={item.name}>{item.name}</span>
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
                <span className="fw-semibold text-dark">${parseFloat(order.total_price || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between w-100" style={{ maxWidth: '240px' }}>
                <span>Shipping:</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <div className="d-flex justify-content-between w-100 border-top pt-2 mt-1" style={{ maxWidth: '240px' }}>
                <strong className="text-dark">Total:</strong>
                <strong className="text-primary fs-5">${parseFloat(order.total_price || 0).toFixed(2)}</strong>
              </div>
            </div>
          </Col>

          {/* Right Column - Status & Shipment Tracking info */}
          <Col lg={5} className="border-start-lg ps-lg-4">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-truck text-primary"></i>
              <span>Delivery Status</span>
            </h6>

            <div className="p-3 bg-light rounded-3 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="fw-bold text-secondary small text-uppercase">Status</span>
                <Badge 
                  bg={getStatusBadge(order.status)} 
                  className={`px-3 py-2 fw-bold rounded-pill ${order.status === 'Shipped' ? 'text-dark bg-info bg-opacity-25' : ''}`}
                >
                  {order.status || 'Pending'}
                </Badge>
              </div>
              <div className="d-flex align-items-center justify-content-between small text-secondary">
                <span>Order Date:</span>
                <span className="fw-semibold text-dark">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt text-primary"></i>
              <span>Tracking Information</span>
            </h6>

            {order.tracking_number || order.courier || order.estimated_delivery ? (
              <div className="p-3 bg-light rounded-3 border">
                {order.estimated_delivery && (
                  <div className="mb-3">
                    <span className="d-block fw-bold text-secondary small text-uppercase mb-1">Estimated Delivery</span>
                    <span className="fw-bold text-dark fs-6"><i className="bi bi-calendar-event me-2 text-primary"></i>{order.estimated_delivery}</span>
                  </div>
                )}
                
                {order.courier && (
                  <div className="mb-3">
                    <span className="d-block fw-bold text-secondary small text-uppercase mb-1">Courier Service</span>
                    <span className="fw-semibold text-dark"><i className="bi bi-airplane-engines me-2 text-primary"></i>{order.courier}</span>
                  </div>
                )}

                {order.tracking_number && (
                  <div className="mb-1">
                    <span className="d-block fw-bold text-secondary small text-uppercase mb-1">Tracking Number</span>
                    <div className="d-flex align-items-center justify-content-between bg-white p-2 rounded-2 border">
                      <span className="font-monospace text-dark fw-bold">{order.tracking_number}</span>
                      <Button 
                        size="sm" 
                        variant="light" 
                        className="py-1 px-2 text-primary border"
                        onClick={() => navigator.clipboard.writeText(order.tracking_number)}
                        title="Copy to clipboard"
                      >
                        <i className="bi bi-clipboard"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-light rounded-3 border border-dashed text-center text-muted small">
                <i className="bi bi-hourglass-split fs-3 mb-2 d-block text-secondary"></i>
                <div>Your order is being processed. Tracking details will be generated here once your package ships.</div>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 bg-light p-3 rounded-bottom-4">
        <Button variant="secondary" className="fw-bold px-4 rounded-pill" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrderDetailsModal;
