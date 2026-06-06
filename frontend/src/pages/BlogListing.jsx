import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

function BlogListing() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize with categoryName if provided and valid, else 'All'
  const categories = ['All', 'Wellness', 'Diabetes', 'Heart Health', 'Nutrition', 'Fitness'];
  const [activeCategory, setActiveCategory] = useState(
    categoryName && categories.includes(categoryName) ? categoryName : 'All'
  );

  // Sync state if URL changes
  useEffect(() => {
    if (categoryName && categories.includes(categoryName)) {
      setActiveCategory(categoryName);
    } else if (!categoryName) {
      setActiveCategory('All');
    }
  }, [categoryName]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
        const res = await axios.get(`${API_URL}/blogs/`);
        setBlogs(res.data || []);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      navigate('/blogs');
    } else {
      navigate(`/blogs/category/${cat}`);
    }
  };


  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      {/* Blog Hero */}
      <div className="bg-primary text-white py-5">
        <Container className="text-center py-4">
          <h1 className="fw-bold display-5 mb-3">Medicare Shop Health Blog</h1>
          <p className="fs-5 opacity-75 mx-auto" style={{maxWidth: '600px'}}>
            Expert advice, wellness tips, and medical news to help you live your healthiest life.
          </p>
        </Container>
      </div>

      <Container className="py-5 flex-grow-1">
        <Row className="g-4">
          
          {/* Main Content: Blog Grid */}
          <Col lg={8} xl={9}>
            
            {/* Active Filters Summary */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                {activeCategory === 'All' ? 'Latest Articles' : `${activeCategory} Articles`}
              </h4>
              <span className="text-muted">{filteredBlogs.length} results</span>
            </div>

            {loading ? (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <h5 className="text-muted">Loading articles...</h5>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
                <i className="bi bi-search text-muted mb-3" style={{fontSize: '3rem'}}></i>
                <h5>No articles found</h5>
                <p className="text-muted">Try adjusting your search or category filter.</p>
                <Button variant="outline-primary" onClick={() => {setSearchTerm(''); setActiveCategory('All');}}>Clear Filters</Button>
              </div>
            ) : (
              <Row className="g-4">
                {filteredBlogs.map(blog => (
                  <Col md={6} xl={4} key={blog.id}>
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden blog-card">
                      <div className="position-relative overflow-hidden" style={{height: '200px'}}>
                        <Card.Img 
                          variant="top" 
                          src={blog.image} 
                          alt={blog.title}
                          className="h-100 w-100 object-fit-cover transition-transform"
                        />
                        <Badge bg="primary" className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill">
                          {blog.category}
                        </Badge>
                      </div>
                      <Card.Body className="d-flex flex-column p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3 small text-muted">
                          <span><i className="bi bi-calendar-event me-2"></i>{blog.date}</span>
                        </div>
                        <Card.Title className="fw-bold fs-5 mb-3">{blog.title}</Card.Title>
                        <Card.Text className="text-muted flex-grow-1" style={{fontSize: '0.95rem'}}>
                          {blog.excerpt}
                        </Card.Text>
                        <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                          <span className="small fw-500 text-dark"><i className="bi bi-person-circle text-muted me-2"></i>{blog.author}</span>
                          <Link to={`/blogs/${blog.id}`} className="text-primary text-decoration-none fw-bold small">
                            Read More <i className="bi bi-arrow-right ms-1"></i>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4} xl={3}>
            {/* Search */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Search</h5>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-end-0"><i className="bi bi-search"></i></InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    placeholder="Search articles..." 
                    className="bg-light border-start-0 ps-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Categories</h5>
                <div className="d-flex flex-column gap-2">
                  {categories.map(cat => (
                    <Button 
                      key={cat}
                      variant={activeCategory === cat ? 'primary' : 'light'}
                      className={`text-start px-3 py-2 rounded-3 ${activeCategory === cat ? 'fw-bold shadow-sm' : 'text-secondary border'}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{cat}</span>
                        {activeCategory === cat && <i className="bi bi-check-lg"></i>}
                      </div>
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Newsletter CTA */}
            <Card className="border-0 shadow-sm rounded-4 bg-primary text-white text-center p-2">
              <Card.Body>
                <i className="bi bi-envelope-paper mb-3 d-block" style={{fontSize: '2.5rem'}}></i>
                <h5 className="fw-bold">Subscribe</h5>
                <p className="small opacity-75">Get the latest health tips delivered to your inbox.</p>
                <Form.Control type="email" placeholder="Email address" className="mb-2 text-center" />
                <Button variant="light" className="w-100 fw-bold text-primary">Subscribe</Button>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default BlogListing;
