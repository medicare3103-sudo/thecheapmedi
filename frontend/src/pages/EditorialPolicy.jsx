import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function EditorialPolicy() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-5 flex-grow-1">
        <Card className="border-0 shadow-sm rounded-4 p-md-5 p-4" style={{ border: '1px solid #e2e8f0' }}>
          <Card.Body>
            <h1 className="fw-bold mb-4 text-gradient">Editorial Policy</h1>
            <p className="lead text-dark fw-500 mb-4" style={{ lineHeight: '1.6' }}>
              Our commitment to accuracy means we only provide primary information from <strong>recognized health authorities</strong> such as the <strong>FDA (USA)</strong>, <strong>CDC (USA)</strong>, and <strong>peer-reviewed medical journals</strong>. We strictly prohibit the use of unverified data or 'copy-pasting' from other retail websites to ensure our customers receive only scientifically backed information.
            </p>

            <hr className="my-4" />

            <h4 className="fw-bold text-dark mt-4 mb-3">Our Core Principles</h4>
            <div className="d-flex flex-column gap-3 mb-4 text-muted">
              <div>
                <strong>1. Scientific Rigor:</strong> All medical information is verified against official databases and peer-reviewed journals.
              </div>
              <div>
                <strong>2. Independent Review:</strong> Content is peer-reviewed by certified medical professionals, including our chief medical reviewer, Dr. Sarah Jenkins.
              </div>
              <div>
                <strong>3. Anti-Plagiarism:</strong> We strictly prohibit duplicate content or unverified translations to maintain transparency and original research.
              </div>
            </div>

            <h4 className="fw-bold text-dark mt-4 mb-3">Meet Our Editorial Board</h4>
            <div className="d-flex flex-wrap gap-4 mt-3">
              <Link to="/author/sarah-jenkins" className="text-decoration-none d-flex align-items-center gap-3 p-3 bg-light rounded-3 border hover-shadow" style={{ minWidth: '250px' }}>
                <span style={{ fontSize: '2rem' }}>👨‍⚕️</span>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Dr. Sarah Jenkins</h6>
                  <span className="text-secondary small">Chief Medical Reviewer</span>
                </div>
              </Link>

              <Link to="/author/david-vance" className="text-decoration-none d-flex align-items-center gap-3 p-3 bg-light rounded-3 border hover-shadow" style={{ minWidth: '250px' }}>
                <span style={{ fontSize: '2rem' }}>✍️</span>
                <div>
                  <h6 className="fw-bold text-dark mb-1">David Vance</h6>
                  <span className="text-secondary small">Senior Medical Writer</span>
                </div>
              </Link>

              <Link to="/author/elena-rostova" className="text-decoration-none d-flex align-items-center gap-3 p-3 bg-light rounded-3 border hover-shadow" style={{ minWidth: '250px' }}>
                <span style={{ fontSize: '2rem' }}>✍️</span>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Elena Rostova</h6>
                  <span className="text-secondary small">Senior Medical Writer</span>
                </div>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
      
      <Footer />
    </div>
  );
}

export default EditorialPolicy;
