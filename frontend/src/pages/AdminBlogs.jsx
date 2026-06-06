import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getBlogs, createBlog, updateBlog, deleteBlog, getAuthors } from '../api';

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Form State
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wellness',
    excerpt: '',
    content: '',
    image: '',
    author: 'Dr. Sarah Jenkins',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
      const res = await axios.get(`${API_URL}/blogs/`);
      setBlogs(res.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data || []);
      if (data && data.length > 0 && !formData.author) {
        setFormData(prev => ({ ...prev, author: data[0].name }));
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchAuthors();
  }, []);

  const handleShowModal = (mode, blog = null) => {
    setModalMode(mode);
    if (mode === 'edit' && blog) {
      setCurrentBlogId(blog.id);
      setFormData({
        title: blog.title || '',
        category: blog.category || 'Wellness',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        image: blog.image || '',
        author: blog.author || 'Dr. Sarah Jenkins',
        date: blog.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      });
    } else {
      setCurrentBlogId(null);
      setFormData({
        title: '',
        category: 'Wellness',
        excerpt: '',
        content: '',
        image: '',
        author: 'Dr. Sarah Jenkins',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await createBlog(formData);
      } else if (modalMode === 'edit') {
        await updateBlog(currentBlogId, formData);
      }
      
      handleCloseModal();
      fetchBlogs(); // Refresh list
    } catch (error) {
      console.error('Error saving blog article:', error);
      alert('Failed to save blog article. Check console for details.');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete article "${title}"?\nThis action cannot be undone.`)) {
      try {
        await deleteBlog(id);
        fetchBlogs(); // Refresh list
      } catch (error) {
        console.error('Error deleting blog article:', error);
        alert('Failed to delete blog article.');
      }
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Wellness': return 'category-badge-wellness';
      case 'Diabetes': return 'category-badge-diabetes';
      case 'Heart Health': return 'category-badge-heart-health';
      case 'Nutrition': return 'category-badge-nutrition';
      case 'Fitness': return 'category-badge-fitness';
      default: return 'category-badge-general';
    }
  };

  return (
    <Container fluid className="p-0 overflow-hidden">
      <style>{`
        .admin-blog-th {
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .blog-row {
          transition: all 0.2s ease-in-out;
        }
        .blog-row:hover {
          background-color: rgba(13, 110, 253, 0.04) !important;
          transform: translateY(-1px);
        }
        .blog-img-container {
          overflow: hidden;
          border-radius: 8px;
          width: 70px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          border: 1px solid #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .blog-img-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .blog-row:hover .blog-img-thumb {
          transform: scale(1.08);
        }
        .blog-action-btn {
          border-radius: 8px;
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: all 0.2s ease;
          border: 1px solid #dee2e6;
        }
        .blog-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .btn-add-blog {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2);
          transition: all 0.2s ease;
        }
        .btn-add-blog:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
          background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
        }
        .category-badge-wellness { background-color: #d1e7dd; color: #0f5132; }
        .category-badge-diabetes { background-color: #f8d7da; color: #842029; }
        .category-badge-heart-health { background-color: #fff3cd; color: #664d03; }
        .category-badge-nutrition { background-color: #cff4fc; color: #087990; }
        .category-badge-fitness { background-color: #cfe2ff; color: #084298; }
        .category-badge-general { background-color: #e2e3e5; color: #41464b; }
      `}</style>
      <Row className="g-0">
        
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-0 d-flex flex-column">
          <div className="p-4 bg-primary text-white text-center fw-bold fs-4">
            The Cheap Pharma Admin
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
            <Nav.Link as={Link} to="/admin/authors" className="text-white-50 px-3 py-2 custom-nav-link">
              <i className="bi bi-person-badge me-2"></i> Authors & Reviewers
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/blogs" className="text-white bg-white bg-opacity-10 rounded px-3 py-2">
              <i className="bi bi-journal-text me-2"></i> Blogs
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
            <h4 className="mb-0 fw-bold">Blog Management</h4>
            <div className="d-flex align-items-center gap-3">
              <Button size="sm" onClick={() => handleShowModal('add')} className="btn-add-blog fw-bold px-3 py-2">
                <i className="bi bi-plus-lg me-2"></i>Add New Blog
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
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide admin-blog-th">Image</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide admin-blog-th">Title / Category</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide admin-blog-th">Author</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide admin-blog-th">Publish Date</th>
                        <th className="border-0 px-4 py-3 text-muted small text-uppercase tracking-wide text-end admin-blog-th">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      ) : blogs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            No blog articles found. Add one to get started!
                          </td>
                        </tr>
                      ) : (
                        blogs.map((blog) => (
                          <tr key={blog.id} className="blog-row">
                            <td className="px-4 py-3">
                              <div className="blog-img-container">
                                {blog.image ? (
                                  <img src={blog.image} alt={blog.title} className="blog-img-thumb" />
                                ) : (
                                  <i className="bi bi-image text-muted" style={{ fontSize: '1.2rem' }}></i>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="fw-bold text-dark mb-1">{blog.title}</div>
                              <span className={`badge ${getCategoryBadgeClass(blog.category)} border-0 px-2.5 py-1 rounded-pill`}>
                                {blog.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-secondary fw-500">{blog.author}</td>
                            <td className="px-4 py-3 text-muted small">{blog.date}</td>
                            <td className="px-4 py-3 text-end">
                              <Button variant="light" size="sm" className="me-2 text-primary shadow-sm blog-action-btn" onClick={() => handleShowModal('edit', blog)}>
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button variant="light" size="sm" className="text-danger shadow-sm blog-action-btn" onClick={() => handleDelete(blog.id, blog.title)}>
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
            {modalMode === 'add' ? 'Upload Blog Post' : 'Edit Blog Post'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pt-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <Row className="g-3">
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Article Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. 5 Benefits of Daily Hydration" />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="Wellness">Wellness</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Heart Health">Heart Health</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Fitness">Fitness</option>
                    <option value="General">General</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Display Author <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="author" value={formData.author} onChange={handleInputChange} required>
                    {authors.length === 0 ? (
                      <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins</option>
                    ) : (
                      authors.map(auth => (
                        <option key={auth.slug} value={auth.name}>
                          {auth.name} ({auth.role})
                        </option>
                      ))
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Publish Date <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="date" value={formData.date} onChange={handleInputChange} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Featured Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                </Form.Group>
              </Col>

              <Col md={12}>
                {formData.image && (
                  <div className="mt-2 text-center">
                    <span className="small text-muted d-block mb-1">Featured Image Preview:</span>
                    <img src={formData.image} alt="Preview" className="rounded border object-fit-cover shadow-sm" style={{ maxHeight: '180px', maxWidth: '300px' }} />
                  </div>
                )}
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Article Excerpt (Short description) <span className="text-danger">*</span></Form.Label>
                  <Form.Control as="textarea" rows={2} name="excerpt" value={formData.excerpt} onChange={handleInputChange} required placeholder="Short 1-2 sentence description of the article..." />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Article Body (Supports HTML tags) <span className="text-danger">*</span></Form.Label>
                  <Form.Control as="textarea" rows={8} name="content" value={formData.content} onChange={handleInputChange} required placeholder="<p>Write your detailed article body here...</p>" />
                  <Form.Text className="text-muted">Use standard tags like &lt;p&gt;, &lt;h4&gt;, and &lt;ul&gt; for formatting.</Form.Text>
                </Form.Group>
              </Col>

            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button variant="light" onClick={handleCloseModal} className="px-4 fw-bold">Cancel</Button>
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              {modalMode === 'add' ? 'Upload Post' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
}

export default AdminBlogs;
