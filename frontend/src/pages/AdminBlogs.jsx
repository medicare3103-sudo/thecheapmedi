import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';
import { getBlogs, createBlog, updateBlog, deleteBlog, getAuthors } from '../api';
import { compressImage } from '../utils/image';


function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Form State
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [editorTab, setEditorTab] = useState('write'); // 'write' or 'preview'
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
    setEditorTab('write');
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

  const insertHTMLTag = (tagType) => {
    const textarea = document.getElementById('blog-content-textarea');
    if (!textarea) {
      let tagToInsert = '';
      if (tagType === 'p') tagToInsert = '<p>\n  Paragraph text here...\n</p>\n';
      else if (tagType === 'h4') tagToInsert = '<h4>\n  Sub-heading Title\n</h4>\n';
      else if (tagType === 'ul') tagToInsert = '<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>\n';
      else if (tagType === 'strong') tagToInsert = '<strong>Bold text</strong>';
      else if (tagType === 'li') tagToInsert = '<li>List item</li>\n';
      
      setFormData(prev => ({ ...prev, content: prev.content + tagToInsert }));
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = formData.content;

    let tagToInsert = '';
    if (tagType === 'p') {
      tagToInsert = '<p>\n  Paragraph text here...\n</p>\n';
    } else if (tagType === 'h4') {
      tagToInsert = '<h4>\n  Sub-heading Title\n</h4>\n';
    } else if (tagType === 'ul') {
      tagToInsert = '<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>\n';
    } else if (tagType === 'strong') {
      tagToInsert = '<strong>Bold text</strong>';
    } else if (tagType === 'li') {
      tagToInsert = '<li>List item</li>\n';
    }

    const newText = text.substring(0, startPos) + tagToInsert + text.substring(endPos, text.length);
    setFormData(prev => ({ ...prev, content: newText }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + tagToInsert.length;
      textarea.selectionEnd = startPos + tagToInsert.length;
    }, 50);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Compress to 800x500 (16:10 landscape, ideal for blog cards) at quality 0.65
        const compressed = await compressImage(reader.result, 800, 500, 0.65);
        setFormData(prev => ({
          ...prev,
          image: compressed
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
        setSelectedIds(prev => prev.filter(sid => sid !== id));
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog article:', error);
        alert('Failed to delete blog article.');
      }
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? blogs.map(b => b.id) : []);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected article${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => deleteBlog(id)));
      setSelectedIds([]);
      fetchBlogs();
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Some items could not be deleted.');
    } finally {
      setBulkDeleting(false);
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

  const allSelected = blogs.length > 0 && selectedIds.length === blogs.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const actions = (
    <Button size="sm" onClick={() => handleShowModal('add')} className="btn-add-blog fw-bold px-3 py-2">
      <i className="bi bi-plus-lg me-2"></i>Add New Blog
    </Button>
  );

  return (
    <AdminLayout title="Blog Management" actions={actions}>
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
        .styled-blog-preview h4 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .styled-blog-preview p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 1rem;
        }
        .styled-blog-preview ul {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          list-style-type: disc;
        }
        .styled-blog-preview li {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #334155;
          margin-bottom: 0.25rem;
        }
      `}</style>
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-action-bar mb-3 d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="bulk-count-badge">{selectedIds.length}</span>
            <span className="fw-semibold text-dark">{selectedIds.length === 1 ? 'article' : 'articles'} selected</span>
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
                    <td colSpan="6" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No blog articles found. Add one to get started!
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className={`blog-row${selectedIds.includes(blog.id) ? ' bulk-row-selected' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="bulk-checkbox"
                          checked={selectedIds.includes(blog.id)}
                          onChange={() => handleToggleSelect(blog.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="blog-img-container">
                          {blog.image ? (
                            <img src={blog.image} alt={blog.title} className="blog-img-thumb" />
                          ) : (
                            <i className="bi bi-image text-muted fs-4"></i>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="fw-bold text-dark text-truncate" style={{maxWidth: '300px'}}>{blog.title}</div>
                        <span className={`badge ${getCategoryBadgeClass(blog.category)} fw-normal mt-1`}>{blog.category}</span>
                      </td>
                      <td className="px-4 py-3 text-muted small">{blog.author}</td>
                      <td className="px-4 py-3 text-muted small">{new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            {modalMode === 'add' ? 'Add New Article' : 'Edit Article'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 pt-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Article Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. 5 Tips to Control Hypertension" />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small text-muted fw-bold text-uppercase">Category</Form.Label>
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
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <Form.Label className="small text-muted fw-bold text-uppercase mb-0">Article Body (Supports HTML tags) <span className="text-danger">*</span></Form.Label>
                    <div className="d-flex gap-2">
                      <Button 
                        type="button"
                        size="sm" 
                        variant={editorTab === 'write' ? 'primary' : 'outline-primary'} 
                        className="py-1 px-3 fw-bold rounded-pill"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setEditorTab('write')}
                      >
                        <i className="bi bi-pencil-fill me-1"></i> Write
                      </Button>
                      <Button 
                        type="button"
                        size="sm" 
                        variant={editorTab === 'preview' ? 'primary' : 'outline-primary'} 
                        className="py-1 px-3 fw-bold rounded-pill"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setEditorTab('preview')}
                      >
                        <i className="bi bi-eye-fill me-1"></i> Preview
                      </Button>
                    </div>
                  </div>

                  {editorTab === 'write' ? (
                    <>
                      {/* SEO HTML Helper Toolbar */}
                      <div className="d-flex flex-wrap gap-2 mb-2 p-2 rounded bg-light border border-slate-200">
                        <Button 
                          type="button"
                          variant="outline-secondary" 
                          size="sm" 
                          className="rounded py-1 px-2 text-slate-700 hover:bg-slate-100"
                          style={{ fontSize: '0.75rem', borderColor: '#cbd5e1' }}
                          onClick={() => insertHTMLTag('h4')}
                        >
                          <i className="bi bi-type-h4 text-primary me-1"></i> Sub-heading &lt;h4&gt;
                        </Button>
                        <Button 
                          type="button"
                          variant="outline-secondary" 
                          size="sm" 
                          className="rounded py-1 px-2 text-slate-700 hover:bg-slate-100"
                          style={{ fontSize: '0.75rem', borderColor: '#cbd5e1' }}
                          onClick={() => insertHTMLTag('p')}
                        >
                          <i className="bi bi-paragraph text-success me-1"></i> Paragraph &lt;p&gt;
                        </Button>
                        <Button 
                          type="button"
                          variant="outline-secondary" 
                          size="sm" 
                          className="rounded py-1 px-2 text-slate-700 hover:bg-slate-100"
                          style={{ fontSize: '0.75rem', borderColor: '#cbd5e1' }}
                          onClick={() => insertHTMLTag('ul')}
                        >
                          <i className="bi bi-list-ul text-info me-1"></i> List Group &lt;ul&gt;
                        </Button>
                        <Button 
                          type="button"
                          variant="outline-secondary" 
                          size="sm" 
                          className="rounded py-1 px-2 text-slate-700 hover:bg-slate-100"
                          style={{ fontSize: '0.75rem', borderColor: '#cbd5e1' }}
                          onClick={() => insertHTMLTag('li')}
                        >
                          <i className="bi bi-dash text-secondary me-1"></i> List Item &lt;li&gt;
                        </Button>
                        <Button 
                          type="button"
                          variant="outline-secondary" 
                          size="sm" 
                          className="rounded py-1 px-2 text-slate-700 hover:bg-slate-100"
                          style={{ fontSize: '0.75rem', borderColor: '#cbd5e1' }}
                          onClick={() => insertHTMLTag('strong')}
                        >
                          <i className="bi bi-type-bold text-dark me-1"></i> Bold &lt;strong&gt;
                        </Button>
                      </div>

                      <Form.Control 
                        as="textarea" 
                        rows={10} 
                        name="content" 
                        id="blog-content-textarea"
                        value={formData.content} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Write your detailed article body here..." 
                        style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                      />
                      <Form.Text className="text-muted">Use the quick buttons above to insert correctly nested SEO tags at your cursor position.</Form.Text>
                    </>
                  ) : (
                    <div 
                      className="p-3 border rounded bg-white overflow-auto styled-blog-preview" 
                      style={{ 
                        minHeight: '230px', 
                        maxHeight: '350px',
                        borderColor: '#cbd5e1',
                        borderRadius: '8px'
                      }}
                      dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-muted italic">No content written yet.</p>' }}
                    />
                  )}
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
    </AdminLayout>
  );
}

export default AdminBlogs;
