import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const authorsData = {
  'sarah-jenkins': {
    name: 'Dr. Sarah Jenkins',
    role: 'Chief Clinical Officer & Medical Review Board Chair (MD, PhD, FACP)',
    badge: 'Medical Expert Board Chair',
    educationShort: 'Doctor of Medicine (MD) - Harvard Medical School, PhD in Pharmacology - MIT',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutSub: 'Certified Clinical Pharmacologist & Internal Medicine Specialist',
    educationList: [
      'Doctor of Medicine (MD) with Honors – Harvard Medical School',
      'PhD in Molecular Pharmacology – Massachusetts Institute of Technology (MIT)',
      'Residency in Internal Medicine – Brigham and Women\'s Hospital',
      'Fellowship in Clinical Pharmacology & Therapeutics – Johns Hopkins University School of Medicine'
    ],
    bioParagraphs: [
      'Dr. Sarah Jenkins is a board-certified internist, clinical pharmacologist, and the chair of the Medical Review Board at Medicare. With over 15 years of experience in academic medicine and clinical research, Dr. Jenkins oversaw drug safety monitoring, clinical trial protocols, and evidence-based pharmaceutical evaluations at Brigham and Women\'s Hospital and Johns Hopkins Medicine.',
      'Her clinical expertise focuses on cardiovascular pharmacology, geriatric pharmacotherapy, and drug-drug interaction safety. At Medicare, Dr. Jenkins directs the clinical review process, ensuring that every product description, safety warning, and medical recommendation is rigorously vetted against the latest FDA approvals, peer-reviewed clinical guidelines, and standard prescribing practices. Her mission is to ensure that patients have access to transparent, medically accurate information to make safe, informed choices about their prescription and over-the-counter care.'
    ],
    research: 'Lead Investigator, Clinical Trial on Cardiovascular Outcomes of Novel Antihypertensive Regimens, Johns Hopkins Division of Clinical Pharmacology, 2014 – 2018.',
    grants: [
      'R01 Research Grant – National Heart, Lung, and Blood Institute (NHLBI)',
      'Clinical Investigator Development Award – National Institutes of Health (NIH)',
      'Independent Research Fellowship Grant – American Heart Association'
    ],
    interests: 'Precision Medicine, Cardiorenal Pharmacology, and Pharmacogenomic Applications in Primary Care.',
    affiliations: [
      'Fellow of the American College of Physicians (FACP)',
      'American Society for Clinical Pharmacology and Therapeutics (ASCPT)',
      'American Medical Association (AMA)'
    ],
    service: 'Advisor, FDA Advisory Committee on Cardiovascular and Renal Drugs; Member of the USP (United States Pharmacopeia) Expert Committee.',
    conclusion: 'Dr. Sarah Jenkins utilizes her extensive clinical background in medicine and molecular pharmacology to ensure that Medicare\'s products and medical guides reflect the highest standards of safety, quality, and clinical integrity.'
  },
  'david-vance': {
    name: 'David Vance',
    role: 'Senior Medical Writer & Science Communicator (MS)',
    badge: 'Editorial Review Board Member',
    educationShort: 'MS in Science Writing - Johns Hopkins University, BS in Biochemistry',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    aboutSub: 'Healthcare Communications Specialist & Medical Editor',
    educationList: [
      'Master of Science (MS) in Science & Medical Writing – Johns Hopkins University',
      'Bachelor of Science (BS) in Biochemistry – University of Michigan, Ann Arbor',
      'Active Member – American Medical Writers Association (AMWA)'
    ],
    bioParagraphs: [
      'David Vance is a dedicated medical writer and editor with over 8 years of experience in translating clinical datasets, peer-reviewed medical journals, and regulatory documents into clear, patient-centric educational content. His work bridges the gap between complex pharmaceutical research and consumer health literacy.',
      'Prior to joining the Medicare editorial team, David served as a communications specialist for health systems and health technology platforms, creating evidence-based articles on chronic disease management, immunology, and preventive medicine. At Medicare, he ensures that all wellness articles, lifestyle guides, and medication guides are easy to understand, scientifically grounded, and free of medical jargon, empowering readers to take control of their health journeys.'
    ],
    research: 'Contributing Researcher, Longitudinal Study on Digital Health Interventions for Patient Education and Adherence, University of Michigan Health System, 2016 – 2018.',
    grants: [
      'Educational Grant – American Medical Writers Association (AMWA)',
      'Digital Health Literacy Project Fund – National Library of Medicine (NLM)'
    ],
    interests: 'Patient Health Literacy, Health Communication Strategies, and Digital Patient Engagement.',
    affiliations: [
      'American Medical Writers Association (AMWA)',
      'Association of Health Care Journalists (AHCJ)'
    ],
    service: 'Volunteer Advisor, National Health Council (NHC) Committee on Health Literacy; Editor, AMWA Journal Review Board.',
    conclusion: 'David Vance is committed to translating complex clinical data into reliable, actionable, and easy-to-understand wellness content for Medicare\'s patients and readers.'
  },
  'elena-rostova': {
    name: 'Elena Rostova',
    role: 'Senior Clinical Pharmacist & Drug Safety Specialist (PharmD)',
    badge: 'Medical Review Board Member',
    educationShort: 'Doctor of Pharmacy (PharmD) - UCSF School of Pharmacy',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    aboutSub: 'Board-Certified Pharmacotherapy Specialist (BCPS)',
    educationList: [
      'Doctor of Pharmacy (PharmD) – University of California, San Francisco (UCSF)',
      'Clinical Pharmacy Residency – UCSF Medical Center',
      'Bachelor of Science (BS) in Chemistry – Boston University'
    ],
    bioParagraphs: [
      'Dr. Elena Rostova is a licensed pharmacist and drug safety expert with extensive experience in inpatient pharmacy management, clinical counseling, and therapeutic drug monitoring. She is a Board-Certified Pharmacotherapy Specialist (BCPS) and has practiced in several major medical centers across California.',
      'At Medicare, Dr. Rostova is responsible for verifying the accuracy of drug profiles, dosage guidelines, drug interaction profiles, and warning labels. She reviews clinical data to ensure that all information matches the latest guidelines from the FDA, CDC, and other major US medical boards. Her passion is helping patients understand their medication regimens, manage potential side effects, and optimize their treatment outcomes.'
    ],
    research: 'Co-Investigator, Impact of Pharmacist-Led Medication Reconciliation on Hospital Readmission Rates, UCSF Medical Center, 2018 – 2020.',
    grants: [
      'Clinical Practice Pharmacy Advancement Grant – California Society of Health-System Pharmacists (CSHP)',
      'Patient Safety Research Initiative Grant – American Society of Health-System Pharmacists (ASHP)'
    ],
    interests: 'Pharmacotherapy Optimization, Medication Safety and Error Prevention, and Patient Education.',
    affiliations: [
      'American Society of Health-System Pharmacists (ASHP)',
      'American College of Clinical Pharmacy (ACCP)',
      'California Society of Health-System Pharmacists (CSHP)'
    ],
    service: 'Member, CSHP Professional Practice Committee; Clinical Preceptor, UCSF School of Pharmacy.',
    conclusion: 'Dr. Elena Rostova applies her comprehensive clinical pharmacy experience to review medication profiles and provide patients with safe, evidence-based guidelines on drug safety.'
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
          setAuthor(authorsData[authorSlug] || null);
        }
      } catch (err) {
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
