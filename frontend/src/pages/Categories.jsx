import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCategories } from '../api';

const getCategoryImage = (name) => {
  const slug = name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '');
  
  // Custom mappings for standard categories
  if (slug === 'men_s_health') return 'https://cmedia.cheapmedicineshop.com/media/all_cat/mens_health.png';
  if (slug === 'women_s_health' || slug === 'women_care') return 'https://cmedia.cheapmedicineshop.com/media/all_cat/womens_health.png';
  if (slug === 'beauty_and_skin_care' || slug === 'skin_care') return 'https://cmedia.cheapmedicineshop.com/media/all_cat/beauty_skin_care.png';
  if (slug === 'hiv_and_herpes') return 'https://cmedia.cheapmedicineshop.com/media/all_cat/hiv_herpes.png';
  
  return `https://cmedia.cheapmedicineshop.com/media/all_cat/${slug}.png`;
};

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
                    <Card className="h-100 border rounded-4 text-center py-5 category-card shadow-sm">
                      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                        <img 
                          src={getCategoryImage(category.name)} 
                          alt={category.name} 
                          className="img-fluid mb-3 category-img"
                          style={{ height: '130px', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://cmedia.cheapmedicineshop.com/media/all_cat/herbal.png'; // fallback
                          }}
                        />
                        <h5 className="fw-bold mb-0 text-dark mt-2" style={{ fontSize: '1.25rem' }}>{category.name}</h5>
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
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          background: #fff;
          border-color: #e5e7eb !important;
        }
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.08) !important;
          border-color: #0b5cff !important;
        }
        .category-card:hover .category-img {
          transform: scale(1.08);
        }
      `}</style>
    </>
  );
}

export default Categories;
