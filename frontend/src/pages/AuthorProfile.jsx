import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const authorsData = {
  'sarah-jenkins': {
    name: 'Dr. Sarah Jenkins',
    role: 'Chief Medical Reviewer (MD, Pharm D)',
    badge: 'Medical Expert Board Member',
    educationShort: 'Doctor of Medicine (MD) - Harvard Medical School',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutSub: 'Clinical Pharmacist (Pharm D)',
    educationList: [
      'Doctor of Medicine (MD) – Harvard Medical School',
      'Biomedical Engineering – Massachusetts Institute of Technology (MIT)',
      'Postdoctoral Fellowship in Clinical Pharmacology - Johns Hopkins University'
    ],
    bioParagraphs: [
      'Sarah Jenkins is a dedicated Clinical Pharmacologist and the Chief Medical Reviewer at Medicare Shop. With a Doctor of Pharmacy (Pharm D) and over 10 years of clinical experience at prestigious institutions like the Mayo Clinic and Johns Hopkins Hospital, Sarah specializes in drug safety, digital healthcare accessibility, and pharmaceutical supply chain management.',
      'Armed with a deep understanding of global healthcare standards and consumer safety, she ensures that all medical information and product insights provided on the platform are scientifically accurate, up-to-date, and easy for patients to understand. Her mission is to bridge the gap between quality medication and global accessibility while maintaining the highest regulatory standards.'
    ],
    research: 'Graduate Research Assistant, Department of Cellular and Molecular Pathology, University of Pittsburgh, April 2009 – January 2011.',
    grants: [
      'HRPF membership – National Cancer Institute',
      'Principal Investigator – Faculty Development Grant, Hampton University',
      'Co-Investigator – Faculty Development Grant, Hampton University'
    ],
    interests: 'Department of Pharmacy – Pharmacological Physiology',
    affiliations: [
      'The Sigma Xi Research Company',
      'American Association of Colleges of Pharmacy'
    ],
    service: 'American Board of Clinical Pharmacology (ABCP)',
    conclusion: 'Dr. Sarah Jenkins is a helpful resource for patients and readers looking for trustworthy information on the use and safety of medications due to her significant experience and expertise in the field of clinical pharmacology.'
  },
  'david-vance': {
    name: 'David Vance',
    role: 'Senior Medical Writer (MS)',
    badge: 'Editorial Board Member',
    educationShort: 'Master of Science in Medical Writing - Johns Hopkins University',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    aboutSub: 'Healthcare Communications Specialist',
    educationList: [
      'Master of Science (MS) in Medical Writing - Johns Hopkins University',
      'BS in Biochemistry - University of Michigan',
      'Member of the American Medical Writers Association (AMWA)'
    ],
    bioParagraphs: [
      'David Vance is a veteran medical writer who specializes in translating complex clinical trials and pharmaceutical data into accessible, patient-friendly articles. His writing focuses on drug mechanisms, emerging treatments, and evidence-based wellness.',
      'He is committed to publishing high-quality, objective resources that help consumers make informed decisions about their healthcare journeys.'
    ],
    research: 'Research Associate, Center for Health Literacy, University of Maryland, September 2012 – December 2014.',
    grants: [
      'Fellowship Grant – American Medical Writers Association (AMWA)',
      'Co-Investigator – Public Health Communications Grant, Hampton University'
    ],
    interests: 'Department of Communication – Health Literacy & Patient Advocacy',
    affiliations: [
      'American Medical Writers Association (AMWA)',
      'Association of Health Care Journalists (AHCJ)'
    ],
    service: 'National Health Council (NHC)',
    conclusion: 'David Vance is a highly dedicated science writer and communicator, focused on making drug safety and healthcare guidance clear and actionable for everyday readers.'
  },
  'elena-rostova': {
    name: 'Elena Rostova',
    role: 'Senior Medical Writer (PharmD)',
    badge: 'Editorial Board Member',
    educationShort: 'Doctor of Pharmacy (PharmD) - UCSF School of Pharmacy',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutSub: 'Pharmacist & Drug Safety Expert',
    educationList: [
      'Doctor of Pharmacy (PharmD) - University of California, San Francisco (UCSF)',
      'Clinical Pharmacy Residency - UCSF Medical Center',
      'BS in Chemistry - Boston University'
    ],
    bioParagraphs: [
      'Elena Rostova is a clinical pharmacist and medical writer with a passion for drug safety and patient education. She has extensive experience in hospital pharmacy operations and clinical consulting.',
      'At Medicare Shop, Elena writes detailed drug profiles, safety guides, and dosage recommendations, ensuring all information matches the latest guidelines from FDA, CDC, and other major regulatory bodies.'
    ],
    research: 'Clinical Research Fellow, Department of Clinical Pharmacy, UCSF, June 2015 – August 2017.',
    grants: [
      'Research Fellowship Grant – UCSF School of Pharmacy',
      'Principal Investigator – Community Health Outreach Grant, Hampton University'
    ],
    interests: 'Department of Clinical Pharmacy – Pharmacotherapy & Drug Information Systems',
    affiliations: [
      'American Society of Health-System Pharmacists (ASHP)',
      'American College of Clinical Pharmacy (ACCP)'
    ],
    service: 'California State Board of Pharmacy',
    conclusion: 'Elena Rostova leverages her extensive clinical pharmacy background to review drug profiles and deliver trusted, scientifically backed guidance on medication safety and dosage guidelines.'
  }
};

