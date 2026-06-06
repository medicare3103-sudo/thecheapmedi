import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../api';

function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Form State
  const [currentAuthorSlug, setCurrentAuthorSlug] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    role: '',
    badge: '',
    educationShort: '',
    image: '',
    aboutSub: '',
    educationList: '', // will be parsed/serialized as string with newlines
    bioParagraphs: '', // will be parsed/serialized as string with newlines
    research: '',
    grants: '',       // will be parsed/serialized as string with newlines
    interests: '',
    affiliations: '', // will be parsed/serialized as string with newlines
    service: '',
    conclusion: '',
    isDoctor: true
  });

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAuthors();
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const parseNewlineInput = (text) => {
    if (!text) return [];
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  };

  const joinNewlineInput = (arr) => {
    if (!arr) return '';
    return arr.join('\n');
  };

  const handleShowModal = (mode, author = null) => {
    setModalMode(mode);
    if (mode === 'edit' && author) {
      setCurrentAuthorSlug(author.slug);
      setFormData({
        slug: author.slug || '',
        name: author.name || '',
        role: author.role || '',
        badge: author.badge || '',
        educationShort: author.educationShort || '',
        image: author.image || '',
        aboutSub: author.aboutSub || '',
        educationList: joinNewlineInput(author.educationList),
        bioParagraphs: joinNewlineInput(author.bioParagraphs),
        research: author.research || '',
        grants: joinNewlineInput(author.grants),
        interests: author.interests || '',
        affiliations: joinNewlineInput(author.affiliations),
        service: author.service || '',
        conclusion: author.conclusion || '',
        isDoctor: author.isDoctor !== undefined ? author.isDoctor : true
      });
    } else {
      setCurrentAuthorSlug(null);
      setFormData({
        slug: '',
        name: '',
        role: '',
        badge: '',
        educationShort: '',
        image: '',
        aboutSub: '',
        educationList: '',
        bioParagraphs: '',
        research: '',
        grants: '',
        interests: '',
        affiliations: '',
        service: '',
        conclusion: '',
        isDoctor: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name if in add mode and name changes
    if (name === 'name' && modalMode === 'add') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generatedSlug
      }));
    } else if (name === 'isDoctor') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        educationList: parseNewlineInput(formData.educationList),
        bioParagraphs: parseNewlineInput(formData.bioParagraphs),
        grants: parseNewlineInput(formData.grants),
        affiliations: parseNewlineInput(formData.affiliations)
      };

      if (modalMode === 'add') {
        await createAuthor(payload);
      } else if (modalMode === 'edit') {
        await updateAuthor(currentAuthorSlug, payload);
      }
      
      handleCloseModal();
      fetchAuthors(); // Refresh list
    } catch (error) {
      console.error('Error saving author:', error);
      alert('Failed to save author. Check console for details.');
    }
  };

  const handleDelete = async (slug, name) => {
    if (window.confirm(`Are you sure you want to delete profile for "${name}"?\nThis action cannot be undone.`)) {
      try {
        await deleteAuthor(slug);
        fetchAuthors(); // Refresh list
      } catch (error) {
        console.error('Error deleting author:', error);
        alert('Failed to delete author.');
      }
    }
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
            <Nav.Link as={Link} to="/admin/authors" className="text-white bg-white bg-opacity-10 rounded px-3 py-2">
              <i className="bi bi-people me-2"></i> Authors & Reviewers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-person-badge me-2"></i> Customers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/coupons" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-ticket-perforated me-2"></i> Coupons
            </Nav.Link>
            <Nav.Link as={Link} to="/admin" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-bar-chart me-2"></i> Analytics
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
            <h4 className="mb-0 fw-bold">Author & Reviewer Management</h4>
            <div className="d-flex align-items-center gap-3">
              <Button variant="primary" size="sm" onClick={() => handleShowModal('add')}>
                <i className="bi bi-plus-lg me-2"></i>Add New Profile
              </Button>
            </div>
          </div>

          <div className="px-4 pb-5">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Photo</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Name / Slug</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Role</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Type</th>
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
                      ) : authors.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            No profiles found. Add one to get started!
                          </td>
                        </tr>
                      ) : (
                        authors.map((author) => (
                          <tr key={author.slug}>
                            <td className="px-4 py-3">
                              {author.image ? (
                                <img src={author.image} alt={author.name} className="rounded-circle object-fit-cover shadow-sm border" style={{ width: '45px', height: '45px' }} />
                              ) : (
                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
                                  {author.name.charAt(0)}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="fw-bold text-dark">{author.name}</div>
                              <div className="text-muted small">/{author.slug}</div>
                            </td>
                            <td className="px-4 py-3 text-secondary" style={{maxWidth: '220px'}}>{author.role}</td>
                            <td className="px-4 py-3">
                              {author.isDoctor ? (
                                <span className="badge bg-info text-dark">Reviewer (Doctor)</span>
                              ) : (
                                <span className="badge bg-warning text-dark">Writer (Author)</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-end">
                              <Button variant="light" size="sm" className="me-2 text-primary shadow-sm" onClick={() => handleShowModal('edit', author)}>
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button variant="light" size="sm" className="text-danger shadow-sm" onClick={() => handleDelete(author.slug, author.name)}>
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
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            {modalMode === 'add' ? 'Create Author/Reviewer Profile' : 'Edit Profile'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pt-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Row className="g-3">
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Dr. Sarah Jenkins" />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Slug (URL identifier) <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="sarah-jenkins" disabled={modalMode === 'edit'} />
                  <Form.Text className="text-muted">Unique ID used in routing</Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Profile Role/Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="role" value={formData.role} onChange={handleInputChange} required placeholder="Chief Medical Reviewer (MD, Pharm D)" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="isDoctor" value={formData.isDoctor.toString()} onChange={handleInputChange}>
                    <option value="true">Medical Reviewer (Doctor)</option>
                    <option value="false">Editorial Author (Writer)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Badge Designation</Form.Label>
                  <Form.Control type="text" name="badge" value={formData.badge} onChange={handleInputChange} placeholder="Medical Expert Board Member" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Education Summary (Short)</Form.Label>
                  <Form.Control type="text" name="educationShort" value={formData.educationShort} onChange={handleInputChange} placeholder="Doctor of Medicine (MD) - Harvard Medical School" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Sub-About Tagline</Form.Label>
                  <Form.Control type="text" name="aboutSub" value={formData.aboutSub} onChange={handleInputChange} placeholder="Clinical Pharmacist (Pharm D)" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Profile Picture</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                  <Form.Text className="text-muted">Upload a profile picture from device</Form.Text>
                </Form.Group>
              </Col>

              <Col md={6} className="d-flex align-items-center">
                {formData.image && (
                  <div className="mt-2">
                    <span className="small text-muted d-block mb-1">Image Preview:</span>
                    <img src={formData.image} alt="Preview" className="rounded border object-fit-cover shadow-sm" style={{ width: '80px', height: '80px' }} />
                  </div>
                )}
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Detailed Bio (One paragraph per line)</Form.Label>
                  <Form.Control as="textarea" rows={4} name="bioParagraphs" value={formData.bioParagraphs} onChange={handleInputChange} placeholder="Sarah Jenkins is a dedicated clinical pharmacologist..." />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Education Degrees/Details (One per line)</Form.Label>
                  <Form.Control as="textarea" rows={3} name="educationList" value={formData.educationList} onChange={handleInputChange} placeholder="Doctor of Medicine (MD) – Harvard Medical School&#10;Biomedical Engineering – MIT" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Research Experience</Form.Label>
                  <Form.Control as="textarea" rows={2} name="research" value={formData.research} onChange={handleInputChange} placeholder="Graduate Research Assistant, Department of Pathology..." />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Grants (One per line)</Form.Label>
                  <Form.Control as="textarea" rows={2} name="grants" value={formData.grants} onChange={handleInputChange} placeholder="HRPF membership – National Cancer Institute" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Field of Interest</Form.Label>
                  <Form.Control type="text" name="interests" value={formData.interests} onChange={handleInputChange} placeholder="Department of Pharmacy – Pharmacological Physiology" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Professional Affiliations (One per line)</Form.Label>
                  <Form.Control as="textarea" rows={2} name="affiliations" value={formData.affiliations} onChange={handleInputChange} placeholder="American Association of Colleges of Pharmacy" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Service Positions</Form.Label>
                  <Form.Control type="text" name="service" value={formData.service} onChange={handleInputChange} placeholder="American Board of Clinical Pharmacology (ABCP)" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Conclusion Text (Concluding summary sentence)</Form.Label>
                  <Form.Control as="textarea" rows={2} name="conclusion" value={formData.conclusion} onChange={handleInputChange} placeholder="Dr. Sarah Jenkins is a helpful resource..." />
                </Form.Group>
              </Col>

            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button variant="light" onClick={handleCloseModal} className="px-4 fw-bold">Cancel</Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {modalMode === 'add' ? 'Create Profile' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
}

export default AdminAuthors;
