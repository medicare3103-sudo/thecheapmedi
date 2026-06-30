import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';

function ContactUs() {
  useSEO({
    title: "Contact Us - Customer Support | The Cheap Pharma",
    description: "Get in touch with the support team at The Cheap Pharma. We are here to help with order tracking, product queries, prescriptions, and payments 24/7."
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Support',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    {
      id: "drug-policy",
      title: "Drug & Prescription Policy",
      desc: "Questions about prescription submission, validation protocols, or generic medication safety.",
      email: "medicare3103@gmail.com",
      icon: "💊"
    },
    {
      id: "payments",
      title: "Payment FAQs & Billing",
      desc: "Queries on accepted billing methods, transaction issues, refunds, or payment status.",
      email: "medicare3103@gmail.com",
      icon: "💳"
    },
    {
      id: "shipping",
      title: "Shipping & Tracking FAQ",
      desc: "Tracking package transit, customs clearances, or international delivery options.",
      email: "medicare3103@gmail.com",
      icon: "🚚"
    },
    {
      id: "returns",
      title: "Return & Refund Policy",
      desc: "Submitting queries for damaged products, incorrect items, or medication return regulations.",
      email: "medicare3103@gmail.com",
      icon: "↩️"
    },
    {
      id: "cancellations",
      title: "Order Cancellations",
      desc: "Requests to cancel or modify your active order within the 12-hour dispatch window.",
      email: "medicare3103@gmail.com",
      icon: "❌"
    },
    {
      id: "medicare-info",
      title: "General Medicare Inquiries",
      desc: "Main customer desk for support, order updates, feedback, or general queries.",
      email: "medicare3103@gmail.com",
      icon: "🏥"
    },
    {
      id: "privacy-cookies",
      title: "Privacy & Cookie Policy",
      desc: "Managing your personal data permissions, cookie settings, or data erasure rights.",
      email: "medicare3103@gmail.com",
      icon: "🔒"
    },
    {
      id: "disclaimer",
      title: "General Disclaimer & Legal",
      desc: "Inquiries regarding trademark policies, website disclaimers, or terms of service.",
      email: "medicare3103@gmail.com",
      icon: "⚖️"
    },
    {
      id: "medical",
      title: "Medical & Clinical Reviews",
      desc: "Questions about medical board articles, clinical authors, or health advisories.",
      email: "medicare3103@gmail.com",
      icon: "🩺"
    },
    {
      id: "communications",
      title: "Communications & Alerts",
      desc: "Managing opt-in/opt-out preferences for emails, transactional messages, and SMS alerts.",
      email: "medicare3103@gmail.com",
      icon: "✉️"
    },
    {
      id: "login-issues",
      title: "Login & Account Access Issues",
      desc: "Assistance with logging in, password recovery, phone registration, or OTP codes.",
      email: "medicare3103@gmail.com",
      icon: "👤"
    },
    {
      id: "website-footer",
      title: "Website & Footer Issues",
      desc: "Report issues with web interfaces, navigation, sitemaps, or footer links.",
      email: "medicare3103@gmail.com",
      icon: "🌐"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', department: 'General Support', subject: '', message: '' });
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Memoized — scans title + desc of all 12 departments;
  // only re-runs when the search query actually changes, not on form field keystrokes
  const filteredDepartments = useMemo(
    () => departments.filter(dept =>
      dept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery] // `departments` is a stable constant defined outside render
  );

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      {/* Page Header */}
      <div 
        className="py-5 text-white text-center mb-5"
        style={{ 
          background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)',
          boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <h1 className="display-4 fw-extrabold mb-2 text-white font-display">Contact & Department Directory</h1>
          <p className="lead opacity-75 mb-0">Select a department or search below to find the contact info you need.</p>
        </Container>
      </div>

      <Container className="mb-5 flex-grow-1">
        <Row className="gy-5">
          {/* Department Directory Column */}
          <Col lg={7} md={12} className="text-start">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <h2 className="fw-bold mb-0 text-secondary font-display">Department Directory</h2>
              <div style={{ maxWidth: '300px', width: '100%' }}>
                <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                  <Form.Control
                    placeholder="Search departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ border: 'none', paddingLeft: '1rem' }}
                  />
                  <InputGroup.Text style={{ background: '#fff', border: 'none' }}>🔍</InputGroup.Text>
                </InputGroup>
              </div>
            </div>

            <Row className="g-3">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept) => (
                  <Col md={6} xs={12} key={dept.id}>
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-translate">
                      <Card.Body className="p-4 d-flex flex-column">
                        <div className="d-flex align-items-center mb-3">
                          <span className="fs-2 me-3">{dept.icon}</span>
                          <h5 className="fw-bold text-dark mb-0 font-display">{dept.title}</h5>
                        </div>
                        <p className="text-muted small flex-grow-1 mb-4">{dept.desc}</p>
                        <div className="mt-auto pt-2 border-top">
                          <div className="text-muted small mb-1 fw-bold">Contact Email:</div>
                          <a 
                            href={`mailto:${dept.email}?subject=${encodeURIComponent(dept.title)}`} 
                            className="text-primary fw-bold text-decoration-none d-flex align-items-center gap-1 hover-underline"
                            style={{ fontSize: '0.9rem' }}
                          >
                            ✉️ {dept.email}
                          </a>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <Alert variant="warning" className="text-center rounded-3">
                    No departments found matching your search. Try searching for "prescription", "shipping", or "legal".
                  </Alert>
                </Col>
              )}
            </Row>
          </Col>

          {/* Quick Support & Form Column */}
          <Col lg={5} md={12}>
            {/* Quick General Contacts */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 text-start bg-primary text-white">
              <Card.Body>
                <h4 className="fw-bold mb-4">Direct Support Lines</h4>
                
                <div className="d-flex align-items-start mb-4 gap-3">
                  <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', minWidth: '45px', fontSize: '1.2rem' }}>
                    📞
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold text-white">Phone Support</h6>
                    <a href="tel:+18888667566" className="text-white opacity-90 text-decoration-none hover-underline">
                      +1 (888) 866-7566
                    </a>
                    <div className="small opacity-75">Toll Free, Available 24/7</div>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4 gap-3">
                  <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', minWidth: '45px', fontSize: '1.2rem' }}>
                    ✉️
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold text-white">Common Help Desk</h6>
                    <a href="mailto:medicare3103@gmail.com" className="text-white opacity-90 text-decoration-none hover-underline">
                      medicare3103@gmail.com
                    </a>
                    <div className="small opacity-75">Average response time: &lt; 2 hours</div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', minWidth: '45px', fontSize: '1.2rem' }}>
                    📍
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold text-white">Corporate HQ</h6>
                    <p className="small text-white opacity-90 mb-0">
                      123 Health Avenue, Medical District,<br />New York, NY 10001
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Contact Form */}
            <Card className="border-0 shadow-sm rounded-4 p-4 text-start">
              <Card.Body>
                <h3 className="fw-bold mb-4 font-display">Send a Quick Message</h3>
                {submitted && (
                  <Alert variant="success" onClose={() => setSubmitted(false)} dismissible className="rounded-3">
                    Thank you! Your message has been sent successfully. We will get back to you soon.
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Your Name *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      placeholder="John Doe" 
                      className="py-2 rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Your Email *</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      placeholder="john@example.com" 
                      className="py-2 rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Target Department *</Form.Label>
                    <Form.Select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="py-2 rounded-3"
                    >
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.title}>{dept.title}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-muted">Subject *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      placeholder="How can we help?" 
                      className="py-2 rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold text-muted">Message *</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={4} 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      placeholder="Write your message here..." 
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" size="lg" className="w-100 py-2.5 fw-bold text-uppercase rounded-3">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Google Map Embedded */}
      <div className="w-100 mt-5 border-top" style={{ height: '350px' }}>
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
    </div>
  );
}

export default ContactUs;
