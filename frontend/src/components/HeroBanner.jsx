import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HeroBanner() {
  return (
    <div className="hero-banner py-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="pe-lg-5">
            <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '0.85rem' }}>
              ✨ 100% Genuine Medicines
            </span>
            <h1 className="display-4 fw-extrabold mb-4" style={{ color: 'var(--secondary-color)', lineHeight: '1.2' }}>
              Your Trusted Online <br/>
              <span className="text-primary text-gradient">Medical Pharmacy</span>
            </h1>
            <p className="fs-5 text-muted mb-4">
              Get your prescription medicines delivered directly to your doorstep. 
              Safe, fast, and affordable healthcare solutions for you and your family.
            </p>
            <div className="d-flex gap-3">
              <Button as={Link} to="/products" variant="primary" size="lg" className="fw-bold px-4 py-3 rounded-pill shadow-sm">
                Shop Now
              </Button>
            </div>
            
            <div className="mt-5 d-flex gap-5 text-muted border-top pt-4" style={{ maxWidth: '400px' }}>
              <div>
                <span className="fw-bold text-dark fs-3 d-block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>1M+</span>
                <span className="small">Happy Customers</span>
              </div>
              <div className="border-start ps-5">
                <span className="fw-bold text-dark fs-3 d-block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>50k+</span>
                <span className="small">Products Available</span>
              </div>
            </div>
          </Col>
          <Col lg={6} className="d-none d-lg-block text-center">
            <div className="position-relative d-inline-block">
              {/* Soft decorative ambient glow blob */}
              <div className="position-absolute translate-middle bg-primary bg-opacity-20 rounded-circle filter-blur" style={{ width: '400px', height: '400px', top: '50%', left: '50%', filter: 'blur(80px)', zIndex: -1 }}></div>
              
              <img 
                src="/hero_banner.png" 
                alt="Medicare Shop Pharmacy" 
                className="img-fluid rounded-4 shadow-lg border"
                style={{
                  maxHeight: '420px', 
                  width: '100%', 
                  objectFit: 'cover',
                  borderColor: 'rgba(2, 132, 199, 0.15)',
                  boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.3)'
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroBanner;
