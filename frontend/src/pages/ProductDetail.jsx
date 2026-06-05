import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Form, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useCart } from '../context/CartContext';

const getActiveIngredient = (name) => {
  if (!name) return 'Active Ingredient';
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('glucophage') || lowercaseName.includes('metformin')) return 'Metformin HCl';
  if (lowercaseName.includes('lantus') || lowercaseName.includes('insulin')) return 'Insulin Glargine';
  if (lowercaseName.includes('diabeta') || lowercaseName.includes('glyburide')) return 'Glyburide';
  if (lowercaseName.includes('viagra') || lowercaseName.includes('sildenafil')) return 'Sildenafil Citrate';
  if (lowercaseName.includes('duodart')) return 'Dutasteride / Tamsulosin';
  if (lowercaseName.includes('propecia') || lowercaseName.includes('finasteride')) return 'Finasteride';
  if (lowercaseName.includes('systane')) return 'Polyethylene Glycol / Propylene Glycol';
  if (lowercaseName.includes('lumigan') || lowercaseName.includes('bimatoprost')) return 'Bimatoprost';
  if (lowercaseName.includes('alaway') || lowercaseName.includes('ketotifen')) return 'Ketotifen Fumarate';
  if (lowercaseName.includes('ventolin') || lowercaseName.includes('albuterol')) return 'Albuterol Sulfate';
  if (lowercaseName.includes('symbicort')) return 'Budesonide / Formoterol Fumarate';
  if (lowercaseName.includes('singulair') || lowercaseName.includes('montelukast')) return 'Montelukast Sodium';
  if (lowercaseName.includes('cetaphil')) return 'Moisturizing Base';
  if (lowercaseName.includes('differin') || lowercaseName.includes('adapalene')) return 'Adapalene';
  if (lowercaseName.includes('cicaplast')) return 'Panthenol / Madecassoside';
  if (lowercaseName.includes('cozaar') || lowercaseName.includes('losartan')) return 'Losartan Potassium';
  if (lowercaseName.includes('diovan') || lowercaseName.includes('valsartan')) return 'Valsartan';
  if (lowercaseName.includes('cardizem') || lowercaseName.includes('diltiazem')) return 'Diltiazem Hydrochloride';
  if (lowercaseName.includes('premarin')) return 'Conjugated Estrogens';
  if (lowercaseName.includes('yaz')) return 'Drospirenone / Ethinyl Estradiol';
  if (lowercaseName.includes('caltrate')) return 'Calcium Carbonate / Vitamin D3';
  if (lowercaseName.includes('amoxil') || lowercaseName.includes('amoxicillin')) return 'Amoxicillin';
  if (lowercaseName.includes('zithromax') || lowercaseName.includes('azithromycin')) return 'Azithromycin';
  if (lowercaseName.includes('cipro') || lowercaseName.includes('ciprofloxacin')) return 'Ciprofloxacin';
  if (lowercaseName.includes('iverheal') || lowercaseName.includes('ivermectin') || lowercaseName.includes('mectizan')) return 'Ivermectin';
  if (lowercaseName.includes('wormall') || lowercaseName.includes('albendazole')) return 'Albendazole';
  return 'Active Ingredient';
};

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mock Reviews
  const mockReviews = [
    { id: 1, author: "John D.", rating: 5, date: "October 12, 2025", content: "Excellent quality and fast shipping." },
    { id: 2, author: "Sarah M.", rating: 4, date: "November 03, 2025", content: "Worked well as expected. Good price." },
    { id: 3, author: "Michael T.", rating: 5, date: "January 15, 2026", content: "Highly recommended for anyone needing this." }
  ];

  useEffect(() => {
    // Scroll to top when loading a new product
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch Product
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const prodRes = await axios.get(`${API_URL}/products/${id}`);
      setProduct(prodRes.data);
      
      // Fetch Related
      const relatedRes = await axios.get(`${API_URL}/products/${id}/related`);
      setRelatedProducts(relatedRes.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (packSize = null, priceOverride = null) => {
    const qty = packSize ? (quantities[packSize] || 1) : (quantities['default'] || 1);
    addToCart(product, packSize, qty, priceOverride);
    
    // Custom toast notification instead of browser alert
    setToastMessage(`Added ${qty}x ${product.name} to cart.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleQuantityChange = (packSize, val) => {
    setQuantities(prev => ({ ...prev, [packSize || 'default']: parseInt(val) || 1 }));
  };

  const handleBuyNow = (packSize = null, priceOverride = null) => {
    handleAddToCart(packSize, priceOverride);
    // Custom toast notification for checkout transition
    setToastMessage("Redirecting to secure checkout...");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

  return (
    <>
      <Header />
      
      <Container className="my-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none">Products</Link></li>
            <li className="breadcrumb-item"><Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-decoration-none">{product.category}</Link></li>
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
              {product.category === 'Antibiotics' || product.category === 'Diabetes' || product.category === 'Asthma' || product.category === 'Blood Pressure' || product.category === 'Men\'s Health' || product.category === 'Women\'s Health' ? (
                <Badge bg="danger" className="px-3 py-2 text-uppercase fw-bold" style={{ borderRadius: '6px' }}><i className="bi bi-file-earmark-medical me-1"></i> Rx Required</Badge>
              ) : (
                <Badge bg="secondary" className="px-3 py-2 text-uppercase fw-bold" style={{ borderRadius: '6px' }}>OTC Product</Badge>
              )}
            </div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '2.2rem', color: 'var(--secondary-color)' }}>{product.name}</h1>
            <p className="text-muted mb-3 fw-500">By <span className="text-dark">{product.manufacturer || 'Generic Pharma'}</span></p>
            
            {/* Medical Reviewer Banner */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-4 bg-light p-2 px-3 rounded-pill border shadow-xs" style={{ width: 'fit-content', fontSize: '0.8rem' }}>
              <span className="d-flex align-items-center fw-bold text-success">
                <i className="bi bi-patch-check-fill me-1"></i> Medically Reviewed
              </span>
              <span className="text-muted">|</span>
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" 
                className="rounded-circle" 
                style={{ width: '22px', height: '22px', objectFit: 'cover', border: '1px solid #ddd' }} 
                alt="Dr. Sarah Jenkins" 
              />
              <span className="text-secondary">
                By <Link to="/author/sarah-jenkins" className="fw-bold text-decoration-none text-dark hover-primary-text">Dr. Sarah Jenkins, MD, PharmD</Link>
              </span>
              <span className="text-muted">•</span>
              <span className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>Harvard Medical School</span>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <span className="text-warning fs-5 me-2">★★★★☆</span>
              <span className="text-muted">(12 Reviews)</span>
            </div>

            <h2 className="text-primary fw-bold mb-3" style={{ fontSize: '2rem' }}>${parseFloat(product.price).toFixed(2)}</h2>
            
            <p className="mb-4 text-secondary lh-lg">{product.description}</p>
            
            {/* Pack Sizes Table */}
            {product.pack_sizes && product.pack_sizes.length > 0 ? (
              <div className="mb-4">
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
                              variant="warning" 
                              className="fw-bold px-4 rounded-pill shadow-sm text-dark" 
                              style={{backgroundColor: '#ffdb15', border: 'none'}}
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
                    <strong className="text-dark">{getActiveIngredient(product.name)}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-white rounded border border-xs">
                    <span className="text-muted d-block small">Prescription Status</span>
                    <strong className="text-dark">
                      {product.category === 'Antibiotics' || product.category === 'Diabetes' || product.category === 'Asthma' || product.category === 'Blood Pressure' || product.category === 'Men\'s Health' || product.category === 'Women\'s Health' ? 'Rx Required (FDA)' : 'Over The Counter (OTC)'}
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

            {/* Dr. Sarah's Expert Advice callout card */}
            <div className="card border-start border-4 border-success bg-light p-3 mb-4 rounded-3 shadow-xs border-0">
              <div className="d-flex align-items-center mb-2">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100" className="rounded-circle me-2 border border-2 border-white shadow-sm" style={{ width: '36px', height: '36px', objectFit: 'cover' }} alt="Dr. Sarah Jenkins" />
                <div>
                  <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.85rem' }}>Dr. Sarah's Clinical Advice</h6>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>Medical Review Board Member</span>
                </div>
              </div>
              <p className="text-secondary small mb-2 lh-base" style={{ fontStyle: 'italic' }}>
                "As a clinical pharmacologist, I advise taking this medication exactly as directed by your healthcare provider. Ensure you discuss any other ongoing prescriptions or potential allergies before starting treatment."
              </p>
              <Link to="/author/sarah-jenkins" className="small fw-bold text-primary text-decoration-none d-inline-flex align-items-center" style={{ fontSize: '0.8rem' }}>
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
                          <img 
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400" 
                            className="rounded-4 img-fluid shadow-sm border border-3 border-white" 
                            style={{ maxWidth: '160px', objectFit: 'cover' }} 
                            alt="Dr. Sarah Jenkins" 
                          />
                        </Col>
                        <Col md={9}>
                          <Badge bg="success" className="mb-2 px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', borderRadius: '50px' }}>
                            ✓ Chief Medical Reviewer
                          </Badge>
                          <h4 className="fw-bold text-dark mb-1">Dr. Sarah Jenkins, MD, Pharm D</h4>
                          <p className="text-muted small mb-3">
                            <strong>Education:</strong> Harvard Medical School | Massachusetts Institute of Technology (MIT) | Johns Hopkins
                          </p>
                          <p className="text-secondary small lh-lg">
                            Dr. Sarah Jenkins is the Chief Medical Reviewer at Medicare Shop. With over 10 years of clinical and research experience at institutions like the Mayo Clinic and Johns Hopkins Hospital, she reviews all drug profiles, dosages, and safety data. She ensures that everything complies with clinical evidence and the latest safety guidelines from the FDA and CDC.
                          </p>
                          <div className="d-flex gap-3 mt-3">
                            <Link to="/author/sarah-jenkins" className="btn btn-sm btn-outline-primary px-3 rounded-pill fw-bold">
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

      {/* Toast Notification */}
      <div 
        className="position-fixed bottom-0 end-0 p-3" 
        style={{ zIndex: 1100, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transform: showToast ? 'translateY(0)' : 'translateY(100px)', opacity: showToast ? 1 : 0 }}
      >
        <div className="toast show align-items-center text-white bg-dark border-0 shadow-lg rounded-3" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex p-2">
            <div className="toast-body d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-success fs-5"></i>
              <span className="fw-500">{toastMessage}</span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              onClick={() => setShowToast(false)} 
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
