import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Form, Badge } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useCart } from '../context/CartContext';

const getActiveIngredient = (name) => {
  if (!name) return 'Active Ingredient';
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('gokshura')) return 'Gokshura / Puga / Varuna';
  if (lowercaseName.includes('moisturizer')) return 'Natural Emollients';
  if (lowercaseName.includes('abacavir') && lowercaseName.includes('lamivudine')) return 'Abacavir / Lamivudine';
  if (lowercaseName.includes('abacavir')) return 'Abacavir Sulfate';
  if (lowercaseName.includes('abatacept')) return 'Abatacept';
  if (lowercaseName.includes('abiraterone')) return 'Abiraterone Acetate';
  if (lowercaseName.includes('acamprosate')) return 'Acamprosate';
  if (lowercaseName.includes('acarbose') && lowercaseName.includes('metformin')) return 'Acarbose / Metformin';
  if (lowercaseName.includes('acarbose')) return 'Acarbose';
  if (lowercaseName.includes('acebrophylline')) return 'Acebrophylline';
  if (lowercaseName.includes('aceclofenac')) return 'Aceclofenac / Paracetamol';
  if (lowercaseName.includes('acetazolamide')) return 'Acetazolamide';
  if (lowercaseName.includes('acetylcysteine')) return 'Acetylcysteine';
  if (lowercaseName.includes('acitretin')) return 'Acitretin';
  if (lowercaseName.includes('acyclovir')) return 'Acyclovir';
  if (lowercaseName.includes('adapalene') && lowercaseName.includes('clindamycin')) return 'Adapalene / Clindamycin';
  if (lowercaseName.includes('adapalene')) return 'Adapalene';
  if (lowercaseName.includes('adefovir')) return 'Adefovir';
  if (lowercaseName.includes('afatinib')) return 'Afatinib Dimaleate';
  if (lowercaseName.includes('albendazole')) return 'Albendazole';
  if (lowercaseName.includes('alectinib')) return 'Alectinib';
  if (lowercaseName.includes('alendronate')) return 'Alendronate Sodium';
  if (lowercaseName.includes('alfacalcidol')) return 'Alfacalcidol';
  if (lowercaseName.includes('alfuzosin')) return 'Alfuzosin';
  if (lowercaseName.includes('tretinoin') || lowercaseName.includes('retinoic')) return 'Tretinoin';
  return 'Active Ingredient';
};

