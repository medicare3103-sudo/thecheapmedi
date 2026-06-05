import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

function Checkout() {
  const { cartItems, cartTotal, finalTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Checkout Multi-Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // Hardcoded Fees
  const tipsFee = 10.00;
  const internationalShippingFee = 25.00;
  const newOrderTotal = finalTotal + tipsFee + internationalShippingFee;

  // Mock Form State to display in Step 2
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    email: ''
  });

  const [sameBilling, setSameBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    email: ''
  });

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (sameBilling) {
      setBillingDetails({
        firstName: shippingDetails.firstName,
        lastName: shippingDetails.lastName,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        zip: shippingDetails.zip,
        country: shippingDetails.country,
        phone: shippingDetails.phone,
        email: shippingDetails.email
      });
    }
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handleMedicalSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    setTimeout(() => {
      clearCart();
      const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      localStorage.setItem('lastOrderId', generatedOrderId);
      localStorage.setItem('lastOrderEmail', shippingDetails.email);
      navigate('/order-success');
      setPlacingOrder(false);
    }, 1200);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-column">
        <Container className="py-5 flex-grow-1 text-center mt-5">
          <h2 className="fw-bold mb-4">Checkout Error</h2>
          <p className="text-muted">Your cart is empty.</p>
          <Button as={Link} to="/products" variant="primary">Return to Shop</Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white d-flex flex-column checkout-page-wrapper">
      
      {/* Minimal Header */}
      <header className="bg-white border-bottom py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h4 className="fw-bold text-primary mb-0 d-flex align-items-center">
              <i className="bi bi-heart-pulse-fill me-2 text-danger"></i> Medicare
            </h4>
          </Link>
          <div className="d-none d-md-flex gap-4 small fw-500 text-dark">
            <div><i className="bi bi-telephone me-1"></i> USA Call/Text: <a href="tel:+18888667566" className="text-primary text-decoration-none">+1(888) 866-7566</a></div>
            <div><i className="bi bi-headset me-1"></i> Int. No. Call/Text: <a href="tel:+17183018411" className="text-primary text-decoration-none">+1 (718) 301-8411</a></div>
          </div>
        </Container>
      </header>

      <Container className="py-5 flex-grow-1" style={{maxWidth: '1100px'}}>
        
        {/* Dynamic Progress Stepper */}
        <div className="checkout-stepper mb-5 mx-auto" style={{maxWidth: '600px'}}>
          <div className="d-flex justify-content-between position-relative">
            <div className="progress-line position-absolute w-100" style={{top: '15px', height: '2px', backgroundColor: '#e9ecef', zIndex: 0}}>
              {/* Dynamic filled line based on step */}
              <div className="bg-primary h-100" style={{width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%', transition: 'width 0.3s ease'}}></div>
            </div>
            
            {/* Step 1: Shipping */}
            <div className={`step text-center position-relative z-1 ${currentStep >= 1 ? 'active' : ''}`} style={{width: '33.33%'}}>
              <div className={`step-circle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold text-white shadow-sm ${currentStep >= 1 ? 'bg-primary border-primary' : 'bg-light text-muted border border-secondary-subtle'}`} style={{width: '32px', height: '32px'}}>
                {currentStep > 1 ? <i className="bi bi-check-lg"></i> : '1'}
              </div>
              <div className={`step-label small ${currentStep >= 1 ? 'fw-bold text-dark' : 'text-muted'}`}>Shipping</div>
            </div>
            
            {/* Step 2: Medical Conditions */}
            <div className={`step text-center position-relative z-1 ${currentStep >= 2 ? 'active' : 'inactive'}`} style={{width: '33.33%'}}>
              <div className={`step-circle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold text-white shadow-sm ${currentStep >= 2 ? 'bg-primary border-primary' : 'bg-light text-muted border border-secondary-subtle'}`} style={{width: '32px', height: '32px'}}>
                {currentStep > 2 ? <i className="bi bi-check-lg"></i> : '2'}
              </div>
              <div className={`step-label small ${currentStep >= 2 ? 'fw-bold text-dark' : 'text-muted'}`}>Medical Conditions</div>
            </div>
            
            {/* Step 3: Payments */}
            <div className={`step text-center position-relative z-1 ${currentStep >= 3 ? 'active' : 'inactive'}`} style={{width: '33.33%'}}>
              <div className={`step-circle rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold text-white shadow-sm ${currentStep >= 3 ? 'bg-primary border-primary' : 'bg-light text-muted border border-secondary-subtle'}`} style={{width: '32px', height: '32px'}}>
                3
              </div>
              <div className={`step-label small ${currentStep >= 3 ? 'fw-bold text-dark' : 'text-muted'}`}>Payments</div>
            </div>
          </div>
        </div>

        <Row className="g-5">
          
          {/* LEFT COLUMN: Dynamic Forms based on currentStep */}
          <Col lg={7}>
            
            {currentStep === 1 && (
              <>
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <h3 className="fw-bold mb-0">Shipping Address</h3>
                  <div className="small fw-500 text-muted">Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold">Sign In (Optional)</Link></div>
                </div>

                <Form onSubmit={handleShippingSubmit}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Control 
                        type="email" 
                        placeholder="Your Email Address *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.email}
                        onChange={e => setShippingDetails(prev => ({...prev, email: e.target.value}))}
                      />
                      <Form.Text className="text-muted small">We'll send your order confirmation here.</Form.Text>
                    </Col>

                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="First name *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.firstName}
                        onChange={e => setShippingDetails(prev => ({...prev, firstName: e.target.value}))} 
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="Last name *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.lastName}
                        onChange={e => setShippingDetails(prev => ({...prev, lastName: e.target.value}))} 
                      />
                    </Col>

                    <Col md={12}>
                      <Form.Control 
                        type="text" 
                        placeholder="Street Address *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.address}
                        onChange={e => setShippingDetails(prev => ({...prev, address: e.target.value}))} 
                      />
                      <div className="mt-2">
                        <Button variant="link" className="p-0 text-success text-decoration-none fw-500 small"><i className="bi bi-plus me-1"></i>Add appartment,suite etc</Button>
                      </div>
                    </Col>

                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="City *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.city}
                        onChange={e => setShippingDetails(prev => ({...prev, city: e.target.value}))} 
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Select 
                        className="py-3 shadow-none border-secondary-subtle text-muted"
                        value={shippingDetails.state}
                        onChange={e => setShippingDetails(prev => ({...prev, state: e.target.value}))}
                        required
                      >
                        <option value="">Please select a region, state or province.</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                        <option value="AK">Alaska</option>
                      </Form.Select>
                    </Col>

                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="Zip/Postal Code *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.zip}
                        onChange={e => setShippingDetails(prev => ({...prev, zip: e.target.value}))} 
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Select 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.country}
                        onChange={e => setShippingDetails(prev => ({...prev, country: e.target.value}))}
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                      </Form.Select>
                    </Col>

                    <Col md={12}>
                      <Form.Control 
                        type="tel" 
                        placeholder="Phone Number *" 
                        required 
                        className="py-3 shadow-none border-secondary-subtle" 
                        value={shippingDetails.phone}
                        onChange={e => setShippingDetails(prev => ({...prev, phone: e.target.value}))} 
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Select className="py-3 shadow-none border-secondary-subtle">
                        <option>Set reminder for next order</option>
                        <option>30 days</option>
                        <option>60 days</option>
                      </Form.Select>
                    </Col>
                    <Col md={6}>
                      <Form.Select className="py-3 shadow-none border-secondary-subtle">
                        <option>Heard About Us</option>
                        <option>I searched on web</option>
                        <option>Friend</option>
                      </Form.Select>
                    </Col>

                    <Col md={12} className="mt-4">
                      <h6 className="fw-bold mb-1">How to reach you?</h6>
                      <p className="text-muted small mb-3">Select a channel to get order status updates</p>
                      <div className="d-flex gap-4 mb-4">
                        <Form.Check type="radio" label="Email" name="contactChannel" id="channelEmail" defaultChecked className="fw-500" />
                        <Form.Check type="radio" label="Sms" name="contactChannel" id="channelSms" className="fw-500" />
                        <Form.Check type="radio" label="Phone" name="contactChannel" id="channelPhone" className="fw-500" />
                      </div>
                      
                      <Form.Check 
                        type="checkbox" 
                        id="sameBilling" 
                        label="My billing and shipping address are the same" 
                        checked={sameBilling} 
                        onChange={(e) => setSameBilling(e.target.checked)}
                        className="fw-500 text-dark mb-3" 
                      />

                       {!sameBilling && (
                        <div className="mb-4 p-3 bg-light rounded-3 border" style={{ borderColor: '#f1f5f9' }}>
                          <h5 className="fw-bold mb-3 text-dark" style={{ fontSize: '1rem' }}>Billing Address</h5>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Control 
                                type="text" 
                                placeholder="First name *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.firstName}
                                onChange={e => setBillingDetails(prev => ({...prev, firstName: e.target.value}))} 
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Control 
                                type="text" 
                                placeholder="Last name *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.lastName}
                                onChange={e => setBillingDetails(prev => ({...prev, lastName: e.target.value}))} 
                              />
                            </Col>
                            <Col md={12}>
                              <Form.Control 
                                type="text" 
                                placeholder="Street Address *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.address}
                                onChange={e => setBillingDetails(prev => ({...prev, address: e.target.value}))} 
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Control 
                                type="text" 
                                placeholder="City *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.city}
                                onChange={e => setBillingDetails(prev => ({...prev, city: e.target.value}))} 
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Select 
                                className="py-3 shadow-none border-secondary-subtle text-muted"
                                value={billingDetails.state}
                                onChange={e => setBillingDetails(prev => ({...prev, state: e.target.value}))}
                                required
                              >
                                <option value="">Please select a state.</option>
                                <option value="NY">New York</option>
                                <option value="CA">California</option>
                                <option value="AK">Alaska</option>
                              </Form.Select>
                            </Col>
                            <Col md={6}>
                              <Form.Control 
                                type="text" 
                                placeholder="Zip/Postal Code *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.zip}
                                onChange={e => setBillingDetails(prev => ({...prev, zip: e.target.value}))} 
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Select 
                                className="py-3 shadow-none border-secondary-subtle"
                                value={billingDetails.country}
                                onChange={e => setBillingDetails(prev => ({...prev, country: e.target.value}))}
                              >
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                              </Form.Select>
                            </Col>
                            <Col md={6}>
                              <Form.Control 
                                type="email" 
                                placeholder="Email Address *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.email}
                                onChange={e => setBillingDetails(prev => ({...prev, email: e.target.value}))} 
                              />
                            </Col>
                            <Col md={6}>
                              <Form.Control 
                                type="tel" 
                                placeholder="Phone Number *" 
                                required 
                                className="py-3 shadow-none border-secondary-subtle" 
                                value={billingDetails.phone}
                                onChange={e => setBillingDetails(prev => ({...prev, phone: e.target.value}))} 
                              />
                            </Col>
                          </Row>
                        </div>
                      )}
                      
                      <div className="d-flex justify-content-end mb-4">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          size="lg" 
                          className="px-5 py-2 fw-bold rounded-2 shadow-sm"
                          style={{minWidth: '200px'}}
                        >
                          Save and Continue
                        </Button>
                      </div>
                      
                      <div className="d-flex flex-column gap-2">
                        <Form.Check type="checkbox" id="disclaimerPolicy" defaultChecked className="fw-500 small text-dark">
                          <Form.Check.Input type="checkbox" defaultChecked />
                          <Form.Check.Label>
                            <strong>I agree to your disclaimer policy:</strong><br/>
                            <span className="text-muted">Medicare complies with all applicable local </span>
                            <a href="#" className="text-primary text-decoration-underline">Read more</a>
                          </Form.Check.Label>
                        </Form.Check>

                        <Form.Check type="checkbox" id="commPolicy" defaultChecked className="fw-500 small text-dark mt-2">
                          <Form.Check.Input type="checkbox" defaultChecked />
                          <Form.Check.Label>
                            Receive Text and Email Notification <a href="#" className="text-primary text-decoration-underline">Read Communication Policy Here</a>
                          </Form.Check.Label>
                        </Form.Check>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="fw-bold mb-0">Medical Conditions</h3>
                    <p className="text-muted small mb-0 mt-1"><em>(Optional - You may skip these details)</em></p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleMedicalSubmit} 
                    variant="primary" 
                    className="fw-bold rounded-2 shadow-sm px-4"
                  >
                    Proceed to Payment
                  </Button>
                </div>

                <Form onSubmit={handleMedicalSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Control type="text" placeholder="Primary Physician's Name" className="py-3 shadow-none border-secondary-subtle" />
                    </Col>
                    <Col md={6}>
                      <Form.Control type="text" placeholder="Physician's Contact Number" className="py-3 shadow-none border-secondary-subtle" />
                    </Col>

                    <Col md={6}>
                      <Form.Control type="text" placeholder="Current Medications" className="py-3 shadow-none border-secondary-subtle" />
                    </Col>
                    <Col md={6}>
                      <Form.Control type="text" placeholder="Current Treatments" className="py-3 shadow-none border-secondary-subtle" />
                    </Col>

                    <Col md={12}>
                      <Form.Control type="text" placeholder="Drug Allergies" className="py-3 shadow-none border-secondary-subtle" />
                    </Col>

                    <Col md={6}>
                      <div className="border border-secondary-subtle rounded d-flex align-items-center bg-white h-100 overflow-hidden px-2">
                        <Button variant="light" size="sm" className="border shadow-none text-dark fw-bold me-2 py-2 px-3">
                          <i className="bi bi-cloud-arrow-up me-2"></i>Choose files
                        </Button>
                        <div className="small text-muted py-2">
                          <div className="fw-500 text-dark" style={{fontSize: '0.8rem'}}>Upload your prescription</div>
                          <div style={{fontSize: '0.7rem'}}>Max file 3 MB (jpg, png & pdf)</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="border border-secondary-subtle rounded d-flex align-items-center bg-white h-100 overflow-hidden px-2">
                        <Button variant="light" size="sm" className="border shadow-none text-dark fw-bold me-2 py-2 px-3">
                          <i className="bi bi-calendar me-2"></i>Select date
                        </Button>
                        <div className="small text-muted py-2">
                          Your Date of Birth
                        </div>
                      </div>
                    </Col>
                  </Row>
                  
                  <div className="mt-3 mb-5">
                    <p className="text-secondary small fw-500">Alternatively, you can send us your prescription via Fax on: <strong className="text-dark">+1(865)674-5492</strong></p>
                  </div>

                  <h4 className="fw-bold mb-1">Lifestyle Habits</h4>
                  <p className="text-muted small mb-3">Select a relevant option</p>
                  <div className="d-flex gap-4 mb-4">
                    <Form.Check type="checkbox" label="Smoke" id="habitSmoke" className="fw-bold" style={{transform: 'scale(1.2)'}} />
                    <Form.Check type="checkbox" label="Drink" id="habitDrink" className="fw-bold ms-2" style={{transform: 'scale(1.2)'}} />
                  </div>

                  <p className="text-muted small lh-sm fw-500 mb-4" style={{maxWidth: '95%'}}>
                    I certify that I am over 18, under a licensed doctor's care, and the medication is solely for my personal use, strictly not for resale.
                  </p>
                  <h6 className="fw-bold mb-4">By pressing 'Proceed', I accept all the statements mentioned above.</h6>

                  <div className="d-flex justify-content-end mb-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="px-5 py-2 fw-bold rounded-2 shadow-sm"
                      style={{minWidth: '200px'}}
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </Form>
              </>
            )}
            
            {currentStep === 3 && (
              <div className="text-center py-5">
                <h3 className="fw-bold mb-4">Payments (Mock)</h3>
                <p className="text-muted mb-4">This step would normally process your payment details.</p>
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  variant="primary" 
                  size="lg" 
                  className="px-5 py-3 fw-bold rounded-2 shadow-sm"
                >
                  {placingOrder ? 'Processing...' : 'Complete Order'}
                </Button>
              </div>
            )}
          </Col>

          {/* RIGHT COLUMN: Order Summary & Address Cards */}
          <Col lg={5}>
            <div className="position-sticky" style={{top: '110px'}}>
              {/* Order Summary Card */}
              <Card className="border shadow-sm rounded-4 checkout-summary-card mb-4">
                <Card.Body className="p-4">
                  <h6 className="fw-bold text-secondary mb-4">Order Summary ( {cartItems.length} items in cart )</h6>
                  
                  <div className="checkout-items-list mb-4 border-bottom pb-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-4 position-relative">
                        
                        {/* Product Image Box with Badge Overlay */}
                        <div className="position-relative me-3 border rounded bg-white p-2" style={{width: '65px', height: '65px'}}>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="img-fluid" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 text-muted"><i className="bi bi-image"></i></div>
                          )}
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-secondary text-white shadow-sm border border-white" style={{padding: '5px 8px'}}>
                            {item.quantity}
                          </span>
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow-1">
                          <div className="fw-bold fs-6 lh-sm mb-1 pe-4 text-dark">{item.name}</div>
                          {item.packSize && <div className="text-dark small fw-bold">Pack Size: <span className="text-secondary fw-normal">{item.packSize}</span></div>}
                        </div>

                        {/* Price */}
                        <div className="fw-bold fs-6">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-totals">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary fw-500">Cart Subtotal</span>
                      <span className="fw-bold">${cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-4 pb-4 border-bottom">
                      <span className="text-secondary fw-500 d-flex align-items-center">
                        International shipping <i className="bi bi-info-circle ms-2 small"></i>
                      </span>
                      <span className="fw-bold">${internationalShippingFee.toFixed(2)}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Order Total</span>
                      <span className="fw-bold fs-4">${newOrderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Shipping Address Summary Card (Visible on Steps 2 & 3) */}
              {currentStep >= 2 && (
                <Card className="border shadow-sm rounded-4 mb-3">
                  <Card.Body className="p-4 position-relative">
                    <h5 className="fw-bold mb-3 d-flex justify-content-between">
                      Shipping Address
                      <Button variant="link" className="p-0 text-primary text-decoration-none fw-bold fs-6" onClick={() => setCurrentStep(1)}>
                        Change
                      </Button>
                    </h5>
                    <div className="text-secondary small fw-500 lh-sm">
                      <div className="text-dark mb-1">{shippingDetails.firstName || 'John'} {shippingDetails.lastName || 'Doe'}</div>
                      <div>{shippingDetails.address || '123 Fake Street'}</div>
                      <div>{shippingDetails.city || 'Anytown'}, {shippingDetails.state || 'AK'} {shippingDetails.zip || '12345'}</div>
                      <div>{shippingDetails.country || 'United States'}</div>
                      <div>Phone: {shippingDetails.phone || '+1(555)555-5555'}</div>
                      <div>Email: {shippingDetails.email || 'john.doe@example.com'}</div>
                      {sameBilling && (
                        <div className="mt-2 text-success small fw-bold d-flex align-items-center">
                          <i className="bi bi-check-circle-fill me-1"></i> Billing address is same as shipping
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Billing Address Summary Card (Visible on Steps 2 & 3 if different) */}
              {currentStep >= 2 && !sameBilling && (
                <Card className="border shadow-sm rounded-4">
                  <Card.Body className="p-4 position-relative">
                    <h5 className="fw-bold mb-3 d-flex justify-content-between">
                      Billing Address
                      <Button variant="link" className="p-0 text-primary text-decoration-none fw-bold fs-6" onClick={() => setCurrentStep(1)}>
                        Change
                      </Button>
                    </h5>
                    <div className="text-secondary small fw-500 lh-sm">
                      <div className="text-dark mb-1">{billingDetails.firstName || 'John'} {billingDetails.lastName || 'Doe'}</div>
                      <div>{billingDetails.address || '123 Fake Street'}</div>
                      <div>{billingDetails.city || 'Anytown'}, {billingDetails.state || 'AK'} {billingDetails.zip || '12345'}</div>
                      <div>{billingDetails.country || 'United States'}</div>
                      <div>Phone: {billingDetails.phone || '+1(555)555-5555'}</div>
                      <div>Email: {billingDetails.email || 'john.doe@example.com'}</div>
                    </div>
                  </Card.Body>
                </Card>
              )}

            </div>
          </Col>
          
        </Row>
      </Container>
    </div>
  );
}

export default Checkout;
