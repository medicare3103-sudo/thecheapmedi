import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function SecureShopping() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Secure Shopping Guarantee</h1>
          <p className="lead opacity-75">Your privacy and security are our top priorities.</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        
        {/* Trust Badges Section */}
        <Row className="mb-5 text-center g-4 justify-content-center">
          <Col md={3} xs={6}>
            <Card className="h-100 border-0 shadow-sm py-4">
              <div className="fs-1 text-success mb-2">🔒</div>
              <h5 className="fw-bold">256-Bit SSL</h5>
              <p className="text-muted small mb-0">Bank-level encryption</p>
            </Card>
          </Col>
          <Col md={3} xs={6}>
            <Card className="h-100 border-0 shadow-sm py-4">
              <div className="fs-1 text-success mb-2">💳</div>
              <h5 className="fw-bold">PCI Compliant</h5>
              <p className="text-muted small mb-0">Secure payment gateway</p>
            </Card>
          </Col>
          <Col md={3} xs={6}>
            <Card className="h-100 border-0 shadow-sm py-4">
              <div className="fs-1 text-success mb-2">🛡️</div>
              <h5 className="fw-bold">Data Privacy</h5>
              <p className="text-muted small mb-0">Strict no-sell policy</p>
            </Card>
          </Col>
        </Row>

        {/* Detailed Information */}
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4">
          <Card.Body className="text-muted lh-lg">
            
            <h3 className="text-dark fw-bold mb-3">1. SSL Information (Secure Socket Layer)</h3>
            <p className="mb-4">
              When you shop with Medicare Shop, you can be assured that your data is safe. We use standard 256-bit SSL (Secure Socket Layer) encryption technology to protect your personal and financial information. This is the same level of encryption used by major banks and financial institutions worldwide. 
              <br/><br/>
              You can verify this by looking for the padlock icon (🔒) in your browser's address bar and ensuring our website address begins with "https://" rather than "http://".
            </p>

            <h3 className="text-dark fw-bold mb-3">2. Security Practices</h3>
            <p className="mb-3">
              We employ a multi-layered approach to security to ensure a safe shopping environment:
            </p>
            <ul className="mb-4">
              <li className="mb-2"><strong>Payment Security (PCI-DSS):</strong> We do not store your credit card details on our servers. All transactions are securely processed through our PCI-DSS compliant third-party payment gateways.</li>
              <li className="mb-2"><strong>Data Anonymization:</strong> Sensitive health information and prescription uploads are encrypted at rest and in transit. Only licensed pharmacists have access to your medical data.</li>
              <li className="mb-2"><strong>Regular Audits:</strong> Our systems undergo regular vulnerability scanning and penetration testing by certified cybersecurity experts.</li>
              <li className="mb-2"><strong>Fraud Prevention:</strong> We utilize advanced AI-driven fraud detection systems to monitor and block suspicious activities, protecting both our customers and our platform.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">3. Your Responsibilities</h3>
            <p className="mb-4">
              While we take every precaution to secure your data on our end, secure shopping is a two-way street. We recommend that you:
            </p>
            <ul className="mb-4">
              <li>Use a strong, unique password for your Medicare Shop account.</li>
              <li>Never share your login credentials with anyone.</li>
              <li>Log out of your account when using a shared or public computer.</li>
              <li>Keep your operating system and web browser updated to the latest secure versions.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">4. Report a Security Issue</h3>
            <p className="mb-0">
              If you discover a vulnerability or suspect a security incident related to your account, please contact our dedicated security team immediately at <strong>security@medicareshop.com</strong>.
            </p>

          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

export default SecureShopping;
