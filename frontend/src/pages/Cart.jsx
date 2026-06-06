import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Image, Badge, InputGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Cart() {
  const { 
    cartItems, removeFromCart, updateQuantity, cartTotal,
    appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalTotal
  } = useCart();
  
  const navigate = useNavigate();
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(couponCode.trim());
    setIsApplying(false);
    if (res.success) {
      setCouponCode('');
    } else {
      setCouponError(res.message || 'Invalid coupon code.');
    }
  };
  
  // Tipping State
  const [tipType, setTipType] = useState('Amount'); // 'Percentage' or 'Amount'
  const [selectedTip, setSelectedTip] = useState(0); // $ Amount or % Value based on tipType
  const [customTip, setCustomTip] = useState('');
  
  // Calculate final tip in dollars
  const calculatedTip = tipType === 'Amount' 
    ? parseFloat(selectedTip || 0) 
    : parseFloat((finalTotal * (selectedTip / 100)).toFixed(2));
    
  const orderTotal = finalTotal + calculatedTip;

  const handleTipSelect = (val) => {
    setSelectedTip(val);
    setCustomTip('');
  };

  const handleCustomTipChange = (e) => {
    const val = e.target.value;
    setCustomTip(val);
    setSelectedTip(val === '' ? 0 : parseFloat(val));
  };

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header />
      
      <Container className="py-5 flex-grow-1" style={{maxWidth: '1200px'}}>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-5 my-5">
            <i className="bi bi-cart3 text-muted opacity-25" style={{fontSize: '6rem'}}></i>
            <h3 className="mt-4 fw-bold">Your cart is empty</h3>
            <p className="text-muted mb-4">Start exploring our products to add items here.</p>
            <Button as={Link} to="/products" variant="primary" size="lg" className="fw-bold px-5 py-3 rounded-1">
              Start Shopping
            </Button>
          </div>
        ) : (
          <Row className="g-3 g-md-4 g-lg-5">
            {/* Left Column: Cart Items */}
            <Col lg={7} xl={8}>
              <h3 className="fw-bold mb-4">Your cart</h3>
              
              <div className="cart-items-container border-top border-bottom pt-3">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`py-4 d-flex align-items-start ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                    {/* Product Image */}
                    <div className="cart-item-image-container border rounded bg-white p-2 me-3 me-sm-4 shadow-sm">
                      <Image 
                        src={item.image_url || 'https://via.placeholder.com/100'} 
                        alt={item.name} 
                        className="w-100 h-100 object-fit-contain"
                      />
                    </div>
                    
                    {/* Details & Controls */}
                    <div className="flex-grow-1 d-flex flex-column h-100" style={{ minWidth: 0 }}>
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-1">
                        <h5 className="cart-item-title mb-0 text-wrap" style={{ minWidth: 0 }}>
                          <Link to={`/products/${item.id}`} className="text-decoration-none text-dark">
                            {item.name}
                          </Link>
                        </h5>
                        <span className="fw-bold cart-item-price text-nowrap ms-0 ms-sm-2 mt-1 mt-sm-0">${parseFloat(item.price).toFixed(2)}</span>
                      </div>
                      
                      {item.packSize && (
                        <div className="text-primary fw-bold small mb-3">
                          {item.packSize}
                        </div>
                      )}
                      
                      {/* Quantity & Remove */}
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div className="border rounded d-flex align-items-center" style={{width: 'fit-content'}}>
                          <Button 
                            variant="link" 
                            className="text-dark px-3 py-1 border-0 shadow-none text-decoration-none fw-bold fs-5"
                            onClick={() => updateQuantity(item.uniqueId || item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="fw-bold px-3 py-1 border-start border-end" style={{minWidth: '40px', textAlign: 'center'}}>
                            {item.quantity}
                          </span>
                          <Button 
                            variant="link" 
                            className="text-dark px-3 py-1 border-0 shadow-none text-decoration-none fw-bold fs-5"
                            onClick={() => updateQuantity(item.uniqueId || item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button 
                          variant="link" 
                          className="text-muted p-0 text-decoration-none bg-transparent shadow-none"
                          onClick={() => removeFromCart(item.uniqueId || item.id)}
                        >
                          <i className="bi bi-trash fs-5"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trustpilot Reviews Section */}
              <div className="mt-5 pt-4 bg-light p-4 rounded-4 border" style={{ borderColor: '#f1f5f9' }}>
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                      <span className="text-success">★</span> Trustpilot Reviews
                    </h5>
                    <p className="text-muted small mb-0">What our verified buyers are saying about their checkout experience</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success py-2 px-3 fw-bold text-uppercase" style={{ backgroundColor: '#00b67a', fontSize: '0.75rem' }}>
                      Excellent 4.66 / 5
                    </span>
                    <span className="text-muted small fw-bold">(1,889 Reviews)</span>
                  </div>
                </div>

                <Row className="g-3">
                  {/* Trust Rating Card */}
                  <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm p-3 rounded-3" style={{ backgroundColor: '#ffffff' }}>
                      <div className="mb-2">
                        <span className="fw-bold text-dark d-block mb-1">Our Customer Rating</span>
                        <div className="d-flex mb-2" style={{ color: '#00b67a', fontSize: '1.2rem' }}>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-half"></i>
                        </div>
                        <p className="text-secondary small mb-0 lh-base">
                          Our platform is highly trusted by thousands of patients across the USA for providing authentic, affordable, and medically approved prescriptions.
                        </p>
                      </div>
                    </Card>
                  </Col>

                  {/* Review Card 1 */}
                  <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm p-3 rounded-3" style={{ backgroundColor: '#ffffff' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="text-dark small">Robert M.</strong>
                        <div className="d-flex" style={{ color: '#00b67a', fontSize: '0.9rem' }}>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                      <Badge bg="success" className="bg-opacity-10 text-success border border-success-subtle px-2 py-1 mb-2 align-self-start" style={{ fontSize: '0.65rem', borderRadius: '4px' }}>
                        ✓ Verified Customer
                      </Badge>
                      <p className="text-secondary lh-sm mb-0" style={{ fontSize: '0.8rem' }}>
                        "Extremely fast USPS delivery. Ordered my prescription refills last Tuesday, and they arrived in discreet packaging by Friday morning. Very reliable!"
                      </p>
                    </Card>
                  </Col>

                  {/* Review Card 2 */}
                  <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm p-3 rounded-3" style={{ backgroundColor: '#ffffff' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="text-dark small">Antonio Rocca</strong>
                        <div className="d-flex" style={{ color: '#00b67a', fontSize: '0.9rem' }}>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </div>
                      </div>
                      <Badge bg="success" className="bg-opacity-10 text-success border border-success-subtle px-2 py-1 mb-2 align-self-start" style={{ fontSize: '0.65rem', borderRadius: '4px' }}>
                        ✓ Verified Customer
                      </Badge>
                      <p className="text-secondary lh-sm mb-0" style={{ fontSize: '0.8rem' }}>
                        "Excellent quality and prices. I have tried other online pharmacy options over the years, but this store is by far the best 100%. Highly recommended."
                      </p>
                    </Card>
                  </Col>
                </Row>
              </div>

            </Col>

            {/* Right Column: Order Summary */}
            <Col lg={5} xl={4}>
              <Card className="border border-secondary-subtle shadow-sm rounded-4 sticky-top" style={{top: '110px'}}>
                <Card.Body className="p-3 p-md-4">
                  <h4 className="fw-bold mb-4">Order Summary</h4>
                  
                  {/* Totals */}
                  <div className="d-flex justify-content-between mb-3 text-secondary fw-500">
                    <span>Subtotal</span>
                    <span className="text-dark">${cartTotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="d-flex justify-content-between mb-3 text-success fw-500 align-items-center">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <div className="d-flex align-items-center">
                        <Button 
                          variant="link" 
                          className="text-danger text-decoration-none p-0 me-3 small fw-bold" 
                          onClick={removeCoupon}
                          id="cart-coupon-remove-btn"
                        >
                          [Remove]
                        </Button>
                        <span className="fw-bold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  {calculatedTip > 0 && (
                    <div className="d-flex justify-content-between mb-3 align-items-center">
                      <span className="text-secondary fw-500">Tip</span>
                      <div>
                        <Button variant="link" className="text-danger text-decoration-none p-0 me-3 small" onClick={() => setSelectedTip(0)}>
                          Remove Tip
                        </Button>
                        <span className="text-dark fw-500">${calculatedTip.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 pb-3 border-bottom">
                    <span className="text-secondary small fw-500">Shipping calculated on the next step</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold fs-4">Order Total</span>
                    <span className="fw-bold fs-4">${orderTotal.toFixed(2)}</span>
                  </div>

                  {/* Add a Tip Section */}
                  <div className="mb-4">
                    <div className="fw-bold mb-3 d-flex align-items-center">
                      Add a tip <i className="bi bi-info-circle ms-2 text-muted small"></i>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="d-flex bg-light rounded border mb-3 overflow-hidden" style={{height: '45px'}}>
                      <div 
                        className={`w-50 d-flex align-items-center justify-content-center fw-bold cursor-pointer ${tipType === 'Percentage' ? 'bg-dark text-white' : 'text-secondary'}`}
                        onClick={() => { setTipType('Percentage'); setSelectedTip(0); setCustomTip(''); }}
                        style={{cursor: 'pointer'}}
                      >
                        Percentage
                      </div>
                      <div 
                        className={`w-50 d-flex align-items-center justify-content-center fw-bold cursor-pointer ${tipType === 'Amount' ? 'bg-dark text-white' : 'text-secondary'}`}
                        onClick={() => { setTipType('Amount'); setSelectedTip(0); setCustomTip(''); }}
                        style={{cursor: 'pointer'}}
                      >
                        Amount
                      </div>
                    </div>

                    {/* Tip Options Grid */}
                    <Row className="g-2 mb-3">
                      <Col xs={6} sm={3}>
                        <div 
                          className={`border rounded py-2 text-center fw-bold cursor-pointer h-100 d-flex align-items-center justify-content-center ${selectedTip === 5 && customTip === '' ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'border-secondary-subtle text-dark bg-white'}`}
                          onClick={() => handleTipSelect(5)}
                          style={{cursor: 'pointer'}}
                        >
                          {tipType === 'Amount' ? '$5' : '5%'}
                        </div>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div className="position-relative h-100">
                          {/* Popular Badge */}
                          <div className="position-absolute start-50 translate-middle-x badge rounded-pill text-white fw-bold" style={{top: '-8px', backgroundColor: 'var(--primary-color)', fontSize: '0.6rem', padding: '3px 6px', zIndex: 1, border: '1px solid var(--primary-color)'}}>
                            POPULAR
                          </div>
                          <div 
                            className={`border rounded py-2 text-center fw-bold cursor-pointer h-100 d-flex align-items-center justify-content-center ${selectedTip === 10 && customTip === '' ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'border-secondary-subtle text-dark bg-white'}`}
                            onClick={() => handleTipSelect(10)}
                            style={{cursor: 'pointer'}}
                          >
                            {tipType === 'Amount' ? '$10' : '10%'}
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div 
                          className={`border rounded py-2 text-center fw-bold cursor-pointer h-100 d-flex align-items-center justify-content-center ${selectedTip === 15 && customTip === '' ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'border-secondary-subtle text-dark bg-white'}`}
                          onClick={() => handleTipSelect(15)}
                          style={{cursor: 'pointer'}}
                        >
                          {tipType === 'Amount' ? '$15' : '15%'}
                        </div>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div className="h-100">
                          <Form.Control 
                            type="number" 
                            min="0"
                            placeholder="Other" 
                            className="text-center h-100 fw-bold border-secondary-subtle shadow-none py-2"
                            value={customTip}
                            onChange={handleCustomTipChange}
                            style={{fontSize: '0.9rem'}}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Promo Code Input */}
                  <div className="mb-4 pt-3 border-top">
                    <Form onSubmit={handleCouponSubmit}>
                      <Form.Label className="fw-bold mb-2 text-dark" style={{ fontSize: '0.9rem' }}>Promo / Coupon Code</Form.Label>
                      <InputGroup>
                        <Form.Control
                          placeholder="e.g. SAVE20"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError('');
                          }}
                          disabled={!!appliedCoupon}
                          className="bg-light border-secondary-subtle"
                          id="cart-coupon-input"
                          aria-label="Promo Code"
                        />
                        <Button 
                          type="submit" 
                          variant={appliedCoupon ? "success" : "outline-primary"}
                          disabled={!couponCode || isApplying || !!appliedCoupon}
                          id="cart-coupon-apply-btn"
                          className="fw-bold px-3"
                        >
                          {isApplying ? 'Applying...' : appliedCoupon ? 'Applied' : 'Apply'}
                        </Button>
                      </InputGroup>
                      {couponError && <div className="text-danger small mt-1 fw-bold">{couponError}</div>}
                      {appliedCoupon && (
                        <div className="text-success small mt-1 fw-bold">
                          ✓ Coupon applied: {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `$${appliedCoupon.discount_value}`} discount.
                        </div>
                      )}
                    </Form>
                  </div>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-100 fw-bold py-3 border-0 rounded-3 shadow-sm" 
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>

                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      
      <Footer />
    </div>
  );
}

export default Cart;
