import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Button, Badge, Modal, Form, Spinner, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct, getAuthors } from '../api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeTab, setActiveTab] = useState('vital');
  
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
    writer_slug: ''
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

  useEffect(() => {
    fetchProducts();
    fetchAuthors();
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
        writer_slug: product.writer_slug || ''
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
        writer_slug: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        stock: parseInt(formData.stock)
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
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?\nThis action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  // Helper to check if required fields are filled to enable the save button
  const isFormValid = () => {
    return formData.name && formData.price !== '' && formData.stock !== '';
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
            <Nav.Link as={Link} to="/admin/products" className="text-white bg-white bg-opacity-10 rounded px-3 py-2">
              <i className="bi bi-tags me-2"></i> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/categories" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-grid me-2"></i> Categories
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/authors" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-person-badge me-2"></i> Authors & Reviewers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-people me-2"></i> Customers
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
            <h4 className="mb-0 fw-bold">Manage Inventory</h4>
            <div className="d-flex align-items-center gap-3">
              <Button variant="primary" size="sm" onClick={() => handleShowModal('add')} className="fw-bold shadow-sm px-3">
                <i className="bi bi-plus-lg me-2"></i>Add a Product
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
                          <td colSpan="5" className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      ) : products.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            No products found. Add a product to get started!
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id}>
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
                                  <div className="small text-muted">{product.brand || 'No Brand'}</div>
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
          </div>
        </Col>
      </Row>

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
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Brand Name</Form.Label>
                        <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Tylenol" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
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
                          <option value="Pain Relief">Pain Relief</option>
                          <option value="Vitamins">Vitamins</option>
                          <option value="First Aid">First Aid</option>
                          <option value="Cold & Flu">Cold & Flu</option>
                          <option value="Antibiotics">Antibiotics</option>
                          <option value="Diabetes">Diabetes</option>
                          <option value="Asthma">Asthma</option>
                          <option value="Blood Pressure">Blood Pressure</option>
                          <option value="Men's Health">Men's Health</option>
                          <option value="Women's Health">Women's Health</option>
                          <option value="Eye Care">Eye Care</option>
                          <option value="Skin Care">Skin Care</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Active Ingredient</Form.Label>
                        <Form.Control type="text" name="active_ingredient" value={formData.active_ingredient} onChange={handleInputChange} placeholder="e.g. Metformin HCl" className="bg-light border-0 py-2" />
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
                <Tab eventKey="description" title={<span className="fw-bold px-2 py-1"><i className="bi bi-card-text me-2"></i>Description & Medical</span>}>
                  <Row className="g-4 max-w-800">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Product Description</Form.Label>
                        <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleInputChange} placeholder="General overview of the product..." className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Indications & Uses</Form.Label>
                        <Form.Control as="textarea" rows={3} name="uses" value={formData.uses} onChange={handleInputChange} placeholder="What is this medication used for?" className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Dosage & Administration</Form.Label>
                        <Form.Control as="textarea" rows={3} name="dosage" value={formData.dosage} onChange={handleInputChange} placeholder="Recommended dosage and how to take..." className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Side Effects</Form.Label>
                        <Form.Control as="textarea" rows={3} name="side_effects" value={formData.side_effects} onChange={handleInputChange} placeholder="Common side effects to watch out for..." className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <hr className="my-4" />
                      <h5 className="fw-bold mb-3"><i className="bi bi-person-fill-check me-2 text-success"></i>Authors & Reviewers</h5>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Medical Reviewer (Doctor)</Form.Label>
                        <Form.Select name="reviewer_slug" value={formData.reviewer_slug || ''} onChange={handleInputChange} className="bg-light border-0 py-2">
                          <option value="">Select a medical reviewer...</option>
                          {authors.filter(a => a.isDoctor).map(author => (
                            <option key={author.slug} value={author.slug}>{author.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Editorial Author (Writer)</Form.Label>
                        <Form.Select name="writer_slug" value={formData.writer_slug || ''} onChange={handleInputChange} className="bg-light border-0 py-2">
                          <option value="">Select a writer...</option>
                          {authors.filter(a => !a.isDoctor).map(author => (
                            <option key={author.slug} value={author.slug}>{author.name}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-bold">Doctor's Expert Advice / Clinical Recommendation</Form.Label>
                        <Form.Control as="textarea" rows={3} name="doctor_advice" value={formData.doctor_advice} onChange={handleInputChange} placeholder="Write the clinical advice recommendation citation..." className="bg-light border-0 py-2" />
                      </Form.Group>
                    </Col>
                  </Row>
                </Tab>

              </Tabs>
            </Container>
          </div>
        </Form>
      </Modal>

    </Container>
  );
}

export default AdminProducts;
