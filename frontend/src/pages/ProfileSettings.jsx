import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import CustomerLayout from '../components/CustomerLayout';

function ProfileSettings() {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || user.phone_number || ''
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    // Simulate API Call Delay
    setTimeout(() => {
      try {
        updateUser({
          username: formData.name,
          email: formData.email,
          phone: formData.phone
        });
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile.');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <CustomerLayout>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Profile Settings</h2>
        <p className="text-muted">Update your personal information and contact details.</p>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom p-4">
          <h5 className="mb-0 fw-bold text-dark">Personal Information</h5>
        </Card.Header>
        <Card.Body className="p-4">
          {success && <Alert variant="success" className="rounded-3">{success}</Alert>}
          {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary">Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="John Doe"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary">Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    placeholder="john@example.com"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-500 text-secondary">Mobile Number</Form.Label>
                  <Form.Control 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    placeholder="+1 (555) 000-0000"
                    className="py-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 pt-3 border-top">
              <Button variant="primary" type="submit" className="fw-bold px-4 py-2 border-0 rounded-pill" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </CustomerLayout>
  );
}

export default ProfileSettings;
