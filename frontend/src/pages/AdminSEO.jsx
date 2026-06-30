import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getSEOSettings, updateSEOSettings } from '../api';

function AdminSEO() {
  const [formData, setFormData] = useState({
    homepage_meta_title: '',
    homepage_meta_description: '',
    homepage_focus_keyword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSEOSettings();
      setFormData({
        homepage_meta_title: data.homepage_meta_title || '',
        homepage_meta_description: data.homepage_meta_description || '',
        homepage_focus_keyword: data.homepage_focus_keyword || ''
      });
    } catch (error) {
      setStatusMessage({ type: 'danger', text: 'Failed to load SEO settings. Please try again.' });
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
      await updateSEOSettings(formData);
      setStatusMessage({ type: 'success', text: 'SEO Settings updated successfully!' });
      // Scroll to top of the settings container to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setStatusMessage({ type: 'danger', text: 'Failed to update SEO settings. Please check your admin privileges.' });
    } finally {
      setSaving(false);
    }
  };

  // Google Snippet Preview Fallbacks
  const previewTitle = formData.homepage_meta_title || 'The Cheap Pharma - Online Pharmacy';
  const previewDescription = formData.homepage_meta_description || 'Buy high-quality, affordable generic medicines online. The Cheap Pharma is your trusted online pharmacy portal for safe, reliable, and discreet home delivery.';

  return (
    <AdminLayout title="SEO Settings">
      {statusMessage && (
        <Alert variant={statusMessage.type} onClose={() => setStatusMessage(null)} dismissible className="border-0 shadow-sm rounded-4 mb-4">
          <i className={`bi ${statusMessage.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} me-2`}></i>
          {statusMessage.text}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <p className="mt-3 text-muted">Retrieving homepage configuration...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Form Fields Card */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
                  <h5 className="fw-bold mb-0 text-slate-800">Homepage SEO Configuration</h5>
                  <p className="text-muted small mb-0 mt-1">Specify site-wide meta properties to improve search visibility and click-through rates.</p>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    {/* Meta Title */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold text-secondary small">Homepage Meta Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="homepage_meta_title"
                          value={formData.homepage_meta_title}
                          onChange={handleInputChange}
                          placeholder="e.g. Buy Generic Medicines Online - The Cheap Pharma"
                          className="border-0 bg-light shadow-sm"
                          style={{ borderRadius: '10px', padding: '12px 16px' }}
                        />
                        <div className="d-flex justify-content-between mt-1 px-1">
                          <Form.Text className="text-muted small">
                            Optimal size: 50–60 characters.
                          </Form.Text>
                          <Form.Text className={formData.homepage_meta_title.length >= 50 && formData.homepage_meta_title.length <= 60 ? 'text-success fw-bold' : 'text-warning'}>
                            {formData.homepage_meta_title.length} chars
                          </Form.Text>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Meta Description */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold text-secondary small">Homepage Meta Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="homepage_meta_description"
                          value={formData.homepage_meta_description}
                          onChange={handleInputChange}
                          placeholder="e.g. Find high-quality medications at the lowest prices. Enjoy safe checkout, verified suppliers, and discreet shipping at The Cheap Pharma."
                          className="border-0 bg-light shadow-sm"
                          style={{ borderRadius: '10px', padding: '12px 16px' }}
                        />
                        <div className="d-flex justify-content-between mt-1 px-1">
                          <Form.Text className="text-muted small">
                            Optimal size: 150–160 characters.
                          </Form.Text>
                          <Form.Text className={formData.homepage_meta_description.length >= 150 && formData.homepage_meta_description.length <= 160 ? 'text-success fw-bold' : 'text-warning'}>
                            {formData.homepage_meta_description.length} chars
                          </Form.Text>
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Focus Keyword */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold text-secondary small">Homepage Focus Keyword</Form.Label>
                        <Form.Control
                          type="text"
                          name="homepage_focus_keyword"
                          value={formData.homepage_focus_keyword}
                          onChange={handleInputChange}
                          placeholder="e.g. cheap generic medicines"
                          className="border-0 bg-light shadow-sm"
                          style={{ borderRadius: '10px', padding: '12px 16px' }}
                        />
                        <Form.Text className="text-muted d-block mt-1 px-1 small">
                          The target search term you want this page to rank for. This is injected as a priority entry in the homepage keywords meta tag.
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

            {/* Sidebar Preview Card */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
                  <h5 className="fw-bold mb-0 text-slate-800">Snippet Preview</h5>
                  <p className="text-muted small mb-0 mt-1">Behold how the homepage appears in search engine result pages (SERPs).</p>
                </Card.Header>
                <Card.Body className="p-4">
                  {/* Google Preview Container */}
                  <div 
                    className="p-4 border rounded-3 bg-white" 
                    style={{ 
                      borderColor: '#e2e8f0', 
                      fontFamily: 'arial, sans-serif',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* Brand / Title Link */}
                    <div style={{ fontSize: '20px', color: '#1a0dab', lineHeight: '1.3', marginBottom: '4px', cursor: 'pointer', wordBreak: 'break-word' }}>
                      {previewTitle}
                    </div>
                    {/* URL */}
                    <div className="d-flex align-items-center text-truncate" style={{ fontSize: '14px', color: '#202124', marginBottom: '8px' }}>
                      <span className="text-muted">https://thecheappharma.com</span>
                      <i className="bi bi-three-dots-vertical ms-1 text-muted" style={{ fontSize: '12px' }}></i>
                    </div>
                    {/* Description */}
                    <div style={{ fontSize: '14px', color: '#4d5156', lineHeight: '1.58', wordBreak: 'break-word' }}>
                      {previewDescription.length > 160 ? previewDescription.substring(0, 157) + '...' : previewDescription}
                    </div>
                  </div>

                  {/* SEO Guidelines Checklist */}
                  <div className="mt-4 p-3 rounded-3 bg-light border border-slate-200">
                    <h6 className="fw-bold mb-2 small text-secondary text-uppercase tracking-wider">SEO Best Practices</h6>
                    <ul className="list-unstyled mb-0 small text-muted d-flex flex-column gap-2">
                      <li className="d-flex align-items-start">
                        <i className={`bi ${formData.homepage_meta_title.length >= 50 && formData.homepage_meta_title.length <= 60 ? 'bi-check-circle-fill text-success' : 'bi-info-circle text-warning'} me-2 mt-0.5`}></i>
                        <span>Title length is optimal between 50 and 60 characters to avoid truncation.</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className={`bi ${formData.homepage_meta_description.length >= 150 && formData.homepage_meta_description.length <= 160 ? 'bi-check-circle-fill text-success' : 'bi-info-circle text-warning'} me-2 mt-0.5`}></i>
                        <span>Meta description length is optimal between 150 and 160 characters.</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className={`bi ${formData.homepage_focus_keyword.trim() ? 'bi-check-circle-fill text-success' : 'bi-info-circle text-warning'} me-2 mt-0.5`}></i>
                        <span>Focus keyword is configured to align homepage search intent.</span>
                      </li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </AdminLayout>
  );
}

export default AdminSEO;
