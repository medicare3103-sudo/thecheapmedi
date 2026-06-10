import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import RichTextEditor from '../components/RichTextEditor';
import { getProducts, createProduct, updateProduct, deleteProduct, getAuthors, getCategories } from '../api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeTab, setActiveTab] = useState('vital');
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');
  
  // Form State
  const [currentProductId, setCurrentProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    manufacturer: '',
    category: '',
    price: '',
    stock: '',
    pack_sizes: [],
    image_url: '',
    description: '',
    tags: [],
    uses: '',
    dosage: '',
    side_effects: '',
    active_ingredient: '',
    rx_required: false,
    referred_by_doctor: '',
    doctor_title: '',
    doctor_institution: '',
    doctor_image_url: '',
    doctor_advice: '',
    reviewer_slug: '',
    writer_slug: '',
    is_featured: false,
    is_trending: false,
    is_bestselling: false,
    indication: '',
    packaging: '',
    strength: '',
    delivery_time: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAuthors();
    fetchCategories();
  }, []);

  const handleShowModal = (mode, product = null) => {
    setModalMode(mode);
    setActiveTab('vital'); // Reset to first tab
    if (mode === 'edit' && product) {
      setCurrentProductId(product.id);
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        manufacturer: product.manufacturer || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || 0,
        pack_sizes: product.pack_sizes || [],
        image_url: product.image_url || '',
        description: product.description || '',
        tags: product.tags || [],
        uses: product.uses || '',
        dosage: product.dosage || '',
        side_effects: product.side_effects || '',
        active_ingredient: product.active_ingredient || '',
        rx_required: product.rx_required || false,
        referred_by_doctor: product.referred_by_doctor || '',
        doctor_title: product.doctor_title || '',
        doctor_institution: product.doctor_institution || '',
        doctor_image_url: product.doctor_image_url || '',
        doctor_advice: product.doctor_advice || '',
        reviewer_slug: product.reviewer_slug || '',
        writer_slug: product.writer_slug || '',
        is_featured: product.is_featured || false,
        is_trending: product.is_trending || false,
        is_bestselling: product.is_bestselling || false,
        indication: product.indication || '',
        packaging: product.packaging || '',
        strength: product.strength || '',
        delivery_time: product.delivery_time || ''
      });
    } else {
      setCurrentProductId(null);
      setFormData({
        name: '',
        brand: '',
        manufacturer: '',
        category: '',
        price: '',
        stock: '',
        pack_sizes: [],
        image_url: '',
        description: '',
        tags: [],
        uses: '',
        dosage: '',
        side_effects: '',
        active_ingredient: '',
        rx_required: false,
        referred_by_doctor: '',
        doctor_title: '',
        doctor_institution: '',
        doctor_image_url: '',
        doctor_advice: '',
        reviewer_slug: '',
        writer_slug: '',
        is_featured: false,
        is_trending: false,
        is_bestselling: false,
        indication: '',
        packaging: '',
        strength: '',
        delivery_time: ''
      });
    }
    setTagInput('');
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Tag management handlers
  const handleAddTag = () => {
    const raw = tagInput.trim();
    if (!raw) return;
    // Support comma-separated tags in one go
    const newTags = raw.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
    setFormData(prev => ({
      ...prev,
      tags: [...new Set([...(prev.tags || []), ...newTags])]
    }));
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
    if (e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPackSize = () => {
    setFormData(prev => ({
      ...prev,
      pack_sizes: [...(prev.pack_sizes || []), { size: '', price: '' }]
    }));
  };

  const handleRemovePackSize = (index) => {
    setFormData(prev => ({
      ...prev,
      pack_sizes: prev.pack_sizes.filter((_, i) => i !== index)
    }));
  };

  const handlePackSizeChange = (index, field, value) => {
    const newPackSizes = [...(formData.pack_sizes || [])];
    newPackSizes[index] = { ...newPackSizes[index], [field]: field === 'price' && value !== '' ? parseFloat(value) : value };
    setFormData(prev => ({ ...prev, pack_sizes: newPackSizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        // Filter out incomplete/invalid variations and ensure floats are parsed properly
        pack_sizes: (formData.pack_sizes || [])
          .filter(ps => ps.size && ps.price !== '' && !isNaN(parseFloat(ps.price)))
          .map(ps => ({ size: ps.size.trim(), price: parseFloat(ps.price) }))
      };

      if (modalMode === 'add') {
        await createProduct(payload);
      } else if (modalMode === 'edit') {
        await updateProduct(currentProductId, payload);
      }
      
      handleCloseModal();
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMsg = error.response?.data?.detail 
        ? (typeof error.response.data.detail === 'string' 
            ? error.response.data.detail 
            : JSON.stringify(error.response.data.detail)) 
        : error.message;
      alert(`Failed to save product: ${errorMsg}`);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? products.map(p => p.id) : []);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected product${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteProduct(id)));
      setSelectedIds([]);
      fetchProducts();
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Some products could not be deleted.');
    } finally {
      setBulkDeleting(false);
    }
  };

  // Helper to check if required fields are filled to enable the save button
  const isFormValid = () => {
    return formData.name && formData.price !== '' && formData.stock !== '';
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const actions = (
    <Button variant="primary" size="sm" onClick={() => handleShowModal('add')} className="fw-bold shadow-sm px-3">
      <i className="bi bi-plus-lg me-2"></i>Add a Product
    </Button>
  );

  return (
    <AdminLayout title="Manage Inventory" actions={actions}>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-action-bar mb-3 d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="bulk-count-badge">{selectedIds.length}</span>
            <span className="fw-semibold text-dark">{selectedIds.length === 1 ? 'product' : 'products'} selected</span>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button type="button" className="bulk-clear-btn" onClick={() => setSelectedIds([])}>
              <i className="bi bi-x-circle me-1"></i> Clear Selection
            </button>
            <button type="button" className="bulk-delete-btn" onClick={handleBulkDelete} disabled={bulkDeleting}>
              {bulkDeleting
                ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Deleting...</>
                : <><i className="bi bi-trash3-fill me-2"></i>Delete {selectedIds.length} Selected</>}
            </button>
          </div>
        </div>
      )}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 px-4 py-3" style={{ width: '48px' }}>
                    <input
                      type="checkbox"
                      className="bulk-checkbox"
                      checked={allSelected}
                      ref={el => { if (el) el.indeterminate = someSelected; }}
                      onChange={handleSelectAll}
                      title="Select all"
                    />
                  </th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Product</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Category</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Price</th>
                  <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide">Stock</th>
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
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No products found. Add a product to get started!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className={selectedIds.includes(product.id) ? 'bulk-row-selected' : ''}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="bulk-checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => handleToggleSelect(product.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded d-flex justify-content-center align-items-center me-3" style={{width: '40px', height: '40px', overflow: 'hidden'}}>
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                            ) : (
                              <i className="bi bi-image text-muted"></i>
                            )}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{product.name}</div>
                            <div className="small text-muted d-flex align-items-center gap-2 flex-wrap mt-1">
                              <span>{product.brand || 'No Brand'}</span>
                              {product.is_featured && <Badge bg="primary" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Featured</Badge>}
                              {product.is_trending && <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Trending</Badge>}
                              {product.is_bestselling && <Badge bg="success" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Best Seller</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge bg="secondary" className="fw-normal">{product.category || 'Uncategorized'}</Badge>
                      </td>
                      <td className="px-4 py-3 fw-bold">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`fw-500 ${product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button variant="light" size="sm" className="me-2 text-primary shadow-sm fw-bold" onClick={() => handleShowModal('edit', product)}>
                          Edit
                        </Button>
                        <Button variant="light" size="sm" className="text-danger shadow-sm fw-bold" onClick={() => handleDelete(product.id, product.name)}>
                          Delete
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

      {/* Amazon Seller Style Add/Edit Modal (Fullscreen) */}
      <Modal show={showModal} onHide={handleCloseModal} fullscreen className="seller-modal">
        <Form onSubmit={handleSubmit} className="h-100 d-flex flex-column bg-light">
          {/* Header */}
          <div className="bg-dark text-white px-4 py-3 d-flex justify-content-between align-items-center shadow-sm z-1">
            <h4 className="mb-0 fw-bold">
              {modalMode === 'add' ? 'Add a Product' : `Edit Product: ${formData.name}`}
            </h4>
            <div className="d-flex gap-3 align-items-center">
              <span className="text-white-50 small">
                <i className="bi bi-info-circle me-1"></i> Ensure all required fields (*) are filled before saving.
              </span>
              <Button variant="outline-light" onClick={handleCloseModal} className="fw-bold px-4">Cancel</Button>
              <Button variant="primary" type="submit" disabled={!isFormValid()} className="fw-bold px-4 shadow-sm">
                Save & Finish
              </Button>
            </div>
          </div>

          {/* Body with Tabs */}
          <div className="flex-grow-1 overflow-auto p-4">
            <Container className="bg-white rounded-4 shadow-sm p-4 h-100" style={{maxWidth: '1200px'}}>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4 custom-seller-tabs border-bottom"
                variant="underline"
              >
                {/* 1. VITAL INFO TAB */}
                <Tab eventKey="vital" title={<span className="fw-bold px-2 py-1"><i className="bi bi-card-heading me-2"></i>Vital Info</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Product Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Aspirin 500mg Tablets" className="bg-light border-0 py-2" />
                        <Form.Text className="text-muted">The exact name that will appear on the product listing.</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Manufacturer</Form.Label>
                        <Form.Control type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="e.g. Johnson & Johnson" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Category <span className="text-danger">*</span></Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={handleInputChange} className="bg-light border-0 py-2" required>
                          <option value="">Select a category...</option>
                          {categories.map(cat => (
                            <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Active Ingredient</Form.Label>
                        <Form.Control type="text" name="active_ingredient" value={formData.active_ingredient} onChange={handleInputChange} placeholder="e.g. Metformin HCl" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Indication</Form.Label>
                        <Form.Control type="text" name="indication" value={formData.indication} onChange={handleInputChange} placeholder="e.g. Erectile Dysfunction" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Packaging</Form.Label>
                        <Form.Control type="text" name="packaging" value={formData.packaging} onChange={handleInputChange} placeholder="e.g. 10 tablets in 1 strip" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Strength</Form.Label>
                        <Form.Control type="text" name="strength" value={formData.strength} onChange={handleInputChange} placeholder="e.g. 200mg" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Delivery Time</Form.Label>
                        <Form.Control type="text" name="delivery_time" value={formData.delivery_time} onChange={handleInputChange} placeholder="e.g. 6 To 15 days" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="d-flex align-items-center">
                      <Form.Group className="mb-0 mt-4">
                        <Form.Check 
                          type="checkbox" 
                          label="Rx Prescription Required" 
                          name="rx_required" 
                          checked={formData.rx_required} 
                          onChange={(e) => setFormData(prev => ({ ...prev, rx_required: e.target.checked }))} 
                          className="fw-bold text-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* 2. OFFER TAB */}
                <Tab eventKey="offer" title={<span className="fw-bold px-2 py-1"><i className="bi bi-tag me-2"></i>Offer</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Standard Price ($) <span className="text-danger">*</span></Form.Label>
                        <div className="input-group">
                          <span className="input-group-text border-0 bg-light fw-bold text-muted">$</span>
                          <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required placeholder="0.00" className="bg-light border-0 py-2" />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Quantity (Stock) <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required placeholder="0" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Label className="fw-bold d-block mt-2">Promotional Flags (Home Page Sections)</Form.Label>
                      <Form.Group className="d-flex gap-4 mt-1">
                        <Form.Check 
                          type="checkbox" 
                          label="Featured Product" 
                          name="is_featured" 
                          checked={formData.is_featured} 
                          onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} 
                          className="fw-semibold text-secondary"
                        />
                        <Form.Check 
                          type="checkbox" 
                          label="Trending Product" 
                          name="is_trending" 
                          checked={formData.is_trending} 
                          onChange={(e) => setFormData(prev => ({ ...prev, is_trending: e.target.checked }))} 
                          className="fw-semibold text-secondary"
                        />
                        <Form.Check 
                          type="checkbox" 
                          label="Best Selling Product" 
                          name="is_bestselling" 
                          checked={formData.is_bestselling} 
                          onChange={(e) => setFormData(prev => ({ ...prev, is_bestselling: e.target.checked }))} 
                          className="fw-semibold text-secondary"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

                {/* 3. VARIATIONS TAB */}
                <Tab eventKey="variations" title={<span className="fw-bold px-2 py-1"><i className="bi bi-diagram-2 me-2"></i>Variations</span>}>
                  <div className="max-w-800">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h6 className="fw-bold mb-1">Pack Sizes</h6>
                        <p className="text-muted small mb-0">Does this product come in different pack sizes? Add them below.</p>
                      </div>
                      <Button variant="outline-primary" onClick={handleAddPackSize} className="fw-bold">
                        <i className="bi bi-plus-lg me-1"></i> Add Variation
                      </Button>
                    </div>
                    
                    {(!formData.pack_sizes || formData.pack_sizes.length === 0) ? (
                      <div className="text-center p-5 bg-light rounded-4 border border-dashed text-muted">
                        <i className="bi bi-box-seam fs-1 mb-2 d-block"></i>
                        No variations added. The standard price will be used.
                      </div>
                    ) : (
                      <Table bordered hover className="align-middle">
                        <thead className="bg-light">
                          <tr>
                            <th className="fw-bold text-muted">Size Option (e.g. 30 Tablets)</th>
                            <th className="fw-bold text-muted">Price ($)</th>
                            <th className="fw-bold text-muted">Unit Price (Auto)</th>
                            <th className="fw-bold text-muted text-center" style={{width: '80px'}}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.pack_sizes.map((pack, idx) => {
                            const sizeMatch = pack.size.match(/(\d+)/);
                            const tabletCount = sizeMatch ? parseInt(sizeMatch[1]) : 1;
                            const unitPrice = pack.price ? (parseFloat(pack.price) / tabletCount).toFixed(2) : '0.00';
                            
                            return (
                              <tr key={idx}>
                                <td className="p-2">
                                  <Form.Control type="text" placeholder="e.g. 30 Tablet/s" value={pack.size} onChange={(e) => handlePackSizeChange(idx, 'size', e.target.value)} required className="border-0 shadow-none bg-transparent" />
                                </td>
                                <td className="p-2">
                                  <div className="input-group">
                                    <span className="input-group-text border-0 bg-transparent text-muted">$</span>
                                    <Form.Control type="number" step="0.01" placeholder="0.00" value={pack.price} onChange={(e) => handlePackSizeChange(idx, 'price', e.target.value)} required className="border-0 shadow-none bg-transparent" />
                                  </div>
                                </td>
                                <td className="p-2 text-muted fw-500">
                                  ${unitPrice}
                                </td>
                                <td className="p-2 text-center">
                                  <Button variant="link" className="text-danger p-0 border-0" onClick={() => handleRemovePackSize(idx)}>
                                    <i className="bi bi-trash fs-5"></i>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </Tab>

                {/* 4. IMAGES TAB */}
                <Tab eventKey="images" title={<span className="fw-bold px-2 py-1"><i className="bi bi-images me-2"></i>Images</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Upload Product Image</Form.Label>
                        <Form.Control 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="bg-light border-0 py-2" 
                        />
                        <Form.Text className="text-muted">Upload an image file directly from your device.</Form.Text>
                        {formData.image_url && (
                          <div className="mt-2">
                            <Button 
                              type="button" 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                              className="fw-bold animate-fade-in"
                            >
                              <i className="bi bi-trash me-1"></i> Remove Image
                            </Button>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <div className="border rounded-4 p-4 text-center bg-light" style={{minHeight: '300px'}}>
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Preview" style={{maxHeight: '250px', objectFit: 'contain'}} className="rounded" />
                        ) : (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50 pt-5">
                            <i className="bi bi-image fs-1 mb-2"></i>
                            <p>Image preview will appear here</p>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Tab>

                {/* 5. DESCRIPTION TAB */}
                <Tab eventKey="description" title={<span className="fw-bold px-2 py-1"><i className="bi bi-card-text me-2"></i>Description</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Product Description</Form.Label>
                        <RichTextEditor value={formData.description} onChange={(val) => setFormData(prev => ({ ...prev, description: val }))} placeholder="General overview of the product..." />
                        <Form.Text className="text-muted">You can use the toolbar to add links, bold/italic text, and more. HTML formatting is supported.</Form.Text>
                      </Form.Group>
                    </Col>

                    {/* SEO Tags Section */}
                    <Col md={12}>
                      <hr className="my-2" />
                      <div className="p-4 rounded-4" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f5e9 100%)', border: '1px solid #d0e8ff' }}>
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 p-2 rounded-3" style={{ background: '#0d6efd22' }}>
                            <i className="bi bi-tags-fill text-primary fs-5"></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0">SEO Tags / Keywords</h6>
                            <small className="text-muted">These tags are injected as meta keywords in the product page &lt;head&gt; for better search engine ranking.</small>
                          </div>
                        </div>

                        {/* Tag Input */}
                        <div className="d-flex gap-2 mb-3">
                          <Form.Control
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Type a tag and press Enter or comma... (e.g. sildenafil, men's health)"
                            className="border-0 shadow-sm"
                            style={{ borderRadius: '8px' }}
                          />
                          <Button
                            type="button"
                            variant="primary"
                            onClick={handleAddTag}
                            className="fw-bold px-3 shadow-sm flex-shrink-0"
                            style={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                          >
                            <i className="bi bi-plus-lg me-1"></i> Add Tag
                          </Button>
                        </div>

                        {/* Tag Badges Display */}
                        {(formData.tags && formData.tags.length > 0) ? (
                          <div className="d-flex flex-wrap gap-2">
                            {formData.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="d-inline-flex align-items-center gap-1 px-3 py-1 fw-semibold"
                                style={{
                                  background: '#e8f0fe',
                                  color: '#1a73e8',
                                  borderRadius: '20px',
                                  fontSize: '0.82rem',
                                  border: '1px solid #c2d9ff'
                                }}
                              >
                                <i className="bi bi-hash" style={{ fontSize: '0.75rem' }}></i>
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="border-0 p-0 ms-1 d-flex align-items-center"
                                  style={{ background: 'none', color: '#1a73e8', cursor: 'pointer', lineHeight: 1 }}
                                  title={`Remove tag: ${tag}`}
                                >
                                  <i className="bi bi-x-circle-fill" style={{ fontSize: '0.85rem' }}></i>
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-muted" style={{ border: '2px dashed #c2d9ff', borderRadius: '10px', background: '#fff' }}>
                            <i className="bi bi-tags fs-4 mb-1 d-block opacity-50"></i>
                            <small>No tags added yet. Tags improve SEO and product discoverability.</small>
                          </div>
                        )}

                        <div className="mt-3">
                          <small className="text-muted">
                            <i className="bi bi-lightbulb-fill text-warning me-1"></i>
                            <strong>Tip:</strong> Add 5–15 relevant keywords. You can separate multiple tags with commas.
                            Examples: <em>generic viagra, sildenafil citrate, erectile dysfunction, ed pills</em>
                          </small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Tab>

                {/* 6. MEDICAL INFO TAB */}
                <Tab eventKey="medical" title={<span className="fw-bold px-2 py-1"><i className="bi bi-heart-pulse me-2"></i>Medical Info</span>}>
                  <div className="medical-info-tab">

                    {/* Clinical Info Section */}
                    <div className="med-section-card mb-4">
                      <div className="med-section-header">
                        <div className="med-section-icon" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                          <i className="bi bi-clipboard2-pulse-fill"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Clinical Information</h6>
                          <small className="text-muted">Medical usage, dosage, and safety information</small>
                        </div>
                      </div>

                      <div className="med-section-body">
                        {/* Indications & Uses */}
                        <div className="med-field-group uses-group mb-4">
                          <Form.Label className="med-field-label">
                            <span className="med-label-dot" style={{ background: '#22c55e' }}></span>
                            <i className="bi bi-check2-circle me-2 text-success"></i>
                            Indications &amp; Uses
                          </Form.Label>
                          <div className="med-textarea-wrap">
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="uses"
                              value={formData.uses}
                              onChange={handleInputChange}
                              placeholder="What is this medication used for? List the main indications..."
                              className="med-textarea"
                            />
                          </div>
                        </div>

                        {/* Dosage */}
                        <div className="med-field-group dosage-group mb-4">
                          <Form.Label className="med-field-label">
                            <span className="med-label-dot" style={{ background: '#3b82f6' }}></span>
                            <i className="bi bi-capsule me-2 text-primary"></i>
                            Dosage &amp; Administration
                          </Form.Label>
                          <div className="med-textarea-wrap">
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="dosage"
                              value={formData.dosage}
                              onChange={handleInputChange}
                              placeholder="Recommended dosage, frequency, and how to take this medication..."
                              className="med-textarea"
                            />
                          </div>
                        </div>

                        {/* Side Effects */}
                        <div className="med-field-group side-effects-group mb-0">
                          <Form.Label className="med-field-label">
                            <span className="med-label-dot" style={{ background: '#f59e0b' }}></span>
                            <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                            Side Effects
                          </Form.Label>
                          <div className="med-textarea-wrap">
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="side_effects"
                              value={formData.side_effects}
                              onChange={handleInputChange}
                              placeholder="Common and serious side effects to watch out for..."
                              className="med-textarea"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Authors & Reviewers Section */}
                    <div className="med-section-card">
                      <div className="med-section-header">
                        <div className="med-section-icon" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                          <i className="bi bi-people-fill"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Authors &amp; Reviewers</h6>
                          <small className="text-muted">Assign a medical reviewer and editorial author to this product</small>
                        </div>
                      </div>

                      <div className="med-section-body">
                        <Row className="g-3 mb-4">
                          <Col md={6}>
                            <div className="author-select-card reviewer-card">
                              <div className="author-select-label">
                                <div className="author-role-badge reviewer-badge">
                                  <i className="bi bi-shield-fill-check me-1"></i> Medical Reviewer
                                </div>
                              </div>
                              <Form.Select
                                name="reviewer_slug"
                                value={formData.reviewer_slug || ''}
                                onChange={handleInputChange}
                                className="author-select"
                              >
                                <option value="">— Select a Doctor / Reviewer —</option>
                                {authors.filter(a => a.isDoctor).map(author => (
                                  <option key={author.slug} value={author.slug}>{author.name}</option>
                                ))}
                              </Form.Select>
                              {formData.reviewer_slug && (
                                <div className="author-selected-hint">
                                  <i className="bi bi-person-check-fill text-success me-1"></i>
                                  <small className="text-success fw-semibold">
                                    {authors.find(a => a.slug === formData.reviewer_slug)?.name || formData.reviewer_slug}
                                  </small>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="author-select-card writer-card">
                              <div className="author-select-label">
                                <div className="author-role-badge writer-badge">
                                  <i className="bi bi-pen-fill me-1"></i> Editorial Author
                                </div>
                              </div>
                              <Form.Select
                                name="writer_slug"
                                value={formData.writer_slug || ''}
                                onChange={handleInputChange}
                                className="author-select"
                              >
                                <option value="">— Select a Writer / Author —</option>
                                {authors.filter(a => !a.isDoctor).map(author => (
                                  <option key={author.slug} value={author.slug}>{author.name}</option>
                                ))}
                              </Form.Select>
                              {formData.writer_slug && (
                                <div className="author-selected-hint">
                                  <i className="bi bi-person-check-fill text-primary me-1"></i>
                                  <small className="text-primary fw-semibold">
                                    {authors.find(a => a.slug === formData.writer_slug)?.name || formData.writer_slug}
                                  </small>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>

                        {/* Doctor Advice */}
                        <div className="doctor-advice-box">
                          <div className="doctor-advice-header">
                            <i className="bi bi-quote fs-4" style={{ color: '#6366f1', opacity: 0.5 }}></i>
                            <div>
                              <div className="fw-bold" style={{ color: '#1e293b', fontSize: '0.88rem' }}>Doctor's Expert Advice / Clinical Recommendation</div>
                              <small className="text-muted">This quote will be shown on the product page as a clinical endorsement</small>
                            </div>
                          </div>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="doctor_advice"
                            value={formData.doctor_advice}
                            onChange={handleInputChange}
                            placeholder="Write the clinical advice or recommendation citation from the assigned doctor..."
                            className="doctor-advice-textarea"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </Tab>

              </Tabs>
            </Container>
          </div>
        </Form>
      </Modal>

    </AdminLayout>
  );
}

export default AdminProducts;
