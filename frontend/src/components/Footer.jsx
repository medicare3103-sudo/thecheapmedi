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
                <a href="mailto:info@thecheappharma.com" className="text-light opacity-75 text-decoration-none hover-white">
                  info@thecheappharma.com
                </a>
              </li>
              <li className="mb-3">
                <strong>Phone:</strong><br />
                <a href="tel:+18888667566" className="text-light opacity-75 text-decoration-none hover-white">
                  +1 (888) 866-7566
                </a>
              </li>
            </ul>
          </Col>
          
          {/* Column 2: Information & Support */}
          <Col lg={3} md={6} xs={6} className="footer-col-info mb-3 mb-lg-0 text-center text-lg-start">
            <h5 className="footer-header mb-4">Support & Info</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/about">About Us</Link></li>
              <li className="mb-2"><Link to="/faq">FAQs</Link></li>
              <li className="mb-2"><Link to="/contact">Contact Us</Link></li>
              <li className="mb-2"><Link to="/blogs">Health Blog</Link></li>
              <li className="mb-2"><Link to="/sitemap">Sitemap</Link></li>
              <li className="mb-2"><Link to="/info/is-cheap-medicine-shop-legit">Is Shop Legit?</Link></li>
              <li className="mb-2"><Link to="/info/protect-yourself">Protect Yourself</Link></li>
              <li className="mb-2"><Link to="/info/indian-pharmacies">Indian Pharmacies</Link></li>
              <li className="mb-2"><Link to="/info/tips">Medication Tips</Link></li>
              <li className="mb-2"><Link to="/info/prescription-related-query">Prescription Queries</Link></li>
              <li className="mb-2"><Link to="/info/query-related-to-shipment">Shipment Queries</Link></li>
              <li className="mb-2"><Link to="/info/queries-related-to-discounts-and-coupon-code">Discount Queries</Link></li>
              <li className="mb-2"><Link to="/info/order-related-query">Order Queries</Link></li>
              <li className="mb-2"><Link to="/info/payment-related-query">Payment Queries</Link></li>
            </ul>
          </Col>
          
          {/* Column 3: Policies & Rules */}
          <Col lg={3} md={6} xs={6} className="footer-col-policy mb-3 mb-lg-0 text-center text-lg-start">
            <h5 className="footer-header mb-4">Policies & Rules</h5>
            <ul className="list-unstyled footer-links">
              <li className="mb-2"><Link to="/info/privacy-and-cookie-policy">Privacy & Cookie Policy</Link></li>
              <li className="mb-2"><Link to="/info/privacy-policy">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/info/cookie-policy">Cookie Policy</Link></li>
              <li className="mb-2"><Link to="/info/terms-and-conditions">Terms & Conditions</Link></li>
              <li className="mb-2"><Link to="/info/refund-and-cancellation-policy">Refund & Cancellation</Link></li>
              <li className="mb-2"><Link to="/info/shipping-and-dispatch-policy">Shipping & Dispatch</Link></li>
              <li className="mb-2"><Link to="/info/us-shipping-and-import-duty">US Shipping & Duties</Link></li>
              <li className="mb-2"><Link to="/info/medicine-and-prescription-policy">Medicine Policy</Link></li>
              <li className="mb-2"><Link to="/info/anti-spam-policy">Anti-Spam Policy</Link></li>
              <li className="mb-2"><Link to="/info/best-price">Best Price Guarantee</Link></li>
              <li className="mb-2"><Link to="/info/warning">Safety Warnings</Link></li>
              <li className="mb-2"><Link to="/info/content-information-policy">Content Policy</Link></li>
              <li className="mb-2"><Link to="/info/communication-policy">Communication Policy</Link></li>
              <li className="mb-2"><Link to="/info/disclaimer">Disclaimer</Link></li>
              <li className="mb-2"><Link to="/info/low-libido">Low Libido Guide</Link></li>
              <li className="mb-2"><Link to="/info/delayed-ejaculation">Impaired Ejaculation</Link></li>
              <li className="mb-2"><Link to="/info/important-update-us-policy">Important US Update</Link></li>
            </ul>
          </Col>
          
          {/* Column 4: Join Our Newsletter Now */}
          <Col lg={3} md={6} xs={12} className="footer-col-newsletter text-center text-lg-start">
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
        
        {/* Medical Experts & Editorial Team Banner */}
        <Row className="mt-5">
          <Col xs={12}>
            <div className="medical-team-banner p-3 p-md-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 text-light">
              <div className="d-flex align-items-center gap-2">
                <span className="team-emoji">🩺</span>
                <span className="fw-bold text-white mb-0" style={{ letterSpacing: '0.02em', fontSize: '0.9rem' }}>Our Medical Experts & Editorial Team</span>
              </div>
              
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {/* Dr. Sarah Jenkins */}
                <Link to="/author/sarah-jenkins" className="team-pill py-2 px-3 d-flex align-items-center gap-2 text-decoration-none">
                  <span className="team-emoji">👨‍⚕️</span>
                  <div className="text-start" style={{ lineHeight: '1.1' }}>
                    <div className="fw-bold text-white" style={{ fontSize: '0.8rem' }}>Dr. Sarah Jenkins</div>
                    <div className="team-role">Medical Reviewer</div>
                  </div>
                </Link>

                {/* David Vance */}
                <Link to="/author/david-vance" className="team-pill py-2 px-3 d-flex align-items-center gap-2 text-decoration-none">
                  <span className="team-emoji">✍️</span>
                  <div className="text-start" style={{ lineHeight: '1.1' }}>
                    <div className="fw-bold text-white" style={{ fontSize: '0.8rem' }}>David Vance</div>
                    <div className="team-role">Medical Writer</div>
                  </div>
                </Link>

                {/* Elena Rostova */}
                <Link to="/author/elena-rostova" className="team-pill py-2 px-3 d-flex align-items-center gap-2 text-decoration-none">
                  <span className="team-emoji">✍️</span>
                  <div className="text-start" style={{ lineHeight: '1.1' }}>
                    <div className="fw-bold text-white" style={{ fontSize: '0.8rem' }}>Elena Rostova</div>
                    <div className="team-role">Medical Writer</div>
                  </div>
                </Link>

                {/* Our Editorial Policy */}
                <Link to="/editorial-policy" className="team-pill team-pill-link py-2 px-3 d-flex align-items-center gap-2 text-decoration-none">
                  <span className="team-emoji">📋</span>
                  <div className="text-start" style={{ lineHeight: '1.1' }}>
                    <div className="fw-bold text-white" style={{ fontSize: '0.8rem' }}>Our Editorial Policy</div>
                    <div className="text-primary" style={{ fontSize: '0.65rem', fontWeight: 700 }}>View Guidelines</div>
                  </div>
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* Disclaimer Text */}
        <Row className="mt-4">
          <Col xs={12} className="text-start footer-disclaimer">
            <strong className="text-light">Disclaimer:</strong><br />
            The Cheap Pharma only offers opinions and provides information. Every trademark, brand, and service mark that may be seen on this website is owned by its respective owner. We do not offer medical advice or medicine recommendations. You and your prescribing physician decide whether a medicine is appropriate for you. Please contact us at <a href="mailto:info@thecheappharma.com" className="text-light text-decoration-underline">info@thecheappharma.com</a> if you have any questions about the information on our website.
          </Col>
        </Row>
        
        <hr className="mt-4 mb-4 border-light opacity-10" />
        
        <Row>
          <Col md={6} className="text-center text-md-start opacity-75 small">
            &copy; {new Date().getFullYear()} The Cheap Pharma. All rights reserved.
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
