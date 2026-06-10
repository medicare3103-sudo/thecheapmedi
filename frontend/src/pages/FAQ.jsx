import React, { useState } from 'react';
import { Container, Row, Col, Accordion, ListGroup } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function FAQ() {
  const [activeCategory, setActiveCategory] = useState('orders');

  const categories = [
    { id: 'orders', label: '📦 Orders' },
    { id: 'payments', label: '💳 Payments' },
    { id: 'prescription', label: '📄 Prescription' },
    { id: 'shipping', label: '🚚 Shipping' },
    { id: 'returns', label: '↩️ Returns' }
  ];

  const faqData = {
    orders: [
      { q: "How do I place an order?", a: "You can place an order by searching for your required medicine, adding it to the cart, and proceeding to checkout. You will need to create an account or log in to complete the purchase." },
      { q: "Can I modify my order after placing it?", a: "Orders can only be modified within 1 hour of placement. Please contact our support team immediately if you need to make changes." },
      { q: "How do I track my order?", a: "Once your order is shipped, you will receive a tracking link via email. You can also track your order status in your Account Dashboard." }
    ],
    payments: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, and HSA/FSA cards for eligible products." },
      { q: "Is it safe to use my credit card on your website?", a: "Yes, absolutely. Our website uses industry-standard SSL encryption to ensure your payment details are completely secure." },
      { q: "Why was my payment declined?", a: "Payments may be declined due to incorrect details, insufficient funds, or bank restrictions. Please verify your details or contact your bank for assistance." }
    ],
    prescription: [
      { q: "How do I upload my prescription?", a: "During checkout for a prescription item, you will be prompted to upload a clear photo or scanned copy of your valid prescription. You can also upload it from your Account Dashboard." },
      { q: "Do you verify the prescriptions?", a: "Yes, our licensed pharmacists verify every uploaded prescription before approving and dispensing the medication." },
      { q: "Can I transfer my prescription from another pharmacy?", a: "Yes! Simply provide us with your current pharmacy's details during checkout, and we will handle the transfer process for you." }
    ],
    shipping: [
      { q: "How much does shipping cost?", a: "Standard shipping is $25.00. We offer free standard shipping on all orders above $189. Expedited shipping options are available at checkout." },
      { q: "Do you ship internationally?", a: "Currently, we ship to the US, Canada, and select European countries. Please check our shipping policy for the full list of eligible locations." },
      { q: "How long will my delivery take?", a: "Standard shipping takes 3-5 business days. Expedited shipping takes 1-2 business days. Prescription verification may add 24 hours to the processing time." }
    ],
    returns: [
      { q: "What is your return policy?", a: "Due to safety regulations, we cannot accept returns on prescription medications. Over-the-counter products in unopened, original packaging can be returned within 30 days." },
      { q: "What if I receive a damaged product?", a: "If your order arrives damaged or incorrect, please contact our support team within 48 hours with photos, and we will issue a free replacement or full refund." },
      { q: "How long do refunds take to process?", a: "Once approved, refunds are processed back to your original payment method within 5-7 business days." }
    ]
  };

  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Frequently Asked Questions</h1>
          <p className="lead opacity-75">Find answers to common questions about our products and services.</p>
        </Container>
      </div>

      <Container className="mb-5 min-vh-100">
        <Row>
          {/* Categories Sidebar */}
          <Col md={3} className="mb-4">
            <h4 className="fw-bold mb-3 text-secondary">Categories</h4>
            <ListGroup className="shadow-sm">
              {categories.map(cat => (
                <ListGroup.Item 
                  key={cat.id}
                  action 
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="py-3 border-0 border-bottom"
                  style={{ cursor: 'pointer', fontWeight: activeCategory === cat.id ? '600' : '400' }}
                >
                  {cat.label}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* FAQ Accordion */}
          <Col md={9}>
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h3 className="fw-bold mb-4 text-primary text-capitalize">
                {categories.find(c => c.id === activeCategory)?.label.split(' ')[1]} FAQs
              </h3>
              <Accordion defaultActiveKey="0" flush>
                {faqData[activeCategory].map((faq, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index} className="border-bottom">
                    <Accordion.Header className="fw-bold">{faq.q}</Accordion.Header>
                    <Accordion.Body className="text-muted lh-lg">
                      {faq.a}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default FAQ;
