import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Row, Col, Badge } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Form State
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    show_in_navbar: false,
    subcategories: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleShowModal = (mode, category = null) => {
    setModalMode(mode);
    if (mode === 'edit' && category) {
      setCurrentCategoryId(category.id);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        show_in_navbar: !!category.show_in_navbar,
        subcategories: category.subcategories ? category.subcategories.join(', ') : ''
      });
    } else {
      setCurrentCategoryId(null);
      setFormData({
        name: '',
        description: '',
        show_in_navbar: false,
        subcategories: ''
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
    
    // Parse subcategories string into array of trimmed strings
    const parsedSubcategories = formData.subcategories
      ? formData.subcategories.split(',').map(s => s.trim()).filter(Boolean)
      : [];
      
    const payload = {
      name: formData.name,
      description: formData.description,
      show_in_navbar: formData.show_in_navbar,
      subcategories: parsedSubcategories
    };

    try {
      if (modalMode === 'add') {
        await createCategory(payload);
      } else if (modalMode === 'edit') {
        await updateCategory(currentCategoryId, payload);
      }
      
      handleCloseModal();
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Check console for details.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) {
      try {
        await deleteCategory(id);
        fetchCategories(); // Refresh list
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  const actions = (
    <Button variant="primary" size="sm" onClick={() => handleShowModal('add')}>
      <i className="bi bi-plus-lg me-2"></i>Add New Category
    </Button>
  );

  return (
    <AdminLayout title="Category Management" actions={actions}>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">ID</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Category Name</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Description</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Navbar</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Subcategories</th>
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
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No categories found. Add one to get started!
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-4 py-3 text-muted">#{category.id}</td>
                      <td className="px-4 py-3 fw-bold text-dark">{category.name}</td>
                      <td className="px-4 py-3 text-muted text-truncate" style={{maxWidth: '180px'}}>{category.description || 'No description'}</td>
                      <td className="px-4 py-3">
                        {category.show_in_navbar ? (
                          <Badge bg="success" className="px-2.5 py-1 rounded-pill small fw-bold">Yes</Badge>
                        ) : (
                          <Badge bg="secondary" className="px-2.5 py-1 rounded-pill small fw-bold">No</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex flex-wrap gap-1" style={{maxWidth: '280px'}}>
                          {category.subcategories && category.subcategories.length > 0 ? (
                            category.subcategories.map((sub, idx) => (
                              <Badge key={idx} bg="primary" className="rounded-pill fw-normal px-2 py-1" style={{fontSize: '0.75rem'}}>{sub}</Badge>
                            ))
                          ) : (
                            <span className="text-muted small">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="me-2 text-primary shadow-sm" onClick={() => handleShowModal('edit', category)}>
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button variant="light" size="sm" className="text-danger shadow-sm" onClick={() => handleDelete(category.id, category.name)}>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pt-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Category Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Pain Relief" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description of this category..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-1">
                  <Form.Check 
                    type="checkbox"
                    id="show-in-navbar-check"
                    name="show_in_navbar"
                    label="Show in Navigation Bar"
                    checked={formData.show_in_navbar}
                    onChange={handleInputChange}
                    className="fw-bold text-secondary small text-uppercase"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Subcategories</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="subcategories" 
                    value={formData.subcategories} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Erectile Dysfunction, Vidalista, Cenforce (comma-separated)" 
                  />
                  <Form.Text className="text-muted small">
                    Enter subcategories separated by commas. Leave empty if none.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button variant="light" onClick={handleCloseModal} className="px-4 fw-bold">Cancel</Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </AdminLayout>
  );
}

export default AdminCategories;
