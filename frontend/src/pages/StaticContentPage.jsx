import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { staticPagesContent } from '../data/staticPagesContent';

function StaticContentPage() {
  const { slug } = useParams();
  const page = staticPagesContent[slug];

  useEffect(() => {
    if (page) {
      document.title = page.metaTitle || `${page.title} - Cheap Medicine Shop`;
      // Scroll to top on page change
      window.scrollTo(0, 0);
    } else {
      document.title = 'Page Not Found - Cheap Medicine Shop';
    }
  }, [slug, page]);

  // List of all pages for the sidebar navigation
  const sidebarLinks = Object.keys(staticPagesContent).map(key => ({
    slug: key,
    title: staticPagesContent[key].title
  }));

  if (!page) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Container className="py-5 flex-grow-1 d-flex align-items-center justify-content-center">
          <Card className="text-center p-5 border-0 shadow-sm rounded-4" style={{ maxWidth: '500px' }}>
            <Card.Body>
              <div className="fs-1 mb-4 text-warning">⚠️</div>
              <h2 className="fw-bold mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <Link to="/">
                <Button variant="primary" className="px-4">Go to Homepage</Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />

      {/* Hero Banner with beautiful gradient */}
      <div 
        className="py-5 text-white text-center" 
        style={{ 
          background: 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)',
          boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <h1 className="display-4 fw-extrabold mb-2 text-white font-display text-capitalize">{page.title}</h1>
          <p className="lead opacity-75 mb-0">Last Updated: {page.lastUpdated}</p>
        </Container>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-bottom py-2">
        <Container>
          <div className="small text-muted text-start">
            <Link to="/" className="text-decoration-none text-muted hover-primary">Home</Link> &gt; 
            <span className="ms-1 text-primary">{page.title}</span>
          </div>
        </Container>
      </div>

      {/* Content Layout */}
      <Container className="py-5 flex-grow-1">
        <Row className="gy-4">
          
          {/* Main Content Area */}
          <Col lg={8} md={7} xs={12} className="text-start">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Body className="p-4 p-md-5">
                <article className="lh-lg text-muted" style={{ fontSize: '1.05rem' }}>
                  {page.content}
                </article>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar Navigation */}
          <Col lg={4} md={5} xs={12} className="text-start">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <Card.Header className="bg-white border-0 pt-4 px-4 pb-2">
                <h5 className="fw-bold mb-0 text-secondary font-display">Information & Policies</h5>
              </Card.Header>
              <Card.Body className="px-3 pb-4 pt-2">
                <ListGroup variant="flush" className="sidebar-policy-nav" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {sidebarLinks.map((link) => (
                    <ListGroup.Item 
                      key={link.slug} 
                      className="border-0 p-0 mb-1"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Link 
                        to={`/info/${link.slug}`} 
                        className={`d-block py-2 px-3 rounded-3 text-decoration-none transition-all fw-500 ${
                          slug === link.slug 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'text-muted hover-bg-light hover-primary'
                        }`}
                      >
                        {link.title}
                      </Link>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            {/* Quick Contact Box */}
            <Card className="border-0 shadow-sm rounded-4 mt-4 bg-primary text-white p-4 text-start">
              <h5 className="fw-bold mb-2">Need Direct Help?</h5>
              <p className="small opacity-75 mb-4">Our support desk operates 24/7. Contact us anytime for inquiries.</p>
              <div className="d-flex flex-column gap-2">
                <a href="mailto:medicare3103@gmail.com" className="btn btn-light btn-sm fw-bold text-primary py-2 rounded-3 text-decoration-none text-center">
                  📧 Email Support
                </a>
                <a href="tel:+18888667566" className="btn btn-outline-light btn-sm fw-bold py-2 rounded-3 text-decoration-none text-center">
                  📞 Call Support
                </a>
              </div>
            </Card>
          </Col>

        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default StaticContentPage;
