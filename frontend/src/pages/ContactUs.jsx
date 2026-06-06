import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending an email/message to the backend
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      
      {/* Page Header */}
      <div className="bg-primary text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead opacity-75">We are here to help. Reach out to us for any queries or support.</p>
        </Container>
      </div>

      <Container className="mb-5">
        <Row className="g-5">
          {/* Contact Information */}
          <Col md={5}>
            <h2 className="section-title mb-4">Get in Touch</h2>
            <p className="text-muted mb-5">
              Do you have questions about our products, shipping, or need assistance with your order? 
              Our dedicated support team is available 24/7 to assist you.
            </p>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', fontSize: '1.2rem'}}>
                📍
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Our Address</h5>
                <p className="text-muted mb-0">123 Health Avenue, Medical District,<br />New York, NY 10001</p>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', fontSize: '1.2rem'}}>
                📞
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Phone Number</h5>
                <p className="text-muted mb-0">+1 (888) 866-7566<br />Mon-Sun: 24/7 Support</p>
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', fontSize: '1.2rem'}}>
                ✉️
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Email Address</h5>
                <p className="text-muted mb-0">info@thecheappharma.com<br />support@thecheappharma.com</p>
              </div>
            </div>
          </Col>

          {/* Contact Form */}
          <Col md={7}>
            <Card className="border-0 shadow-sm rounded-4 p-4">
              <Card.Body>
                <h3 className="fw-bold mb-4">Send Us a Message</h3>
                {submitted && (
                  <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                    Thank you! Your message has been sent successfully. We will get back to you soon.
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Your Name *</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required 
                          placeholder="John Doe" 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label>Your Email *</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                          placeholder="john@example.com" 
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Subject *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      placeholder="How can we help?" 
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      placeholder="Write your message here..." 
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" size="lg" className="w-100 px-5">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Google Map Embedded */}
      <div className="w-100" style={{ height: '400px' }}>
        <iframe 
          title="Google Map Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <Footer />
    </>
  );
}

export default ContactUs;
