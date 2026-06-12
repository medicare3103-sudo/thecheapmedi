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
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Customer Email</th>
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
                      <td className="px-4 py-3 text-muted">{order.customer_email}</td>
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
                            className="fw-bold px-3 py-1.5"
                            onClick={() => handleOpenTrackingModal(order)}
                          >
                            <i className="bi bi-pencil-square me-1"></i> Update
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

      {/* Tracking and Status Update Modal */}
      <Modal show={showTrackingModal} onHide={() => setShowTrackingModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Update Order Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {selectedOrder && (
            <Form>
              <div className="mb-3 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small d-block">Order ID</span>
                  <strong className="text-dark">ORD-{selectedOrder.id}</strong>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Total Amount</span>
                  <strong className="text-primary">${selectedOrder.total_price.toFixed(2)}</strong>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary small text-uppercase">Order Status</Form.Label>
                <Form.Select 
                  value={modalStatus} 
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="rounded-3 shadow-sm"
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
                  placeholder="e.g. June 5, 2026"
                  value={modalEstimatedDelivery}
                  onChange={(e) => setModalEstimatedDelivery(e.target.value)}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary small text-uppercase">Shipping Courier</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. FedEx Express"
                  value={modalCourier}
                  onChange={(e) => setModalCourier(e.target.value)}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-secondary small text-uppercase">Tracking Number</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. TRK123456789"
                  value={modalTrackingNumber}
                  onChange={(e) => setModalTrackingNumber(e.target.value)}
                  className="rounded-3 shadow-sm"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" className="fw-bold px-4" onClick={() => setShowTrackingModal(false)} disabled={savingTracking}>
            Cancel
          </Button>
          <Button variant="primary" className="fw-bold px-4" onClick={handleSaveTracking} disabled={savingTracking}>
            {savingTracking ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}

export default AdminOrders;
