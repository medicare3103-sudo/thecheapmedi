import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row className="gy-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h3 className="text-white fw-bold mb-4">Medicare Shop</h3>
            <p className="text-light opacity-75 pe-md-4">
              Your trusted partner for all healthcare needs. We provide genuine medicines at affordable prices with fast and secure delivery worldwide.
            </p>
            <div className="mt-4">
              {/* Placeholder for social icons */}
              <span className="me-3 fs-4 text-light">📱</span>
              <span className="me-3 fs-4 text-light">🐦</span>
              <span className="me-3 fs-4 text-light">📸</span>
            </div>
          </Col>
          
          <Col md={2} xs={6}>
            <h5 className="text-white mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/about">About Us</Link></li>
              <li className="mb-2"><Link to="/blogs">Health Blog</Link></li>
              <li className="mb-2"><Link to="/contact">Contact Us</Link></li>
            </ul>
          </Col>
          
          <Col md={3} xs={6}>
            <h5 className="text-white mb-4">Customer Service</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/faq">FAQ</Link></li>
              <li className="mb-2"><Link to="/shipping">Shipping Policy</Link></li>
              <li className="mb-2"><Link to="/secure-shopping">Secure Shopping</Link></li>
              <li className="mb-2"><Link to="/secure-packaging">Secure Packaging</Link></li>
              <li className="mb-2"><Link to="/privacy">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-white mb-4">Contact Info</h5>
            <ul className="list-unstyled text-light opacity-75">
              <li className="mb-3">
                <strong>Address:</strong><br />
                123 Health Avenue, Medical District,<br />
                New York, NY 10001
              </li>
              <li className="mb-3">
                <strong>Email:</strong><br />
                support@medicareshop.com
              </li>
              <li>
                <strong>Phone:</strong><br />
                +1 (800) 123-4567
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="mt-5 mb-4 border-light opacity-25" />
        
        <Row>
          <Col md={6} className="text-center text-md-start text-light opacity-75">
            &copy; {new Date().getFullYear()} Medicare Shop. All rights reserved.
          </Col>
          <Col md={6} className="text-center text-md-end mt-3 mt-md-0 text-light opacity-75">
            Secured by SSL | We Accept Major Credit Cards
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
