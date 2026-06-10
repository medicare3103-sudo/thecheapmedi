import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Tabs, Tab, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
  const [activeTab, setActiveTab] = useState('email');
  
  // Email state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithPhone } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isSessionExpired = queryParams.get('expired') === 'true';

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setOtpSent(true);
    // In a real app, this would trigger an SMS API
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await loginWithPhone(phone, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Header />
      <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
        <Card className="p-4 p-md-5 shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
              <p className="text-muted">Sign in to continue to The Cheap Pharma</p>
            </div>
            
            {isSessionExpired && !error && (
              <Alert variant="warning" className="rounded-3 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>Your session has expired. Please sign in again.</span>
              </Alert>
            )}
            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
            
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => { setActiveTab(k); setError(''); setOtpSent(false); }}
              className="mb-4 custom-tabs nav-fill"
            >
              <Tab eventKey="email" title="Email">
                <Form onSubmit={handleEmailLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-500 text-secondary">Username / Email</Form.Label>
                    <Form.Control 
                      type="text" 
                      required 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Enter your username"
                      className="py-2"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between">
                      <Form.Label className="fw-500 text-secondary">Password</Form.Label>
                      <Link to="/forgot-password" className="text-decoration-none small">Forgot Password?</Link>
                    </div>
                    <InputGroup>
                      <Form.Control 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="py-2"
                        autoComplete="current-password"
                      />
                      <Button 
                        type="button"
                        variant="outline-secondary" 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="d-flex align-items-center px-3"
                      >
                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form>
              </Tab>
              
              <Tab eventKey="phone" title="Phone">
                {!otpSent ? (
                  <Form onSubmit={handleSendOtp}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-500 text-secondary">Phone Number</Form.Label>
                      <Form.Control 
                        type="tel" 
                        required 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="+1 (555) 000-0000"
                        className="py-2"
                      />
                      <Form.Text className="text-muted">
                        We'll send you a One Time Password (OTP).
                      </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3">
                      Send OTP
                    </Button>
                  </Form>
                ) : (
                  <Form onSubmit={handlePhoneLogin}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-500 text-secondary">Enter OTP</Form.Label>
                      <Form.Control 
                        type="text" 
                        required 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder="123456"
                        className="py-2 text-center letter-spacing-2"
                        maxLength="6"
                      />
                      <Form.Text className="text-muted d-flex justify-content-between mt-2">
                        <span>Sent to {phone}</span>
                        <a href="#" onClick={() => setOtpSent(false)} className="text-decoration-none">Change</a>
                      </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify & Login'}
                    </Button>
                  </Form>
                )}
              </Tab>
            </Tabs>


            <div className="text-center text-secondary mb-3">
              Don't have an account? <Link to="/signup" className="fw-bold text-decoration-none">Sign Up</Link>
            </div>
            
            <div className="text-center pt-2 border-top" style={{ fontSize: '0.85rem' }}>
              <span className="text-muted">Having issues logging in? Contact support at </span>
              <a href="mailto:medicare3103@gmail.com?subject=Login%20Issue" className="fw-bold text-decoration-none text-primary hover-underline">
                medicare3103@gmail.com
              </a>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
