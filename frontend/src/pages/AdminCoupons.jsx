import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../api';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  // Form State
  const [currentCouponId, setCurrentCouponId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase: '',
    expiry_date: '',
    is_active: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleShowModal = (mode, coupon = null) => {
    setModalMode(mode);
    if (mode === 'edit' && coupon) {
      setCurrentCouponId(coupon.id);
      setFormData({
        code: coupon.code || '',
        discount_type: coupon.discount_type || 'percentage',
        discount_value: coupon.discount_value || '',
        min_purchase: coupon.min_purchase || '',
        expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
        is_active: coupon.is_active !== undefined ? coupon.is_active : true
      });
    } else {
      setCurrentCouponId(null);
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase: '',
        expiry_date: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null
      };

      if (modalMode === 'add') {
        await createCoupon(payload);
      } else if (modalMode === 'edit') {
        await updateCoupon(currentCouponId, payload);
      }
      
      handleCloseModal();
      fetchCoupons(); // Refresh list
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Failed to save coupon. Check console for details.');
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete coupon "${code}"?\nThis action cannot be undone.`)) {
      try {
        await deleteCoupon(id);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
        alert('Failed to delete coupon.');
      }
    }
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="g-0">
        
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-0 d-flex flex-column">
          <div className="p-4 bg-primary text-white text-center fw-bold fs-4">
            Medicare Admin
          </div>
          <Nav className="flex-column p-3 gap-2 flex-grow-1">
            <Nav.Link as={Link} to="/admin" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/orders" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-box-seam me-2"></i> Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/products" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-tags me-2"></i> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/categories" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-grid me-2"></i> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-people me-2"></i> Customers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/coupons" className="text-white bg-white bg-opacity-10 rounded px-3 py-2">
              <i className="bi bi-ticket-perforated me-2"></i> Coupons
            </Nav.Link>
          </Nav>
          <div className="p-3 mt-auto">
            <Nav.Link as={Link} to="/" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-arrow-left-circle me-2"></i> Back to Store
            </Nav.Link>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="bg-light min-vh-100">
          
          {/* Topbar */}
          <div className="bg-white px-4 py-3 shadow-sm d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">Coupon Management</h4>
            <Button variant="primary" size="sm" onClick={() => handleShowModal('add')}>
              <i className="bi bi-plus-lg me-2"></i>Create Coupon
            </Button>
          </div>

          <div className="px-4 pb-5">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Code</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Discount</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Min Purchase</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Status</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Expires</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      ) : coupons.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                            No coupons available. Create one to run a promotion!
                          </td>
                        </tr>
                      ) : (
                        coupons.map((coupon) => (
                          <tr key={coupon.id}>
                            <td className="px-4 py-3 fw-bold text-dark font-monospace">{coupon.code}</td>
                            <td className="px-4 py-3 fw-500 text-success">
                              {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value} OFF`}
                            </td>
                            <td className="px-4 py-3 text-muted">
                              {coupon.min_purchase ? `$${coupon.min_purchase}` : 'No minimum'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge bg={!coupon.is_active ? 'danger' : isExpired(coupon.expiry_date) ? 'secondary' : 'success'} className="px-3 py-2 rounded-pill fw-normal">
                                {!coupon.is_active ? 'Inactive' : isExpired(coupon.expiry_date) ? 'Expired' : 'Active'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-muted">
                              {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-4 py-3 text-end">
                              <Button variant="light" size="sm" className="me-2 text-primary shadow-sm" onClick={() => handleShowModal('edit', coupon)}>
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button variant="light" size="sm" className="text-danger shadow-sm" onClick={() => handleDelete(coupon.id, coupon.code)}>
                                <i className="bi bi-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            {modalMode === 'add' ? 'Create New Coupon' : 'Edit Coupon'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pt-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Coupon Code <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="code" value={formData.code} onChange={handleInputChange} required placeholder="e.g. SUMMER20" className="font-monospace text-uppercase" />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Discount Type</Form.Label>
                  <Form.Select name="discount_type" value={formData.discount_type} onChange={handleInputChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount ($)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Discount Value <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="number" step="0.01" name="discount_value" value={formData.discount_value} onChange={handleInputChange} required placeholder="0.00" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Minimum Purchase ($)</Form.Label>
                  <Form.Control type="number" step="0.01" name="min_purchase" value={formData.min_purchase} onChange={handleInputChange} placeholder="Leave blank for no minimum" />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Expiry Date</Form.Label>
                  <Form.Control type="date" name="expiry_date" value={formData.expiry_date} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Check 
                  type="switch"
                  id="custom-switch"
                  label={<span className="fw-500">Coupon is Active</span>}
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button variant="light" onClick={handleCloseModal} className="px-4 fw-bold">Cancel</Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {modalMode === 'add' ? 'Create Coupon' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
}

export default AdminCoupons;
