import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Terms() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Terms & Conditions</h1>
          <p className="lead opacity-75">Last Updated: October 2026</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4">
          <Card.Body className="text-muted lh-lg">
            
            <h3 className="text-dark fw-bold mb-3">1. Agreement to Terms</h3>
            <p className="mb-4">
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and The Cheap Pharma ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
            </p>

            <h3 className="text-dark fw-bold mb-3">2. Medical Disclaimer</h3>
            <p className="mb-4">
              The content provided on the Site is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Site.
            </p>

            <h3 className="text-dark fw-bold mb-3">3. Prescription Medication Policy</h3>
            <p className="mb-4">
              Certain products available on our Site require a valid prescription from a licensed healthcare provider. By ordering prescription medications, you confirm that:
            </p>
            <ul className="mb-4">
              <li>You have a valid, unexpired prescription for the medication ordered.</li>
              <li>You will upload or provide a verifiable copy of the prescription before the order is processed.</li>
              <li>You are ordering the medication for personal use and not for resale.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">4. User Representations</h3>
            <p className="mb-4">
              By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms and Conditions.
            </p>

            <h3 className="text-dark fw-bold mb-3">5. Products and Pricing</h3>
            <p className="mb-4">
              All products, specifications, and prices described on the Site are subject to change at any time without notice. We make all reasonable efforts to accurately display the attributes of our products. However, the actual color or packaging you see will depend on your computer system, and we cannot guarantee that your computer will accurately display such colors.
            </p>

            <h3 className="text-dark fw-bold mb-3">6. Returns and Refunds</h3>
            <p className="mb-4">
              Please review our Return Policy posted on the Site prior to making any purchases. Due to health and safety regulations, prescription medications are strictly non-returnable once dispensed and shipped.
            </p>

            <h3 className="text-dark fw-bold mb-3">7. Contact Us</h3>
            <p className="mb-0">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <strong>legal@thecheappharma.com</strong>.
            </p>

          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

export default Terms;
