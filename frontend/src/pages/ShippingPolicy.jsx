import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ShippingPolicy() {
  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Shipping Policy</h1>
          <p className="lead opacity-75">Fast, discreet, and reliable delivery for your healthcare needs.</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4">
          <Card.Body className="text-muted lh-lg">
            
            <h3 className="text-dark fw-bold mb-3">1. Order Processing Time</h3>
            <p className="mb-4">
              All non-prescription orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. 
              <br/><br/>
              <strong>Prescription Orders:</strong> Orders containing prescription medications require pharmacist verification. This process typically adds an additional 24 hours to the processing time.
            </p>

            <h3 className="text-dark fw-bold mb-3">2. Domestic Shipping Rates and Estimates</h3>
            <p className="mb-3">
              Shipping charges for your order will be calculated and displayed at checkout. We offer the following standard rates:
            </p>
            <div className="table-responsive mb-4">
              <Table bordered hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Shipping Method</th>
                    <th>Estimated Delivery Time</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Standard Shipping</td>
                    <td>3 to 5 business days</td>
                    <td>$25.00 (Free for orders above $189)</td>
                  </tr>
                  <tr>
                    <td>Expedited Shipping</td>
                    <td>2 business days</td>
                    <td>$12.99</td>
                  </tr>
                  <tr>
                    <td>Overnight Delivery</td>
                    <td>1 business day</td>
                    <td>$24.99</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <h3 className="text-dark fw-bold mb-3">3. International Shipping</h3>
            <p className="mb-4">
              We offer international shipping to Canada and select European countries. Due to international customs and pharmaceutical regulations, certain medications cannot be shipped across borders. Please verify your local laws before placing an international order. International shipping typically takes 7-14 business days.
            </p>

            <h3 className="text-dark fw-bold mb-3">4. Discreet Packaging</h3>
            <p className="mb-4">
              Your privacy is our utmost priority. All our shipments are packed in plain, unbranded boxes or envelopes with no external indication of the contents inside. The return address will simply read "Fulfillment Center."
            </p>

            <h3 className="text-dark fw-bold mb-3">5. How Do I Check the Status of My Order?</h3>
            <p className="mb-4">
              When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
            </p>

            <h3 className="text-dark fw-bold mb-3">6. Temperature-Sensitive Medications</h3>
            <p className="mb-0">
              Medications that require refrigeration (such as insulin) are shipped in specially designed insulated packaging with cold packs. These orders are strictly shipped via Expedited or Overnight Delivery to ensure product integrity.
            </p>

          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

export default ShippingPolicy;
