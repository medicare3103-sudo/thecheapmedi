import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Privacy Policy</h1>
          <p className="lead opacity-75">Last Updated: October 2026</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4">
          <Card.Body className="text-muted lh-lg">
            
            <h3 className="text-dark fw-bold mb-3">1. Introduction</h3>
            <p className="mb-4">
              At The Cheap Pharma, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>

            <h3 className="text-dark fw-bold mb-3">2. The Data We Collect About You</h3>
            <p className="mb-4">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="mb-4">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Health Data:</strong> includes prescription details uploaded for processing medication orders.</li>
              <li><strong>Financial Data:</strong> includes bank account and payment card details (processed securely by our payment gateway).</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">3. How Is Your Personal Data Collected?</h3>
            <p className="mb-4">
              We use different methods to collect data from and about you including through:
              <br />
              <strong>Direct interactions.</strong> You may give us your Identity, Contact, Health, and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise.
            </p>

            <h3 className="text-dark fw-bold mb-3">4. How We Use Your Personal Data</h3>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="mb-4">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering your order).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h3 className="text-dark fw-bold mb-3">5. Data Security</h3>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h3 className="text-dark fw-bold mb-3">6. Your Legal Rights</h3>
            <p className="mb-4">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.
            </p>
            <p className="mb-0">
              If you wish to exercise any of the rights set out above, please contact us at <strong>medicare3103@gmail.com</strong>.
            </p>

          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;
