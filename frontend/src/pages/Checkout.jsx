import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createOrder, sendCheckoutOtp, verifyCheckoutOtp } from '../api';

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

function Checkout() {
  const { user } = useAuth();
  const { 
    cartItems, cartTotal, finalTotal, clearCart,
    appliedCoupon, applyCoupon, removeCoupon, discountAmount 
  } = useCart();
  const navigate = useNavigate();

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Zip Code Validation
  const validateZip = (zip) => /^\d{5}(-\d{4})?$/.test(zip.trim());
  const [shippingZipTouched, setShippingZipTouched] = useState(false);
  const [billingZipTouched, setBillingZipTouched] = useState(false);

  // Email OTP Verification State
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showEmailVerificationError, setShowEmailVerificationError] = useState(false);

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setShippingDetails(prev => ({...prev, email: value}));
    
    const savedVerifiedEmail = localStorage.getItem('verifiedEmail');
    if (
      (user && user.email && user.email.toLowerCase() === value.trim().toLowerCase()) ||
      (savedVerifiedEmail && savedVerifiedEmail.toLowerCase() === value.trim().toLowerCase())
    ) {
      setEmailVerified(true);
    } else {
      setEmailVerified(false);
    }

    setOtpSent(false);
    setOtpCode('');
    setOtpError('');
    setOtpSuccess('');
    setDevOtp('');
    setShowEmailVerificationError(false);
  };

  const sendOtpHandler = async () => {
    const email = shippingDetails.email;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setOtpError('Please enter a valid email address.');
      return;
    }
    setSendingOtp(true);
    setOtpError('');
    setOtpSuccess('');
    setDevOtp('');
    try {
      const data = await sendCheckoutOtp(email);
      setOtpSent(true);
      setCountdown(60);
      setOtpSuccess('Verification code sent! Please check your email.');
      if (data.dev_otp) {
        setDevOtp(data.dev_otp);
      }
    } catch (err) {
      setOtpError(err.response?.data?.detail || 'Failed to send verification code. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtpHandler = async (codeToVerify) => {
    const email = shippingDetails.email;
    const code = codeToVerify || otpCode;
    if (!code || code.length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      await verifyCheckoutOtp(email, code);
      setEmailVerified(true);
      localStorage.setItem('verifiedEmail', email);
      setOtpSuccess('Email verified successfully!');
      setShowEmailVerificationError(false);
      setDevOtp('');
    } catch (err) {
      setOtpError(err.response?.data?.detail || 'Invalid or expired code. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Address Autocomplete State
  const [shippingSuggestions, setShippingSuggestions] = useState([]);
  const [shippingSuggestionsOpen, setShippingSuggestionsOpen] = useState(false);
  const [shippingAddressLoading, setShippingAddressLoading] = useState(false);
  const [billingSuggestions, setBillingSuggestions] = useState([]);
  const [billingSuggestionsOpen, setBillingSuggestionsOpen] = useState(false);
  const [billingAddressLoading, setBillingAddressLoading] = useState(false);
  const shippingDebounceRef = useRef(null);
  const billingDebounceRef = useRef(null);

  const US_STATE_ABBR = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
    'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
    'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA',
    'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN',
    'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
    'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
  };

  const fetchAddressSuggestions = (query, setSuggestions, setOpen, setLoading, debounceRef) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 3) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=us&limit=6`,
          { headers: { 'Accept-Language': 'en-US,en', 'User-Agent': 'TheCheapPharma/1.0' } }
        );
        const data = await res.json();
        setSuggestions(data.filter(r => r.address));
        setOpen(data.length > 0);
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
    }, 400);
  };

  const applyAddressSuggestion = (result, setDetails, setOpen, setSuggestions) => {
    const addr = result.address;
    const road = addr.road || addr.pedestrian || addr.footway || '';
    const houseNumber = addr.house_number || '';
    const street = houseNumber ? `${houseNumber} ${road}` : road;
    const city = addr.city || addr.town || addr.village || addr.county || '';
    const stateFullName = addr.state || '';
    const stateCode = US_STATE_ABBR[stateFullName] || stateFullName;
    const zip = addr.postcode ? addr.postcode.split('-')[0].substring(0, 5) : '';
    setDetails(prev => ({ ...prev, address: street, city, state: stateCode, zip }));
    setOpen(false);
    setSuggestions([]);
  };

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

  // Checkout Multi-Step State
  const [currentStep, setCurrentStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // Hardcoded Fees
  const tipsFee = 10.00;
  const internationalShippingFee = finalTotal > 189 ? 0.00 : 25.00;
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

  // Auto-fill and auto-verify email if user is logged in or email was previously verified in this browser
  useEffect(() => {
    if (user && user.email) {
      setShippingDetails(prev => ({ ...prev, email: user.email }));
      setEmailVerified(true);
    } else {
      const savedVerifiedEmail = localStorage.getItem('verifiedEmail');
      if (savedVerifiedEmail) {
        setShippingDetails(prev => ({ ...prev, email: savedVerifiedEmail }));
        setEmailVerified(true);
      }
    }
  }, [user]);

  // Derived zip validity (must be after state declarations)
  const shippingZipValid = validateZip(shippingDetails.zip);
  const billingZipValid = sameBilling || validateZip(billingDetails.zip);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setShippingZipTouched(true);
    setBillingZipTouched(true);

    if (!emailVerified) {
      setShowEmailVerificationError(true);
      const emailInput = document.getElementById("checkout-shipping-email");
      if (emailInput) {
        emailInput.focus();
        emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!shippingZipValid || !billingZipValid) return;
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

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const orderData = {
        customer_email: shippingDetails.email,
        total_price: newOrderTotal,
        status: 'Pending'
      };
      const createdOrder = await createOrder(orderData);
      
      const finalBilling = sameBilling ? shippingDetails : billingDetails;
      
      // Save order info for the success screen
      localStorage.setItem('lastOrderId', `ORD-${createdOrder.id}`);
      localStorage.setItem('lastOrderEmail', createdOrder.customer_email);
      localStorage.setItem('lastOrderTotal', createdOrder.total_price.toFixed(2));
      localStorage.setItem('lastOrderDate', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      localStorage.setItem('lastOrderItems', JSON.stringify(cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        packSize: item.packSize
      }))));
      localStorage.setItem('lastOrderSubtotal', finalTotal.toFixed(2));
      localStorage.setItem('lastOrderShipping', internationalShippingFee.toFixed(2));
      localStorage.setItem('lastOrderBilling', JSON.stringify(finalBilling));
      localStorage.setItem('lastOrderShippingAddress', JSON.stringify(shippingDetails));

      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
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
    <>
    <div className="min-vh-100 bg-white d-flex flex-column checkout-page-wrapper">
      
      <Header />

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

        <Row className="g-3 g-md-4 g-lg-5">
          
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
                      <Form.Label className="fw-semibold text-dark small mb-2">Email Address *</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          id="checkout-shipping-email"
                          type="email" 
                          placeholder="Your Email Address *" 
                          required 
                          className={`py-3 shadow-none ${
                            showEmailVerificationError && !emailVerified ? 'border-danger' : 'border-secondary-subtle'
                          }`}
                          value={shippingDetails.email}
                          onChange={handleEmailChange}
                          disabled={emailVerified}
                          style={emailVerified ? { backgroundColor: '#f8f9fa', borderLeft: '4px solid #198754' } : {}}
                        />
                        {!emailVerified && (
                          <Button 
                            variant={otpSent ? "outline-primary" : "primary"}
                            onClick={sendOtpHandler}
                            disabled={sendingOtp || countdown > 0 || !shippingDetails.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingDetails.email)}
                            className="px-3"
                          >
                            {sendingOtp ? (
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            {countdown > 0 ? `Resend in ${countdown}s` : otpSent ? "Resend Code" : "Verify Email"}
                          </Button>
                        )}
                        {emailVerified && (
                          <InputGroup.Text className="bg-success-subtle text-success border-success-subtle fw-semibold px-3">
                            <i className="bi bi-patch-check-fill me-2"></i> Verified
                          </InputGroup.Text>
                        )}
                      </InputGroup>
                      
                      {showEmailVerificationError && !emailVerified && (
                        <div className="text-danger small mt-1 fw-semibold d-flex align-items-center gap-1 animate__animated animate__shakeX">
                          <i className="bi bi-exclamation-circle-fill"></i> Please verify your email address to continue.
                        </div>
                      )}

                      {emailVerified && (
                        <div className="mt-2 text-end">
                          <Button variant="link" size="sm" className="p-0 text-decoration-none fw-semibold text-muted" onClick={() => {
                            setEmailVerified(false);
                            setOtpSent(false);
                            setOtpCode('');
                            setOtpSuccess('');
                            setOtpError('');
                          }}>
                            Change Email
                          </Button>
                        </div>
                      )}

                      <Form.Text className="text-muted small">We'll send your order confirmation and verification OTP here.</Form.Text>

                      {otpSent && !emailVerified && (
                        <Card className="mt-3 border-primary-subtle bg-primary-subtle bg-opacity-10 shadow-sm border animate__animated animate__fadeIn">
                          <Card.Body className="p-3">
                            <div className="fw-semibold text-primary mb-2 small d-flex align-items-center justify-content-between">
                              <span>Enter the 6-digit code sent to your email:</span>
                              {devOtp && (
                                <span className="badge bg-warning text-dark fw-bold animate__animated animate__pulse animate__infinite">
                                  Dev Mode OTP: {devOtp}
                                </span>
                              )}
                            </div>
                            <InputGroup>
                              <Form.Control 
                                type="text" 
                                placeholder="6-Digit Verification Code" 
                                maxLength={6}
                                className="py-2 text-center fw-bold letter-spacing-5 shadow-none border-primary-subtle"
                                style={{ letterSpacing: '0.25rem', fontSize: '1.1rem' }}
                                value={otpCode}
                                onChange={e => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setOtpCode(val);
                                  if (val.length === 6) {
                                    verifyOtpHandler(val);
                                  }
                                }}
                              />
                              <Button 
                                variant="primary" 
                                onClick={() => verifyOtpHandler(otpCode)}
                                disabled={verifyingOtp || otpCode.length !== 6}
                                className="px-3 fw-bold"
                              >
                                {verifyingOtp ? (
                                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : "Verify"}
                              </Button>
                            </InputGroup>
                            {otpError && (
                              <div className="text-danger small mt-2 fw-semibold d-flex align-items-center gap-1">
                                <i className="bi bi-x-circle-fill"></i> {otpError}
                              </div>
                            )}
                            {otpSuccess && (
                              <div className="text-success small mt-2 fw-semibold d-flex align-items-center gap-1">
                                <i className="bi bi-check-circle-fill"></i> {otpSuccess}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      )}
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
                      <div className="position-relative">
                        <div className="position-relative">
                          <Form.Control 
                            type="text" 
                            placeholder="Street Address *" 
                            required 
                            className="py-3 shadow-none border-secondary-subtle pe-5"
                            value={shippingDetails.address}
                            autoComplete="off"
                            onChange={e => {
                              setShippingDetails(prev => ({...prev, address: e.target.value}));
                              fetchAddressSuggestions(e.target.value, setShippingSuggestions, setShippingSuggestionsOpen, setShippingAddressLoading, shippingDebounceRef);
                            }}
                            onBlur={() => setTimeout(() => setShippingSuggestionsOpen(false), 180)}
                            onFocus={() => shippingSuggestions.length > 0 && setShippingSuggestionsOpen(true)}
                          />
                          {shippingAddressLoading && (
                            <div className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{pointerEvents:'none'}}>
                              <div className="spinner-border spinner-border-sm text-primary" role="status"/>
                            </div>
                          )}
                        </div>
                        {shippingSuggestionsOpen && shippingSuggestions.length > 0 && (
                          <div className="address-suggestions-dropdown">
                            {shippingSuggestions.map((result, idx) => (
                              <div
                                key={idx}
                                className="address-suggestion-item"
                                onMouseDown={() => applyAddressSuggestion(result, setShippingDetails, setShippingSuggestionsOpen, setShippingSuggestions)}
                              >
                                <i className="bi bi-geo-alt-fill text-primary me-2 flex-shrink-0"></i>
                                <span>{result.display_name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <Button variant="link" className="p-0 text-success text-decoration-none fw-500 small"><i className="bi bi-plus me-1"></i>Add appartment, suite etc</Button>
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
                        id="shipping-state-select"
                        aria-label="Shipping State"
                      >
                        <option value="">Please select a region, state or province.</option>
                        {US_STATES.map(state => (
                          <option key={state.code} value={state.code}>{state.name}</option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={6}>
                      <Form.Control 
                        type="text" 
                        placeholder="Zip/Postal Code *" 
                        required 
                        className={`py-3 shadow-none ${
                          !shippingZipTouched ? 'border-secondary-subtle' :
                          shippingZipValid ? 'border-success' : 'border-danger'
                        }`}
                        value={shippingDetails.zip}
                        maxLength={10}
                        onChange={e => {
                          setShippingDetails(prev => ({...prev, zip: e.target.value}));
                          setShippingZipTouched(true);
                        }}
                        onBlur={() => setShippingZipTouched(true)}
                      />
                      {shippingZipTouched && shippingDetails.zip && (
                        shippingZipValid
                          ? <div className="text-success small mt-1 fw-semibold d-flex align-items-center gap-1"><i className="bi bi-check-circle-fill"></i> Valid US ZIP code</div>
                          : <div className="text-danger small mt-1 fw-semibold d-flex align-items-center gap-1"><i className="bi bi-x-circle-fill"></i> Enter a valid ZIP (e.g. 90210 or 90210-1234)</div>
                      )}
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        className="py-3 shadow-none border-secondary-subtle bg-light text-dark fw-semibold"
                        value="United States"
                        readOnly
                        style={{ cursor: 'default' }}
                      />
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
                              <div className="position-relative">
                                <div className="position-relative">
                                  <Form.Control 
                                    type="text" 
                                    placeholder="Street Address *" 
                                    required 
                                    className="py-3 shadow-none border-secondary-subtle pe-5"
                                    value={billingDetails.address}
                                    autoComplete="off"
                                    onChange={e => {
                                      setBillingDetails(prev => ({...prev, address: e.target.value}));
                                      fetchAddressSuggestions(e.target.value, setBillingSuggestions, setBillingSuggestionsOpen, setBillingAddressLoading, billingDebounceRef);
                                    }}
                                    onBlur={() => setTimeout(() => setBillingSuggestionsOpen(false), 180)}
                                    onFocus={() => billingSuggestions.length > 0 && setBillingSuggestionsOpen(true)}
                                  />
                                  {billingAddressLoading && (
                                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3" style={{pointerEvents:'none'}}>
                                      <div className="spinner-border spinner-border-sm text-primary" role="status"/>
                                    </div>
                                  )}
                                </div>
                                {billingSuggestionsOpen && billingSuggestions.length > 0 && (
                                  <div className="address-suggestions-dropdown">
                                    {billingSuggestions.map((result, idx) => (
                                      <div
                                        key={idx}
                                        className="address-suggestion-item"
                                        onMouseDown={() => applyAddressSuggestion(result, setBillingDetails, setBillingSuggestionsOpen, setBillingSuggestions)}
                                      >
                                        <i className="bi bi-geo-alt-fill text-primary me-2 flex-shrink-0"></i>
                                        <span>{result.display_name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
                                id="billing-state-select"
                                aria-label="Billing State"
                              >
                                <option value="">Please select a state.</option>
                                {US_STATES.map(state => (
                                  <option key={state.code} value={state.code}>{state.name}</option>
                                ))}
                              </Form.Select>
                            </Col>
                            <Col md={6}>
                              <Form.Control 
                                type="text" 
                                placeholder="Zip/Postal Code *" 
                                required 
                                className={`py-3 shadow-none ${
                                  !billingZipTouched ? 'border-secondary-subtle' :
                                  validateZip(billingDetails.zip) ? 'border-success' : 'border-danger'
                                }`}
                                value={billingDetails.zip}
                                maxLength={10}
                                onChange={e => {
                                  setBillingDetails(prev => ({...prev, zip: e.target.value}));
                                  setBillingZipTouched(true);
                                }}
                                onBlur={() => setBillingZipTouched(true)}
                              />
                              {billingZipTouched && billingDetails.zip && (
                                validateZip(billingDetails.zip)
                                  ? <div className="text-success small mt-1 fw-semibold d-flex align-items-center gap-1"><i className="bi bi-check-circle-fill"></i> Valid US ZIP code</div>
                                  : <div className="text-danger small mt-1 fw-semibold d-flex align-items-center gap-1"><i className="bi bi-x-circle-fill"></i> Enter a valid ZIP (e.g. 90210 or 90210-1234)</div>
                              )}
                            </Col>
                            <Col md={6}>
                              <Form.Control
                                className="py-3 shadow-none border-secondary-subtle bg-light text-dark fw-semibold"
                                value="United States"
                                readOnly
                                style={{ cursor: 'default' }}
                              />
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
                            <span className="text-muted">The Cheap Pharma complies with all applicable local </span>
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
                      <div className="border border-secondary-subtle rounded d-flex align-items-center bg-white h-100 overflow-hidden px-2 py-1">
                        <Button variant="light" size="sm" className="border shadow-none text-dark fw-bold me-2 py-2 px-2 flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-cloud-arrow-up me-1"></i>Choose files
                        </Button>
                        <div className="small text-muted py-2">
                          <div className="fw-500 text-dark" style={{fontSize: '0.8rem'}}>Upload your prescription</div>
                          <div style={{fontSize: '0.7rem'}}>Max file 3 MB (jpg, png & pdf)</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="border border-secondary-subtle rounded d-flex align-items-center bg-white h-100 overflow-hidden px-2 py-1">
                        <Button variant="light" size="sm" className="border shadow-none text-dark fw-bold me-2 py-2 px-2 flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-calendar me-1"></i>Select date
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
              <div className="text-start py-4">
                <h3 className="fw-bold mb-4 text-dark" style={{ letterSpacing: '-0.3px' }}>Select Payment Method</h3>
                <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
                  Choose your preferred payment method below. Your order will be placed in a pending status, and secure payment details and instructions will be sent to your verified email address: <strong>{shippingDetails.email}</strong>.
                </p>

                {/* Selectable Payment Option Cards */}
                <div className="d-flex flex-column gap-3 mb-4">
                  {/* Card Option */}
                  <div 
                    className="p-3 border rounded-3 d-flex align-items-start gap-3 bg-light bg-opacity-25" 
                    style={{ borderColor: '#e2e8f0', borderLeft: '4px solid #0d6efd' }}
                  >
                    <div className="fs-3 text-primary pt-1">
                      <i className="bi bi-credit-card-2-back-fill"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark mb-1">Credit / Debit Card (Secure Link via Email)</div>
                      <p className="text-muted small mb-0 lh-base">
                        Pay securely using your credit or debit card. A secure billing link will be sent to your email. Your billing statement will show a neutral merchant descriptor.
                      </p>
                    </div>
                  </div>

                  {/* Bank/ACH Option */}
                  <div 
                    className="p-3 border rounded-3 d-flex align-items-start gap-3 bg-white" 
                    style={{ borderColor: '#e2e8f0', opacity: '0.8' }}
                  >
                    <div className="fs-3 text-secondary pt-1">
                      <i className="bi bi-bank2"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-secondary mb-1">Direct Bank Transfer / Wire / ACH</div>
                      <p className="text-muted small mb-0 lh-base">
                        Transfer payment directly from your bank account. The banking coordinates and transaction guidelines will be emailed to you.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Notice Alert */}
                <Card className="border-danger-subtle bg-danger-subtle bg-opacity-10 border mb-4 animate__animated animate__fadeIn">
                  <Card.Body className="p-3">
                    <div className="fw-bold text-danger mb-2 small d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      <span>CRITICAL COMPLIANCE NOTICE</span>
                    </div>
                    <p className="text-danger small mb-0 lh-base fw-500">
                      Due to strict payment gateway policies, please <strong>do not mention</strong> the word <strong>"medicine"</strong> or specific drug names on payment references. If you receive a confirmation call from the bank, please declare the transaction as "health consulting" or "personal care".
                    </p>
                  </Card.Body>
                </Card>

                {/* Place Order Button */}
                <div className="text-center mt-4 pt-2">
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    variant="primary" 
                    size="lg" 
                    className="w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    {placingOrder ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Placing Your Order...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-lock-fill"></i>
                        <span>Place Order & Request Payment Link</span>
                      </>
                    )}
                  </Button>
                  <p className="text-muted small mt-3">
                    <i className="bi bi-lock-fill me-1"></i> Your details are encrypted using SSL.
                  </p>
                </div>
              </div>
            )}
          </Col>

          {/* RIGHT COLUMN: Order Summary & Address Cards */}
          <Col lg={5}>
            <div className="position-sticky" style={{top: '110px'}}>
              {/* Order Summary Card */}
              <Card className="border shadow-sm rounded-4 checkout-summary-card mb-4">
                <Card.Body className="p-3 p-md-4">
                  <h6 className="fw-bold text-secondary mb-4">Order Summary ( {cartItems.length} items in cart )</h6>
                  
                  <div className="checkout-items-list mb-4 border-bottom pb-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-4 position-relative">
                        
                        {/* Product Image Box with Badge Overlay */}
                        <div className="position-relative me-3 border rounded bg-white p-2" style={{width: '65px', height: '65px', flexShrink: 0}}>
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
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="fw-bold fs-6 lh-sm mb-1 pe-4 text-dark text-wrap">{item.name}</div>
                          {item.packSize && <div className="text-dark small fw-bold">Pack Size: <span className="text-secondary fw-normal">{item.packSize}</span></div>}
                        </div>

                        {/* Price */}
                        <div className="fw-bold fs-6 text-nowrap ms-2">
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

                    {discountAmount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success fw-500 align-items-center animate-fade-in">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="link" 
                            className="text-danger text-decoration-none p-0 me-2 small fw-bold" 
                            onClick={removeCoupon}
                            id="checkout-coupon-remove-btn"
                          >
                            [Remove]
                          </Button>
                          <span className="fw-bold">-${discountAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-4 pb-4 border-bottom">
                      <span className="text-secondary fw-500 d-flex align-items-center">
                        International shipping <i className="bi bi-info-circle ms-2 small"></i>
                      </span>
                      <span className={internationalShippingFee === 0 ? "fw-bold text-success animate-fade-in" : "fw-bold"}>
                        {internationalShippingFee === 0 ? "FREE" : `$${internationalShippingFee.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Order Total</span>
                      <span className="fw-bold fs-4">${newOrderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon Code Input */}
                  <div className="mt-4 pt-3 border-top">
                    <Form onSubmit={handleCouponSubmit}>
                      <Form.Label className="fw-bold mb-2 text-dark" style={{ fontSize: '0.85rem' }}>Have a Promo Code?</Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          placeholder="e.g. SAVE20"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError('');
                          }}
                          disabled={!!appliedCoupon}
                          className="bg-light border-secondary-subtle"
                          id="checkout-coupon-input"
                          aria-label="Promo Code"
                        />
                        <Button 
                          type="submit" 
                          variant={appliedCoupon ? "success" : "outline-primary"}
                          disabled={!couponCode || isApplying || !!appliedCoupon}
                          id="checkout-coupon-apply-btn"
                          className="fw-bold"
                        >
                          {isApplying ? 'Applying...' : appliedCoupon ? 'Applied' : 'Apply'}
                        </Button>
                      </InputGroup>
                      {couponError && <div className="text-danger small mt-1 fw-bold" style={{ fontSize: '0.75rem' }}>{couponError}</div>}
                      {appliedCoupon && (
                        <div className="text-success small mt-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                          ✓ Coupon applied: {appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}%` : `$${appliedCoupon.discount_value}`} off.
                        </div>
                      )}
                    </Form>
                  </div>
                </Card.Body>
              </Card>

              {/* Shipping Address Summary Card (Visible on Steps 2 & 3) */}
              {currentStep >= 2 && (
                <Card className="border shadow-sm rounded-4 mb-3">
                  <Card.Body className="p-3 p-md-4 position-relative">
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

    <style>{`
      .address-suggestions-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        z-index: 9999;
        max-height: 260px;
        overflow-y: auto;
        animation: dropdownFadeIn 0.15s ease;
      }

      @keyframes dropdownFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .address-suggestion-item {
        display: flex;
        align-items: flex-start;
        padding: 11px 14px;
        font-size: 0.875rem;
        color: #374151;
        cursor: pointer;
        border-bottom: 1px solid #f3f4f6;
        transition: background 0.15s ease;
        line-height: 1.4;
      }

      .address-suggestion-item:last-child {
        border-bottom: none;
      }

      .address-suggestion-item:hover {
        background: #eff6ff;
        color: #1d4ed8;
      }

      .address-suggestion-item span {
        white-space: normal;
        word-break: break-word;
      }

      .address-suggestions-dropdown::-webkit-scrollbar {
        width: 6px;
      }
      .address-suggestions-dropdown::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 99px;
      }
    `}</style>
    </>
  );
}

export default Checkout;