function AuthorProfile() {
  const { authorSlug } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
        const response = await fetch(`${API_URL}/authors/${authorSlug}`);
        if (response.ok) {
          const data = await response.json();
          setAuthor(data);
        } else {
          // Fallback to local copy
          console.warn("Author not found in database, falling back to local copy");
          setAuthor(authorsData[authorSlug] || null);
        }
      } catch (err) {
        console.error("Error fetching author from backend:", err);
        setAuthor(authorsData[authorSlug] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorSlug]);

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Container className="py-5 flex-grow-1 text-center mt-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5 className="text-muted">Loading profile...</h5>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Header />
        <Container className="py-5 flex-grow-1 text-center mt-5">
          <h2 className="fw-bold mb-4">Author Profile Not Found</h2>
          <p className="text-muted">The requested profile page could not be located.</p>
          <Button as={Link} to="/" variant="primary">Return to Shop</Button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header />
      
      {/* Breadcrumb Area */}
      <div className="bg-light py-2 border-bottom">
        <Container>
          <div className="small text-muted">
            <Link to="/" className="text-decoration-none text-muted">Home</Link> &gt; Archives for {author.name}
          </div>
        </Container>
      </div>

      <Container className="py-5 flex-grow-1">
        {/* Profile Card Header Block */}
        <div 
          className="p-4 p-md-5 rounded-4 mb-5 d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 border"
          style={{ backgroundColor: '#f0f9ff', borderColor: '#e0f2fe' }}
        >
          {/* Avatar Image */}
          <div className="flex-shrink-0" style={{ width: '150px', height: '150px' }}>
            <img 
              src={author.image} 
              alt={author.name} 
              className="rounded-3 w-100 h-100 object-fit-cover shadow-sm border border-2 border-white"
            />
          </div>
          
          {/* Author Meta Details */}
          <div className="text-center text-md-start flex-grow-1">
            <h1 className="fw-bold text-dark mb-1">{author.name}</h1>
            <p className="text-muted fw-500 mb-2">{author.role}</p>
            
            <Badge 
              bg="success" 
              className="px-3 py-2 fw-bold mb-3"
              style={{ backgroundColor: 'var(--success-color)', fontSize: '0.75rem', borderRadius: '50px' }}
            >
              {author.badge}
            </Badge>
            
            <p className="text-dark small mb-3">
              <strong>Education:</strong> {author.educationShort}
            </p>

            {/* Social Icons */}
            <div className="d-flex justify-content-center justify-content-md-start gap-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }} aria-label="X (Twitter)">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.85rem', backgroundColor: '#e1306c', border: 'none' }} aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed About Section */}
        <Row className="gy-4">
          <Col lg={8}>
            <h3 className="fw-bold text-dark mb-2">About {author.name}</h3>
            <p className="text-secondary fw-500 mb-4">{author.aboutSub}</p>

            {/* Education Details list */}
            <ul className="list-unstyled mb-4 d-flex flex-column gap-2">
              {author.educationList.map((item, idx) => (
                <li key={idx} className="d-flex align-items-start gap-2 text-dark">
                  <span className="text-success fw-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Detailed Bio Paragraphs */}
            <div className="d-flex flex-column gap-3 text-secondary lh-lg mb-4" style={{ fontSize: '0.95rem' }}>
              {author.bioParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Research Experience */}
            {author.research && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-2">Research Experience</h5>
                <p className="text-secondary small">{author.research}</p>
              </div>
            )}

            {/* Grantsmanship */}
            {author.grants && author.grants.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-2">Grantsmanship</h5>
                <ul className="list-unstyled d-flex flex-column gap-1 text-secondary small">
                  {author.grants.map((item, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-2">
                      <span className="text-success fw-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Field of Interest */}
            {author.interests && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-2">Field of Interest</h5>
                <p className="text-secondary small">{author.interests}</p>
              </div>
            )}

            {/* Professional Affiliations */}
            {author.affiliations && author.affiliations.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-2">Professional Affiliations</h5>
                <ul className="list-unstyled d-flex flex-column gap-1 text-secondary small">
                  {author.affiliations.map((item, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-2">
                      <span className="text-success fw-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Service */}
            {author.service && (
              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-2">Service</h5>
                <p className="text-secondary small">{author.service}</p>
              </div>
            )}

            {/* Conclusion */}
            {author.conclusion && (
              <div className="p-3 bg-light rounded border-start border-4 border-success mt-4">
                <p className="text-dark small mb-0" style={{ fontStyle: 'italic' }}>{author.conclusion}</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      
      <Footer />
    </div>
  );
}

export default AuthorProfile;