const defaultReviewer = {
  slug: 'sarah-jenkins',
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
  isDoctor: true
};

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewer, setReviewer] = useState(null);
  const [writer, setWriter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  // Mock Reviews
  const mockReviews = [
    { id: 1, author: "John D.", rating: 5, date: "October 12, 2025", content: "Excellent quality and fast shipping." },
    { id: 2, author: "Sarah M.", rating: 4, date: "November 03, 2025", content: "Worked well as expected. Good price." },
    { id: 3, author: "Michael T.", rating: 5, date: "January 15, 2026", content: "Highly recommended for anyone needing this." }
  ];

  async function fetchProductDetails() {
    setIsLoading(true);
    try {
      // Fetch Product
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000');
      const prodRes = await axios.get(`${API_URL}/products/${slug}`);
      const productData = prodRes.data;
      setProduct(productData);
      
      // Fetch Reviewer (Doctor)
      if (productData.reviewer_slug) {
        try {
          const revRes = await axios.get(`${API_URL}/authors/${productData.reviewer_slug}`);
          setReviewer(revRes.data);
        } catch (e) {
          console.error("Failed to fetch reviewer profile:", e);
        }
      } else {
        setReviewer(null);
      }

      // Fetch Writer (Author)
      if (productData.writer_slug) {
        try {
          const wrRes = await axios.get(`${API_URL}/authors/${productData.writer_slug}`);
          setWriter(wrRes.data);
        } catch (e) {
          console.error("Failed to fetch writer profile:", e);
        }
      } else {
        setWriter(null);
      }

      // Fetch Related
      const relatedRes = await axios.get(`${API_URL}/products/${slug}/related`);
      setRelatedProducts(relatedRes.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Scroll to top when loading a new product
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [slug]);

  const handleAddToCart = (packSize = null, priceOverride = null) => {
    const qty = packSize ? (quantities[packSize] || 1) : (quantities['default'] || 1);
    addToCart(product, packSize, qty, priceOverride);
  };

  const handleQuantityChange = (packSize, val) => {
    setQuantities(prev => ({ ...prev, [packSize || 'default']: parseInt(val) || 1 }));
  };

  const handleBuyNow = (packSize = null, priceOverride = null) => {
    // Add to cart directly, which triggers our beautiful global toast,
    // and route directly to the secure checkout page.
    handleAddToCart(packSize, priceOverride);
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Container className="my-5 text-center min-vh-100 py-5">
          <h4>Loading product details...</h4>
        </Container>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <Container className="my-5 text-center min-vh-100 py-5">
          <h4>Product not found.</h4>
          <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
        </Container>
        <Footer />
      </>
    );
  }

  // Reviewer setup: dynamic author or fallback to product-level doctor details or defaultReviewer
  const activeReviewer = reviewer || {
    slug: product.reviewer_slug || 'sarah-jenkins',
    name: product.referred_by_doctor || defaultReviewer.name,
    role: product.doctor_title ? `${product.doctor_title}` : defaultReviewer.role,
    educationShort: product.doctor_institution || defaultReviewer.educationShort,
    image: product.doctor_image_url || defaultReviewer.image,
    badge: 'Medical Expert Board Member',
    bioParagraphs: defaultReviewer.bioParagraphs
  };

  const activeWriter = writer;

  const doctorAdvice = product.doctor_advice || "As a clinical pharmacologist, I advise taking this medication exactly as directed by your healthcare provider. Ensure you discuss any other ongoing prescriptions or potential allergies before starting treatment.";
  const rxRequired = product.rx_required !== undefined ? product.rx_required : (product.category === 'Antibiotics' || product.category === 'Diabetes' || product.category === 'Asthma' || product.category === 'Blood Pressure' || product.category === 'Men\'s Health' || product.category === 'Women\'s Health' || product.category === 'Anti Cancer' || product.category === 'HIV & Herpes' || product.category === 'Pain Relief');

  const getProductDetailPriceDisplay = () => {
    if (product.pack_sizes && product.pack_sizes.length > 0) {
      const prices = product.pack_sizes.map(p => parseFloat(p.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return `$${minPrice.toFixed(2)}`;
      }
      return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    }
    return `$${parseFloat(product.price).toFixed(2)}`;
  };

  return (
    <>
      <Header />
      
      <Container className="my-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none">Products</Link></li>
            <li className="breadcrumb-item"><Link to={`/category/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="text-decoration-none">{product.category}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* TOP SECTION: Image & Main Details */}
        <Row className="mb-5 bg-white p-4 rounded-3 shadow-sm">
          {/* Product Image */}
          <Col md={5} className="mb-4 mb-md-0 d-flex justify-content-center align-items-center bg-light rounded-3 p-4">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="img-fluid" style={{ maxHeight: '400px', objectFit: 'contain' }} />
            ) : (
              <div className="text-muted">No Image Available</div>
            )}
          </Col>

          {/* Product Info */}
          <Col md={7} className="ps-md-5">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge bg="primary" className="px-3 py-2" style={{ borderRadius: '6px' }}>{product.category}</Badge>
              {rxRequired ? (
                <Badge bg="danger" className="px-3 py-2 text-uppercase fw-bold" style={{ borderRadius: '6px' }}><i className="bi bi-file-earmark-medical me-1"></i> Rx Required</Badge>
              ) : (
                <Badge bg="secondary" className="px-3 py-2 text-uppercase fw-bold" style={{ borderRadius: '6px' }}>OTC Product</Badge>
              )}
            </div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '2.2rem', color: 'var(--secondary-color)' }}>{product.name}</h1>
            <p className="text-muted mb-3 fw-500">By <span className="text-dark">{product.manufacturer || 'Generic Pharma'}</span></p>
            
            {/* Writer & Medical Reviewer Banner */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-4 bg-light p-2 px-3 rounded-pill border shadow-xs" style={{ width: 'fit-content', fontSize: '0.8rem' }}>
              {activeWriter && (
                <>
                  <span className="text-secondary">
                    Written by <Link to={`/author/${activeWriter.slug}`} className="fw-bold text-dark text-decoration-none hover-underline">{activeWriter.name}</Link>
                  </span>
                  <span className="text-muted">|</span>
                </>
              )}
              <span className="d-flex align-items-center fw-bold text-success">
                <i className="bi bi-patch-check-fill me-1"></i> Medically Reviewed
              </span>
              <span className="text-muted">|</span>
              {activeReviewer.image && (
                <img 
                  src={activeReviewer.image} 
                  className="rounded-circle" 
                  style={{ width: '22px', height: '22px', objectFit: 'cover', border: '1px solid #ddd' }} 
                  alt={activeReviewer.name} 
                />
              )}
              <span className="text-secondary">
                By <Link to={`/author/${activeReviewer.slug}`} className="fw-bold text-dark text-decoration-none hover-underline">{activeReviewer.name}</Link>
              </span>
              {activeReviewer.role && (
                <>
                  <span className="text-muted">•</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{activeReviewer.role}</span>
                </>
              )}
            </div>

            <div className="mb-3 d-flex align-items-center">
              <span className="text-warning fs-5 me-2">★★★★☆</span>
              <span className="text-muted">(12 Reviews)</span>
              <span className="text-muted mx-2">•</span>
              <span className="text-primary cursor-pointer hover-underline small fw-bold d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => {
                const element = document.getElementById('product-detail-tabs-tab-reviews');
                if (element) element.click();
                document.getElementById('product-detail-tabs')?.scrollIntoView({ behavior: 'smooth' });
              }}><i className="bi bi-chat-left-text me-1"></i> Talk to Expert</span>
            </div>

            {/* Medicine Specifications Table */}
            <div className="mb-4 rounded-3 overflow-hidden border shadow-xs" style={{ borderColor: '#e2e8f0' }}>
              <table className="table mb-0 align-middle" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <td className="py-2.5 px-4 fw-bold text-dark" style={{ width: '35%', fontSize: '0.9rem' }}>Active Ingredient:</td>
                    <td className="py-2.5 px-4 text-secondary" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                      {product.active_ingredient || getActiveIngredient(product.name)}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                    <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Indication:</td>
                    <td className="py-2.5 px-4 text-secondary" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                      {product.indication || 'Erectile Dysfunction'}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Manufacturer:</td>
                    <td className="py-2.5 px-4 text-primary fw-semibold" style={{ fontStyle: 'italic', fontSize: '0.9rem', textDecoration: 'underline' }}>
                      {product.manufacturer || 'Centurion Laboratories Pvt. Ltd.'}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                    <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Packaging:</td>
                    <td className="py-2.5 px-4 text-secondary" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                      {product.packaging || '10 tablets in 1 strip'}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Strength:</td>
                    <td className="py-2.5 px-4 text-secondary" style={{ fontSize: '0.9rem' }}>
                      {product.strength || '200mg'}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#ffffff' }}>
                    <td className="py-2.5 px-4 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Delivery Time:</td>
                    <td className="py-2.5 px-4 text-secondary" style={{ fontSize: '0.9rem' }}>
                      {product.delivery_time || '6 To 15 days'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Categories & Social Share */}
            <div className="d-flex flex-column gap-2 mb-4" style={{ fontSize: '0.85rem' }}>
              <div className="text-muted">
                <strong className="text-dark">Categories: </strong> 
                <span className="text-primary cursor-pointer" style={{ textDecoration: 'underline' }}>{product.brand || product.category}</span>, 
                <span className="text-primary cursor-pointer" style={{ textDecoration: 'underline' }}> {product.indication || 'Erectile Dysfunction'}</span>, 
                <span className="text-primary cursor-pointer" style={{ textDecoration: 'underline' }}> {product.category}</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted mt-1">
                <strong className="text-dark">Share: </strong>
                <a href="#" className="text-secondary mx-1" onClick={(e) => e.preventDefault()}><i className="bi bi-facebook fs-6"></i></a>
                <a href="#" className="text-secondary mx-1" onClick={(e) => e.preventDefault()}><i className="bi bi-twitter-x fs-6"></i></a>
                <a href="#" className="text-secondary mx-1" onClick={(e) => e.preventDefault()}><i className="bi bi-pinterest fs-6"></i></a>
                <a href="#" className="text-secondary mx-1" onClick={(e) => e.preventDefault()}><i className="bi bi-linkedin fs-6"></i></a>
                <a href="#" className="text-secondary mx-1" onClick={(e) => e.preventDefault()}><i className="bi bi-whatsapp fs-6"></i></a>
              </div>
            </div>

            <h2 className="text-primary fw-bold mb-3" style={{ fontSize: '2rem' }}>{getProductDetailPriceDisplay()}</h2>
            
            <p className="mb-4 text-secondary lh-lg">{product.description}</p>
            
            {/* Pack Sizes Table */}
            {product.pack_sizes && product.pack_sizes.length > 0 ? (
              <div className="mb-4">
                {/* Desktop Variations Table */}
                <div className="d-none d-md-block">
                  <table className="table table-bordered mb-0 align-middle text-center">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 small fw-bold">Pack Size</th>
                        <th className="py-3 small fw-bold">Qty</th>
                        <th className="py-3 small fw-bold">Price</th>
                        <th className="py-3 small fw-bold border-start-0 border-end-0"></th>
                        <th className="py-3 small fw-bold">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.pack_sizes.map((pack, idx) => {
                        const qty = quantities[pack.size] || 1;
                        const sizeMatch = pack.size.match(/(\d+)/);
                        const tabletCount = sizeMatch ? parseInt(sizeMatch[1]) : 1;
                        const unitPrice = (pack.price / tabletCount).toFixed(2);
                        return (
                          <tr key={idx}>
                            <td className="py-3 text-secondary">{pack.size}</td>
                            <td className="py-3" style={{width: '100px'}}>
                              <Form.Select 
                                size="sm"
                                value={qty} 
                                onChange={(e) => handleQuantityChange(pack.size, e.target.value)}
                                className="text-center mx-auto shadow-sm"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </Form.Select>
                            </td>
                            <td className="py-3 fw-500 text-secondary">${parseFloat(pack.price).toFixed(2)}</td>
                            <td className="py-3">
                              <Button 
                                variant="primary" 
                                className="fw-bold px-4 rounded-pill shadow-sm text-white border-0" 
                                onClick={() => handleAddToCart(pack.size, pack.price)}
                              >
                                Add to Cart
                              </Button>
                            </td>
                            <td className="py-3 text-secondary">${unitPrice}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Variations Card List */}
                <div className="d-block d-md-none">
                  {product.pack_sizes.map((pack, idx) => {
                    const qty = quantities[pack.size] || 1;
                    const sizeMatch = pack.size.match(/(\d+)/);
                    const tabletCount = sizeMatch ? parseInt(sizeMatch[1]) : 1;
                    const unitPrice = (pack.price / tabletCount).toFixed(2);
                    return (
                      <div key={idx} className="border rounded-3 p-3 mb-3 bg-light shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h6 className="fw-bold mb-0 text-dark">{pack.size}</h6>
                            <small className="text-secondary">Unit Price: ${unitPrice}</small>
                          </div>
                          <div className="text-end">
                            <h5 className="fw-bold text-primary mb-0">${parseFloat(pack.price).toFixed(2)}</h5>
                          </div>
                        </div>
                        
                        <Row className="g-2 align-items-center">
                          <Col xs={4}>
                            <Form.Select 
                              size="sm"
                              value={qty} 
                              onChange={(e) => handleQuantityChange(pack.size, e.target.value)}
                              className="py-2 text-center shadow-sm"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>Qty: {n}</option>
                              ))}
                            </Form.Select>
                          </Col>
                          <Col xs={8}>
                            <Button 
                              variant="primary" 
                              className="w-100 fw-bold py-2 rounded-2 shadow-sm text-white border-0"
                              onClick={() => handleAddToCart(pack.size, pack.price)}
                            >
                              Add to Cart
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-3 mb-4">
                <div className="d-flex align-items-center" style={{ width: '120px' }}>
                  <Form.Control 
                    type="number" 
                    min="1" 
                    max={product.stock > 0 ? product.stock : 1}
                    value={quantities['default'] || 1} 
                    onChange={(e) => handleQuantityChange('default', e.target.value)}
                    disabled={product.stock === 0}
                    className="fw-bold text-center border-primary"
                  />
                </div>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="fw-bold px-4"
                  onClick={() => handleAddToCart()}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="fw-bold px-5"
                  onClick={() => handleBuyNow()}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
              </div>
            )}
            
            {product.pack_sizes && product.pack_sizes.length > 0 && (
              <div className="text-success fw-bold mb-4 d-flex align-items-center">
                <i className="bi bi-percent fs-5 me-2"></i>Save more with our biggest pack
              </div>
            )}

            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <span className="fw-500 me-2 text-muted">Availability:</span>
                {product.stock > 0 ? (
                  <span className="fw-bold text-dark d-flex align-items-center">
                    <span className="status-dot pulsing bg-success d-inline-block rounded-circle me-2"></span>
                    IN STOCK
                  </span>
                ) : (
                  <span className="fw-bold text-danger d-flex align-items-center">
                    <span className="status-dot bg-danger d-inline-block rounded-circle me-2"></span>
                    OUT OF STOCK
                  </span>
                )}
              </div>
              <div className="text-muted small fw-bold">SKU: CMS{product.id * 1000 + 72}</div>
            </div>
            
            <div className="d-flex flex-wrap gap-3 mt-4 text-muted small fw-500">
              <div className="d-flex align-items-center">
                <i className="bi bi-shield-check me-2 fs-5 text-success"></i> Secure Checkout
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-box-seam me-2 fs-5 text-primary"></i> Discreet Packaging
              </div>
            </div>

            <hr className="my-4" />

            {/* Clinical Drug Facts */}
            <div className="bg-light p-3 rounded-3 border mb-4 shadow-sm" style={{ borderColor: '#f1f5f9' }}>
              <h5 className="fw-bold mb-3 text-dark d-flex align-items-center" style={{ fontSize: '0.95rem' }}>
                <i className="bi bi-info-circle-fill text-primary me-2"></i> Clinical Drug Facts
              </h5>
              <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                <div className="col-sm-6">
                  <div className="p-2 bg-white rounded border border-xs">
                    <span className="text-muted d-block small">Active Ingredient</span>
                    <strong className="text-dark">{product.active_ingredient || getActiveIngredient(product.name)}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-white rounded border border-xs">
                    <span className="text-muted d-block small">Prescription Status</span>
                    <strong className="text-dark">
                      {rxRequired ? 'Rx Required (FDA)' : 'Over The Counter (OTC)'}
                    </strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-white rounded border border-xs">
                    <span className="text-muted d-block small">Therapeutic Class</span>
                    <strong className="text-dark">{product.category} Care</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-white rounded border border-xs">
                    <span className="text-muted d-block small">Review Board</span>
                    <strong className="text-success"><i className="bi bi-shield-fill-check me-1"></i>FDA Compliant</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor's Expert Advice callout card */}
            <div className="card border-start border-4 border-success bg-light p-3 mb-4 rounded-3 shadow-xs border-0">
              <div className="d-flex align-items-center mb-2">
                {activeReviewer.image && (
                  <img src={activeReviewer.image} className="rounded-circle me-2 border border-2 border-white shadow-sm" style={{ width: '36px', height: '36px', objectFit: 'cover' }} alt={activeReviewer.name} />
                )}
                <div>
                  <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.85rem' }}>{activeReviewer.name === "Dr. Sarah Jenkins" ? "Dr. Sarah's" : activeReviewer.name}'s Clinical Advice</h6>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{activeReviewer.role}</span>
                </div>
              </div>
              <p className="text-secondary small mb-2 lh-base" style={{ fontStyle: 'italic' }}>
                "{doctorAdvice}"
              </p>
              <Link to={`/author/${activeReviewer.slug}`} className="small fw-bold text-primary text-decoration-none d-inline-flex align-items-center" style={{ fontSize: '0.8rem' }}>
                View Full Reviewer Bio & Credentials <i className="bi bi-chevron-right ms-1" style={{ fontSize: '0.7rem' }}></i>
              </Link>
            </div>
          </Col>
        </Row>

        {/* What is Product Section */}
        <Row className="mb-5 bg-light p-4 rounded-3">
          <Col>
            <h3 className="fw-bold mb-3">What is {product.name}</h3>
            <p className="text-secondary lh-lg mb-0">
              {product.description || `Information regarding ${product.name} is currently limited.`}
              {product.uses ? ` It is generally indicated for ${product.uses}.` : ''}
              {` This medication works by addressing the underlying conditions associated with its active ingredients to promote better health outcomes.`}
            </p>
          </Col>
        </Row>

        {/* BOTTOM SECTION: Detailed Tabs */}
        <Row className="mb-5">
          <Col xs={12}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <Tabs defaultActiveKey="description" id="product-detail-tabs" className="mb-4 custom-tabs">
                  <Tab eventKey="description" title="Description">
                    <h5 className="fw-bold mb-3 text-dark">Product Description</h5>
                    <p className="text-secondary lh-lg">{product.description}</p>
                    <p className="text-secondary lh-lg">This medication is manufactured by highly reputable pharmaceutical companies and undergoes strict quality control to ensure maximum efficacy and safety.</p>
                  </Tab>
                  
                  <Tab eventKey="uses" title="Uses">
                    <h5 className="fw-bold mb-3 text-dark">Indications & Uses</h5>
                    <p className="text-secondary lh-lg">{product.uses || "Information regarding specific uses is currently unavailable. Please consult your physician."}</p>
                  </Tab>
                  
                  <Tab eventKey="dosage" title="Dosage">
                    <h5 className="fw-bold mb-3 text-dark">Dosage & Administration</h5>
                    <p className="text-secondary lh-lg">{product.dosage || "Follow your doctor's instructions. Do not exceed the prescribed dosage."}</p>
                  </Tab>
                  
                  <Tab eventKey="side_effects" title="Side Effects">
                    <h5 className="fw-bold mb-3 text-dark">Possible Side Effects</h5>
                    <p className="text-secondary lh-lg">{product.side_effects || "Like all medicines, this can cause side effects, although not everybody gets them. Contact your doctor if you experience any severe reactions."}</p>
                  </Tab>
                  
                  <Tab eventKey="reviews" title="Reviews (3)">
                    <h5 className="fw-bold mb-4 text-dark">Customer Reviews</h5>
                    <div className="reviews-list">
                      {mockReviews.map(review => (
                        <div key={review.id} className="mb-4 border-bottom pb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-dark">{review.author}</span>
                            <span className="text-muted small">{review.date}</span>
                          </div>
                          <div className="text-warning mb-2" style={{ letterSpacing: '2px' }}>
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                          </div>
                          <p className="text-secondary mb-0">{review.content}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline-primary" className="mt-2 fw-500 rounded-pill">Write a Review</Button>
                  </Tab>

                  <Tab eventKey="verification" title="Medical Review Board">
                    <div className="py-3">
                      <Row className="align-items-center gy-4">
                        <Col md={3} className="text-center text-md-start">
                          {activeReviewer.image && (
                            <img 
                              src={activeReviewer.image} 
                              className="rounded-4 img-fluid shadow-sm border border-3 border-white" 
                              style={{ maxWidth: '160px', objectFit: 'cover' }} 
                              alt={activeReviewer.name} 
                            />
                          )}
                        </Col>
                        <Col md={9}>
                          <Badge bg="success" className="mb-2 px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', borderRadius: '50px' }}>
                            ✓ {activeReviewer.badge || 'Medical Review Board Member'}
                          </Badge>
                          <h4 className="fw-bold text-dark mb-1">{activeReviewer.name}</h4>
                          <p className="text-muted small mb-3">
                            <strong>Role/Credentials:</strong> {activeReviewer.role}
                          </p>
                          <p className="text-secondary small lh-lg">
                            {activeReviewer.bioParagraphs && activeReviewer.bioParagraphs[0] ? (
                              activeReviewer.bioParagraphs[0]
                            ) : (
                              `${activeReviewer.name} is a distinguished member of The Cheap Pharma Medical Review Board. As a qualified healthcare professional, they review product information, active ingredients, dosage recommendations, and clinical safety details to ensure all content is medically accurate and compliant with high quality healthcare standards.`
                            )}
                          </p>
                          <div className="d-flex gap-3 mt-3">
                            <Link to={`/author/${activeReviewer.slug}`} className="btn btn-sm btn-outline-primary px-3 rounded-pill fw-bold">
                              View Full Bio & Credentials
                            </Link>
                            <Link to="/editorial-policy" className="btn btn-sm btn-link text-decoration-none text-muted fw-bold d-flex align-items-center">
                              Our Editorial Process <i className="bi bi-chevron-right ms-1"></i>
                            </Link>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <Row>
            <Col xs={12}>
              <hr className="my-5" />
              <ProductSection 
                title={`Related Products in ${product.category}`} 
                products={relatedProducts} 
                isLoading={false} 
              />
            </Col>
          </Row>
        )}
      </Container>
      
      <Footer />
    </>
  );
}

export default ProductDetail;
