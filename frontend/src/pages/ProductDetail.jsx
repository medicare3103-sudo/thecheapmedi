import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Form, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

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
      const prodRes = await axios.get(`http://127.0.0.1:8000/products/${id}`);
      setProduct(prodRes.data);
      
      // Fetch Related
      const relatedRes = await axios.get(`http://127.0.0.1:8000/products/${id}/related`);
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
    alert(`Added ${qty} to cart!`);
  };

  const handleQuantityChange = (packSize, val) => {
    setQuantities(prev => ({ ...prev, [packSize || 'default']: parseInt(val) || 1 }));
  };

  const handleBuyNow = (packSize = null, priceOverride = null) => {
    handleAddToCart(packSize, priceOverride);
    // In a real app, this would navigate to checkout
    alert("Proceeding to secure checkout!");
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
            <Badge bg="primary" className="mb-2 px-3 py-2">{product.category}</Badge>
            <h1 className="fw-bold mb-2">{product.name}</h1>
            <p className="text-muted mb-3 fw-500">By <span className="text-dark">{product.manufacturer || 'Generic Pharma'}</span></p>
            
            <div className="mb-3 d-flex align-items-center">
              <span className="text-warning fs-5 me-2">★★★★☆</span>
              <span className="text-muted">(12 Reviews)</span>
            </div>

            <h2 className="text-primary fw-bold mb-3">${parseFloat(product.price).toFixed(2)}</h2>
            
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
                  <span className="fw-bold text-dark">IN STOCK</span>
                ) : (
                  <span className="fw-bold text-danger">OUT OF STOCK</span>
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
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <Tabs defaultActiveKey="description" id="product-detail-tabs" className="mb-4 custom-tabs">
                  <Tab eventKey="description" title="Description">
                    <h5 className="fw-bold mb-3">Product Description</h5>
                    <p className="text-secondary lh-lg">{product.description}</p>
                    <p className="text-secondary lh-lg">This medication is manufactured by highly reputable pharmaceutical companies and undergoes strict quality control to ensure maximum efficacy and safety.</p>
                  </Tab>
                  
                  <Tab eventKey="uses" title="Uses">
                    <h5 className="fw-bold mb-3">Indications & Uses</h5>
                    <p className="text-secondary lh-lg">{product.uses || "Information regarding specific uses is currently unavailable. Please consult your physician."}</p>
                  </Tab>
                  
                  <Tab eventKey="dosage" title="Dosage">
                    <h5 className="fw-bold mb-3">Dosage & Administration</h5>
                    <p className="text-secondary lh-lg">{product.dosage || "Follow your doctor's instructions. Do not exceed the prescribed dosage."}</p>
                  </Tab>
                  
                  <Tab eventKey="side_effects" title="Side Effects">
                    <h5 className="fw-bold mb-3">Possible Side Effects</h5>
                    <p className="text-secondary lh-lg">{product.side_effects || "Like all medicines, this can cause side effects, although not everybody gets them. Contact your doctor if you experience any severe reactions."}</p>
                  </Tab>
                  
                  <Tab eventKey="reviews" title="Reviews (3)">
                    <h5 className="fw-bold mb-4">Customer Reviews</h5>
                    <div className="reviews-list">
                      {mockReviews.map(review => (
                        <div key={review.id} className="mb-4 border-bottom pb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold">{review.author}</span>
                            <span className="text-muted small">{review.date}</span>
                          </div>
                          <div className="text-warning mb-2">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                          </div>
                          <p className="text-secondary mb-0">{review.content}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline-primary" className="mt-2 fw-500">Write a Review</Button>
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
