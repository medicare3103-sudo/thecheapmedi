import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Image, Card, Button, Spinner } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSEOParams = () => {
    if (!blog) return {};
    
    const stripped = blog.excerpt || (blog.content ? blog.content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '');
    const metaDesc = stripped.length > 160 ? stripped.substring(0, 157) + '...' : stripped;
    
    return {
      title: `${blog.title} | The Cheap Pharma`,
      description: metaDesc,
      keywords: blog.category
    };
  };

  useSEO(getSEOParams());

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Container className="py-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
            <Spinner animation="border" variant="primary" className="mx-auto" />
        </Container>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Container className="py-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
            <p>Blog post not found.</p>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-4 flex-grow-1">
        
        {/* Back Button */}
        <div className="mb-4">
            <Button variant="link" className="text-decoration-none text-muted p-0" onClick={() => navigate('/blogs')}>
                <i className="bi bi-arrow-left me-2"></i>Back to Articles
            </Button>
        </div>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            
            {/* Article Header */}
            <div className="text-center mb-5">
              <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill fs-6">
                {blog.category}
              </Badge>
              <h1 className="fw-bold display-5 mb-4 text-dark">{blog.title}</h1>
              
              <div className="d-flex justify-content-center align-items-center text-muted">
                <div className="d-flex align-items-center me-4">
                    <i className="bi bi-person-circle fs-4 me-2 text-primary"></i>
                    <span className="fw-500">{blog.author}</span>
                </div>
                <div className="d-flex align-items-center">
                    <i className="bi bi-calendar-event fs-5 me-2"></i>
                    <span>{blog.date}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.image && (
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                  <Image 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-100 object-fit-cover" 
                      style={{ maxHeight: '500px' }}
                  />
              </Card>
            )}

            {/* Article Content */}
            <div 
                className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light article-content"
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Author / Share Box */}
            <Card className="border-0 bg-white shadow-sm rounded-4 mt-5 p-4">
                <Row className="align-items-center">
                    <Col md={8} className="mb-3 mb-md-0">
                        <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                                {blog.author.charAt(0)}
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">{blog.author}</h5>
                                <p className="text-muted mb-0 small">Medical Writer & Health Enthusiast</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="text-md-end">
                        <div className="d-flex gap-2 justify-content-md-end">
                            <Button variant="outline-primary" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}><i className="bi bi-facebook"></i></Button>
                            <Button variant="outline-info" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}><i className="bi bi-twitter"></i></Button>
                            <Button variant="outline-success" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}><i className="bi bi-whatsapp"></i></Button>
                        </div>
                    </Col>
                </Row>
            </Card>

          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default BlogDetail;
