import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function SecurePackaging() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Secure & Discreet Packaging</h1>
          <p className="lead opacity-75">Delivering your healthcare essentials safely and privately.</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        
        {/* Visual Features Section */}
        <Row className="mb-5 text-center g-4 justify-content-center">
          <Col md={4} xs={12}>
            <Card className="h-100 border-0 shadow-sm py-4 px-3">
              <div className="fs-1 text-primary mb-3">📦</div>
              <h5 className="fw-bold text-dark">Unbranded Exterior</h5>
              <p className="text-muted small mb-0">No medical logos or product names on the outside of the box.</p>
            </Card>
          </Col>
          <Col md={4} xs={12}>
            <Card className="h-100 border-0 shadow-sm py-4 px-3">
              <div className="fs-1 text-primary mb-3">❄️</div>
              <h5 className="fw-bold text-dark">Climate Controlled</h5>
              <p className="text-muted small mb-0">Insulated coolers with ice packs for temperature-sensitive medications.</p>
            </Card>
          </Col>
          <Col md={4} xs={12}>
            <Card className="h-100 border-0 shadow-sm py-4 px-3">
              <div className="fs-1 text-primary mb-3">🛡️</div>
              <h5 className="fw-bold text-dark">Tamper-Evident</h5>
              <p className="text-muted small mb-0">Sealed securely to guarantee your items arrive unopened and safe.</p>
            </Card>
          </Col>
        </Row>

        {/* Detailed Information */}
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4">
          <Card.Body className="text-muted lh-lg">
            
            <h3 className="text-dark fw-bold mb-3">1. Packaging Information</h3>
            <p className="mb-4">
              At The Cheap Pharma, we understand that medications and health supplies require special care during transit. Our fulfillment center uses industry-leading materials to protect your order:
            </p>
            <ul className="mb-4">
              <li className="mb-2"><strong>Standard Medications:</strong> Shipped in crush-resistant corrugated boxes or heavily padded envelopes, filled with biodegradable packing peanuts or air pillows to prevent movement and damage.</li>
              <li className="mb-2"><strong>Liquid Products:</strong> Individually sealed in leak-proof bags before being boxed.</li>
              <li className="mb-2"><strong>Temperature-Sensitive Items:</strong> Items like insulin or certain eye drops are packed in EPS foam coolers. We include industrial-grade gel cold packs tailored to the transit time, ensuring the medication remains within the manufacturer's required temperature range until delivery.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">2. Privacy Assurance</h3>
            <p className="mb-3">
              Your health is a private matter. We guarantee that your order will be delivered with complete discretion.
            </p>
            <ul className="mb-4">
              <li className="mb-2"><strong>Plain Packaging:</strong> All orders are shipped in plain brown boxes or standard courier envelopes.</li>
              <li className="mb-2"><strong>No Logos:</strong> There are no The Cheap Pharma logos, pharmacy branding, or medical symbols anywhere on the exterior.</li>
              <li className="mb-2"><strong>Discreet Return Address:</strong> The sender on the shipping label will simply be listed as "Fulfillment Center" or our parent company's legal name, giving no indication that the package contains pharmaceuticals.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">3. Environmental Commitment</h3>
            <p className="mb-0">
              We care about your health and the health of our planet. That is why 90% of our packaging materials are made from recycled or biodegradable materials. Our cardboard boxes are 100% recyclable, and our packing peanuts dissolve harmlessly in water.
            </p>

          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

export default SecurePackaging;
