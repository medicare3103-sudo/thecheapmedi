import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getPaymentSettings, updatePaymentSettings } from '../api';

function AdminPaymentSettings() {
  const [formData, setFormData] = useState({
    paypal_email: '',
    whatsapp_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getPaymentSettings();
      setFormData({
        paypal_email: data.paypal_email || '',
        whatsapp_number: data.whatsapp_number || ''
      });
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      setStatusMessage({ type: 'danger', text: 'Failed to load payment settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      await updatePaymentSettings(formData);
      setStatusMessage({ type: 'success', text: 'Payment settings updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error updating payment settings:', error);
      setStatusMessage({ type: 'danger', text: 'Failed to update payment settings. Please check your admin privileges.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Payment Settings">
      {statusMessage && (
        <Alert variant={statusMessage.type} onClose={() => setStatusMessage(null)} dismissible className="border-0 shadow-sm rounded-4 mb-4">
          <i className={`bi ${statusMessage.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} me-2`}></i>
          {statusMessage.text}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Retrieving payment settings configuration...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
                  <h5 className="fw-bold mb-0 text-slate-800">PayPal & WhatsApp Configuration</h5>
                  <p className="text-muted small mb-0 mt-1">Configure your recipient details for customer invoice checkout payments.</p>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    {/* PayPal Email */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold text-secondary small">PayPal Account Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="paypal_email"
                          value={formData.paypal_email}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. your-paypal-email@domain.com"
                          className="border-0 bg-light shadow-sm"
                          style={{ borderRadius: '10px', padding: '12px 16px' }}
                        />
                        <Form.Text className="text-muted d-block mt-1 px-1 small">
                          The email address where customers will be instructed to send their PayPal payments during checkout.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* WhatsApp Support Number */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold text-secondary small">WhatsApp Contact Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="whatsapp_number"
                          value={formData.whatsapp_number}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. +91 9737250868"
                          className="border-0 bg-light shadow-sm"
                          style={{ borderRadius: '10px', padding: '12px 16px' }}
                        />
                        <Form.Text className="text-muted d-block mt-1 px-1 small">
                          The phone number with country prefix (no spaces or dashes is recommended for click-to-chat link) where customers should send screenshot receipts.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-3 justify-content-end mt-5">
                    <Button variant="outline-secondary" type="button" disabled={saving} onClick={fetchSettings} className="rounded-3 px-4 py-2">
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={saving} className="rounded-3 px-4 py-2 d-flex align-items-center">
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Quick Preview Box */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
                  <h5 className="fw-bold mb-0 text-slate-800">Checkout Preview</h5>
                  <p className="text-muted small mb-0 mt-1">This is how your payment credentials will display on the customer checkout page.</p>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="p-3 border rounded-3 bg-white mb-3" style={{ borderColor: '#e2e8f0' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <span className="small text-muted fw-bold">PayPal Recipient:</span>
                      <strong className="text-dark small">{formData.paypal_email || 'Configure in settings'}</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                      <span className="small text-muted fw-bold">WhatsApp Receipt:</span>
                      <strong className="text-success small">{formData.whatsapp_number || 'Configure in settings'}</strong>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small text-muted fw-bold">Action Needed:</span>
                      <span className="badge bg-primary rounded-pill">Upload screenshot receipt</span>
                    </div>
                  </div>
                  <Alert variant="info" className="border-0 shadow-sm rounded-3 small mb-0">
                    <i className="bi bi-info-circle-fill me-2 fs-5 text-info"></i>
                    All values are stored securely in the main configuration settings and update instantly for all checkout sessions.
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </AdminLayout>
  );
}

export default AdminPaymentSettings;
