import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import CustomerLayout from '../components/CustomerLayout';

function AddressManagement() {
  const { user } = useAuth();

  // Mock State for Addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      name: 'John Doe',
      street: '123 Health Avenue, Apt 4B',
      city: 'New York, NY 10001',
      phone: '+1 (555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      label: 'Work',
      name: 'John Doe',
      street: '888 Business Pkwy, Suite 200',
      city: 'Brooklyn, NY 11201',
      phone: '+1 (555) 987-6543',
      isDefault: false
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ label: '', name: '', street: '', city: '', phone: '', isDefault: false });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingId(address.id);
      setFormData(address);
    } else {
      setEditingId(null);
      setFormData({ label: 'Home', name: user?.username || '', street: '', city: '', phone: user?.phone || '', isDefault: addresses.length === 0 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(prev => prev.map(addr => {
        if (addr.id === editingId) {
          return { ...formData, id: editingId };
        }
        return addr;
      }));
    } else {
      const newAddress = { ...formData, id: Date.now() };
      setAddresses(prev => [...prev, newAddress]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <CustomerLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Saved Addresses</h2>
          <p className="text-muted mb-0">Manage your shipping and billing addresses.</p>
        </div>
        <Button variant="primary" className="fw-bold px-4 border-0 rounded-pill" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-lg me-2"></i> Add New
        </Button>
      </div>

      <Row className="g-4">
        {addresses.map(address => (
          <Col md={6} key={address.id}>
            <Card className={`border-0 shadow-sm rounded-4 h-100 ${address.isDefault ? 'border-start border-4 border-primary' : ''}`}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Badge bg={address.label === 'Home' ? 'primary' : 'secondary'} className="px-3 py-2 rounded-pill fw-500">
                    <i className={`bi bi-${address.label === 'Home' ? 'house' : 'building'} me-2`}></i> 
                    {address.label}
                  </Badge>
                  {address.isDefault && <Badge bg="success" className="px-2 py-1">Default</Badge>}
                </div>
                
                <h5 className="fw-bold mb-1">{address.name}</h5>
                <p className="text-muted mb-1 small">{address.street}</p>
                <p className="text-muted mb-2 small">{address.city}</p>
                <p className="fw-500 text-dark mb-4 small"><i className="bi bi-telephone me-2 text-muted"></i>{address.phone}</p>
                
                <div className="d-flex gap-2 border-top pt-3">
                  <Button variant="outline-primary" size="sm" className="fw-bold px-3 rounded-pill" onClick={() => handleOpenModal(address)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" className="fw-bold px-3 rounded-pill" onClick={() => handleDelete(address.id)}>
                    Delete
                  </Button>
                  {!address.isDefault && (
                    <Button variant="link" size="sm" className="ms-auto text-decoration-none text-muted fw-bold" onClick={() => handleSetDefault(address.id)}>
                      Set as Default
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {addresses.length === 0 && (
          <Col xs={12}>
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
              <i className="bi bi-geo text-muted opacity-50" style={{fontSize: '4rem'}}></i>
              <h5 className="mt-3 fw-bold">No Addresses Found</h5>
              <p className="text-muted">You haven't saved any addresses yet.</p>
              <Button variant="outline-primary" className="fw-bold mt-2 rounded-pill" onClick={() => handleOpenModal()}>
                Add Your First Address
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {/* Add/Edit Address Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold">{editingId ? 'Edit Address' : 'Add New Address'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveAddress}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary small mb-1">Address Label</Form.Label>
                  <Form.Select required value={formData.label} onChange={(e) => setFormData({...formData, label: e.target.value})} className="py-2">
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary small mb-1">Full Name</Form.Label>
                  <Form.Control required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Recipient's Name" className="py-2" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary small mb-1">Street Address</Form.Label>
                  <Form.Control required type="text" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} placeholder="123 Main St, Apt 4B" className="py-2" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary small mb-1">City, State & Zip</Form.Label>
                  <Form.Control required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="New York, NY 10001" className="py-2" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary small mb-1">Phone Number</Form.Label>
                  <Form.Control required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="py-2" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check 
                  type="checkbox" 
                  id="default-address"
                  label={<span className="fw-500">Set as default address</span>}
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  className="mt-2"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="light" onClick={handleCloseModal} className="fw-500 rounded-pill">Cancel</Button>
            <Button variant="primary" type="submit" className="fw-bold px-4 rounded-pill border-0">{editingId ? 'Save Changes' : 'Save Address'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </CustomerLayout>
  );
}

export default AddressManagement;
