import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/products/`);
        setProducts(response.data.items || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <HeroBanner />

      <Container className="my-5">
        

        {/* Shop By Category Placeholder */}
        <div className="py-5 text-center">
          <h3 className="section-title">Shop By Category</h3>
          <Row className="mt-4 justify-content-center">
            {[
              { name: 'Vitamins', img: '/categories/vitamins.png' },
              { name: 'Skincare', img: '/categories/skincare.png' },
              { name: 'Ayurvedic', img: '/categories/ayurvedic.png' },
              { name: 'Pain Relief', img: '/categories/pain_relief.png' },
              { name: 'Diabetes', img: '/categories/diabetes.png' }
            ].map(cat => (
              <Col xs={4} md={2} key={cat.name} className="mb-3">
                <div className="p-3 border rounded shadow-sm bg-white" style={{cursor: 'pointer'}}>
                  <div className="mb-3 d-flex justify-content-center">
                    <img src={cat.img} alt={cat.name} style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                  </div>
                  <div className="fw-500">{cat.name}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Dynamic Product Sections */}
        <ProductSection 
          title="Featured Products" 
          products={(products || []).slice(0, 4)} 
          isLoading={isLoading} 
        />
        
        <ProductSection 
          title="Trending Products" 
          products={(products || []).slice(4, 12)} 
          isLoading={isLoading} 
        />
        
        <ProductSection 
          title="Best Selling Products" 
          products={(products || []).slice(12, 16)} 
          isLoading={isLoading} 
        />
        
        {/* Fake Reviews Section */}
        <div className="py-5 text-center mt-5 bg-white shadow-sm border rounded-4">
          <h2 className="fw-bold text-dark mb-2">Reviews</h2>
          <div className="d-flex justify-content-center align-items-center mb-5 gap-2">
            <span className="fw-bold text-primary">Excellent</span>
            <div className="text-warning">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
            </div>
            <span><strong>4.63</strong> based on <strong>925</strong> reviews</span>
          </div>
          
          <div className="marquee-container py-2">
            <div className="marquee-content gap-4 px-3">
            {[
              { name: 'Anonymous', text: 'Received product as requested on time.', days: 5 },
              { name: 'Lee Treadway', text: 'Very fast service and awesome products. They are the best.', days: 5 },
              { name: 'Anonymous', text: 'It for a very good price I would recommend to anyone', days: 6 },
              { name: 'Sarah M.', text: 'Excellent service, definitely recommend this company to others.', days: 6 },
              { name: 'John Doe', text: 'Great quality and fast delivery. 10/10.', days: 2 },
              { name: 'Emily R.', text: 'Best pharmacy experience I have had online.', days: 1 },
              { name: 'Anonymous', text: 'Customer service was very helpful with my prescription.', days: 3 },
              // Duplicate the array for a seamless infinite scroll loop
              { name: 'Anonymous', text: 'Received product as requested on time.', days: 5 },
              { name: 'Lee Treadway', text: 'Very fast service and awesome products. They are the best.', days: 5 },
              { name: 'Anonymous', text: 'It for a very good price I would recommend to anyone', days: 6 },
              { name: 'Sarah M.', text: 'Excellent service, definitely recommend this company to others.', days: 6 },
              { name: 'John Doe', text: 'Great quality and fast delivery. 10/10.', days: 2 },
              { name: 'Emily R.', text: 'Best pharmacy experience I have had online.', days: 1 },
              { name: 'Anonymous', text: 'Customer service was very helpful with my prescription.', days: 3 }
            ].map((review, idx) => (
              <div key={idx} style={{ width: '300px', flexShrink: 0, whiteSpace: 'normal' }} className="text-start">
                <div className="bg-primary bg-opacity-10 rounded-4 p-4 h-100 position-relative shadow-sm border-0 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small">{review.name}</span>
                    <div className="text-warning" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <div className="text-primary small fw-500 mb-3" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-patch-check-fill me-1"></i>
                    Verified Customer
                  </div>
                  <p className="text-dark fw-500 mb-4">{review.text}</p>
                  <div className="mt-auto text-end small text-muted w-100" style={{ fontSize: '0.8rem' }}>
                    {review.days} days ago
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
        
        {/* Why Choose Us Placeholder */}
        <div className="py-5 my-5 bg-primary text-white rounded-4 p-5 text-center shadow">
          <h2 className="fw-bold mb-4">Why Choose Medicare Shop?</h2>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="fs-1 mb-3">🚚</div>
              <h4>Free Shipping</h4>
              <p className="opacity-75">On all orders over $50</p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="fs-1 mb-3">🛡️</div>
              <h4>100% Secure</h4>
              <p className="opacity-75">Your data is safe with us</p>
            </Col>
            <Col md={4}>
              <div className="fs-1 mb-3">💬</div>
              <h4>24/7 Support</h4>
              <p className="opacity-75">Our pharmacists are here to help</p>
            </Col>
          </Row>
        </div>

        {/* Newsletter Subscription */}
        <div className="py-5 text-center border rounded-4 bg-white shadow-sm mb-5">
          <Row className="justify-content-center">
            <Col md={6}>
              <h3 className="fw-bold">Subscribe to Our Newsletter</h3>
              <p className="text-muted mb-4">Get the latest updates on medical news and exclusive discounts.</p>
              <Form className="d-flex">
                <Form.Control type="email" placeholder="Enter your email address" className="me-2" />
                <Button variant="primary" className="px-4">Subscribe</Button>
              </Form>
            </Col>
          </Row>
        </div>

      </Container>
      
      <Footer />
    </>
  );
}

export default Home;
