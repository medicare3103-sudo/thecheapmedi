import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Categories() {
  const [searchTerm, setSearchTerm] = useState('');

  // Category data using actual images from the reference site
  const categories = [
    { id: 1, name: 'Diabetes', img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/diabetes.png' },
    { id: 2, name: "Men's Health", img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/mens_health.png' },
    { id: 3, name: 'Eye Care', img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/eye_care.png' },
    { id: 4, name: 'Asthma', img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/asthma.png' },
    { id: 5, name: 'Skin Care', img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/beauty_skin_care.png' },
    { id: 6, name: 'Blood Pressure', img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/blood_pressure.png' },
    { id: 7, name: "Women's Health", img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/womens_health.png' },
    { id: 8, name: 'Antibiotics', img: 'https://cmedia.cheapmedicineshop.com/media/all_cat/antibiotics.png' }
  ];

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
        <Row className="g-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <Col md={4} lg={3} sm={6} xs={6} key={category.id}>
                <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="text-decoration-none">
                  <Card className="h-100 border rounded-3 text-center py-4 category-card">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                      <img 
                        src={category.img} 
                        alt={category.name} 
                        className="img-fluid mb-3"
                        style={{ maxHeight: '80px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://cmedia.cheapmedicineshop.com/media/all_cat/herbal.png'; // fallback
                        }}
                      />
                      <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>{category.name}</h5>
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
      </Container>

      <Footer />
      
      {/* Inline style for the hover effect */}
      <style>{`
        .category-card {
          transition: all 0.3s ease;
          background: #fff;
        }
        .category-card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
          border-color: #0b5cff !important;
        }
      `}</style>
    </>
  );
}

export default Categories;
