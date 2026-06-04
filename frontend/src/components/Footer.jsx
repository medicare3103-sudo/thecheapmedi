import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row className="gy-4">
          {/* Column 1: Contact Info */}
          <Col lg={3} md={6} xs={12} className="footer-col-help mb-3 mb-lg-0 text-center text-lg-start">
            <h5 className="footer-header mb-4">Contact Info</h5>
            <ul className="list-unstyled text-light opacity-75">
              <li className="mb-3">
                <strong>Address:</strong><br />
                123 Health Avenue, Medical District,<br />
                New York, NY 10001
              </li>
              <li className="mb-3">
                <strong>Email:</strong><br />
                <a href="mailto:support@medicareshop.com" className="text-light opacity-75 text-decoration-none hover-white">
                  support@medicareshop.com
                </a>
              </li>
              <li className="mb-3">
                <strong>Phone:</strong><br />
                <a href="tel:+18001234567" className="text-light opacity-75 text-decoration-none hover-white">
                  +1 (800) 123-4567
                </a>
              </li>
            </ul>
          </Col>
          
          {/* Column 2: Quick Links */}
          <Col lg={2} md={6} xs={6} className="footer-col-info mb-3 mb-lg-0 text-center text-lg-start">
            <h5 className="footer-header mb-4">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/about">About Us</Link></li>
              <li className="mb-2"><Link to="/blogs">Health Blog</Link></li>
              <li className="mb-2"><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>
          
          {/* Column 3: Customer Service */}
          <Col lg={3} md={6} xs={6} className="footer-col-policy mb-3 mb-lg-0 text-center text-lg-start">
            <h5 className="footer-header mb-4">Customer Service</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2"><Link to="/faq">FAQ</Link></li>
              <li className="mb-2"><Link to="/shipping">Shipping Policy</Link></li>
              <li className="mb-2"><Link to="/secure-shopping">Secure Shopping</Link></li>
              <li className="mb-2"><Link to="/secure-packaging">Secure Packaging</Link></li>
              <li className="mb-2"><Link to="/privacy">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </Col>
          
          {/* Column 4: Join Our Newsletter Now */}
          <Col lg={4} md={6} xs={12} className="footer-col-newsletter text-center text-lg-start">
            <h5 className="footer-header mb-4">Join Our Newsletter Now</h5>
            <p className="opacity-75 mb-4 px-3 px-lg-0">
              Get E-mail updates about our latest shop and special offers.
            </p>
            <Form className="d-flex justify-content-center justify-content-lg-start mt-2 px-3 px-lg-0">
              <InputGroup style={{ maxWidth: '400px' }} className="newsletter-input-group shadow-sm">
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white border py-2 text-dark" 
                  required 
                  style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
                />
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="px-4 fw-bold text-uppercase" 
                  style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                >
                  Subscribe
                </Button>
              </InputGroup>
            </Form>
            
            {/* Social Icons */}
            <div className="d-flex justify-content-center justify-content-lg-start gap-2 mt-4 px-3 px-lg-0">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn facebook" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" aria-label="X (formerly Twitter)">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn pinterest" aria-label="Pinterest">
                <i className="bi bi-pinterest"></i>
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="mt-5 mb-4 border-light opacity-10" />
        
        <Row>
          <Col md={6} className="text-center text-md-start opacity-75 small">
            &copy; {new Date().getFullYear()} Medicare Shop. All rights reserved.
          </Col>
          <Col md={6} className="text-center text-md-end mt-3 mt-md-0 opacity-75 small">
            Secured by SSL | We Accept Major Credit Cards
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
