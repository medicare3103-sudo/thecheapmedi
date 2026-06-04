import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AboutUs() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">About Medicare Shop</h1>
          <p className="lead opacity-75">Your trusted partner in healthcare since 2010.</p>
        </Container>
      </div>

      <Container className="py-5">
        
        {/* Company Information */}
        <section className="mb-5">
          <h2 className="section-title">Who We Are</h2>
          <Row>
            <Col md={8}>
              <p className="fs-5 text-muted">
                Medicare Shop is a leading online pharmacy dedicated to providing safe, reliable, and affordable healthcare solutions to customers worldwide. We understand the importance of accessible medicine, which is why we have built a robust supply chain to deliver genuine pharmaceutical products right to your doorstep.
              </p>
              <p className="text-muted">
                Founded by a team of healthcare professionals and technologists, we operate under strict regulatory guidelines to ensure every product we sell meets international safety standards. With over 1 million happy customers, we are revolutionizing the way you manage your health.
              </p>
            </Col>
            <Col md={4} className="text-center d-none d-md-block">
              <div style={{width: '100%', height: '200px', backgroundColor: '#e2e8f0', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b'}}>
                Company HQ Image Placeholder
              </div>
            </Col>
          </Row>
        </section>

        {/* Mission & Vision */}
        <section className="mb-5">
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm rounded-4 bg-light">
                <Card.Body className="p-4">
                  <div className="fs-1 mb-3">🎯</div>
                  <h3 className="fw-bold text-primary mb-3">Our Mission</h3>
                  <p className="text-muted mb-0">
                    To make high-quality healthcare accessible and affordable for everyone, regardless of where they live. We strive to simplify the pharmacy experience through technology, transparency, and unparalleled customer care.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm rounded-4 bg-light">
                <Card.Body className="p-4">
                  <div className="fs-1 mb-3">👁️</div>
                  <h3 className="fw-bold text-primary mb-3">Our Vision</h3>
                  <p className="text-muted mb-0">
                    To be the world's most trusted and reliable digital healthcare platform, empowering individuals to take control of their well-being with confidence and ease.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Certifications */}
        <section className="mb-5 text-center">
          <h2 className="section-title">Our Certifications</h2>
          <p className="text-muted mb-4">We are fully licensed and certified by top international health organizations.</p>
          <Row className="justify-content-center g-4">
            {['FDA Approved', 'CIPA Certified', 'Verified Pharmacy', 'SSL Secured'].map((cert, index) => (
              <Col xs={6} md={3} key={index}>
                <div className="p-4 border rounded shadow-sm bg-white h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="fs-2 mb-2 text-success">✅</div>
                  <div className="fw-bold">{cert}</div>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* Why Choose Us */}
        <section className="py-5 my-5 bg-primary text-white rounded-4 p-5 text-center shadow">
          <h2 className="fw-bold mb-4">Why Choose Medicare Shop?</h2>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="fs-1 mb-3">🚚</div>
              <h4>Fast & Discreeet Shipping</h4>
              <p className="opacity-75">Your privacy is our priority. All packages are shipped discreetly.</p>
            </Col>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="fs-1 mb-3">🛡️</div>
              <h4>100% Genuine Products</h4>
              <p className="opacity-75">Sourced directly from verified manufacturers and distributors.</p>
            </Col>
            <Col md={4}>
              <div className="fs-1 mb-3">💬</div>
              <h4>24/7 Expert Support</h4>
              <p className="opacity-75">Licensed pharmacists available round the clock to assist you.</p>
            </Col>
          </Row>
        </section>

      </Container>
      
      <Footer />
    </>
  );
}

export default AboutUs;
