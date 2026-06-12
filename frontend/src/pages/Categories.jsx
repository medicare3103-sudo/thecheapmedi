import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCategories } from '../api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  // Filter based on search
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-light py-5 text-center mb-5 border-bottom">
        <Container>
          <h1 className="fw-bold text-dark mb-3">All Categories</h1>
          
          {/* Internal Category Search */}
          <Row className="justify-content-center mt-4">
            <Col md={6}>
              <InputGroup size="lg" className="shadow-sm">
                <InputGroup.Text className="bg-white border-0">🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Search categories..."
                  className="border-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: 'none' }}
                />
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <h5 className="text-muted">Loading categories...</h5>
          </div>
        ) : (
          <Row className="g-4">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(category => (
                <Col md={4} lg={3} sm={6} xs={6} key={category.id}>
                  <Link to={`/category/${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="text-decoration-none">
                    <Card className="h-100 border rounded-4 text-center py-4 category-card shadow-sm">
                      <Card.Body className="d-flex align-items-center justify-content-center p-3">
                        <h5 className="fw-bold mb-0 text-dark transition-colors" style={{ fontSize: '1.1rem' }}>{category.name}</h5>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <h4 className="text-muted">No categories found matching "{searchTerm}"</h4>
              </Col>
            )}
          </Row>
        )}
      </Container>

      <Footer />
      
      {/* Inline style for the hover effect */}
      <style>{`
        .category-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: #fff;
          border-color: #e2e8f0 !important;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
          border-color: var(--primary-color, #0b5cff) !important;
        }
        .category-card:hover h5 {
          color: var(--primary-color, #0b5cff) !important;
        }
        .transition-colors {
          transition: color 0.25s ease;
        }
      `}</style>
    </>
  );
}

export default Categories;
