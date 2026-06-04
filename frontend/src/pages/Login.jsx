import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Tabs, Tab } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
  const [activeTab, setActiveTab] = useState('email');
  
  // Email state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithPhone, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Mock Google OAuth Token
      const mockToken = "mock_google_token_" + Math.random().toString(36).substring(7);
      await loginWithGoogle(mockToken);
      navigate('/');
    } catch (err) {
      setError('Google login failed.');
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
              <p className="text-muted">Sign in to continue to Medicare</p>
            </div>
            
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
                    <Form.Control 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="••••••••"
                      className="py-2"
                    />
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

            <div className="position-relative text-center my-4">
              <hr className="text-muted opacity-25" />
              <span className="bg-white px-3 text-muted small position-absolute top-50 start-50 translate-middle">
                OR
              </span>
            </div>

            <Button 
              variant="outline-dark" 
              className="w-100 py-2 fw-500 mb-4 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                alt="Google" 
                style={{ width: '20px', height: '20px', marginRight: '10px' }} 
              />
              Continue with Google
            </Button>

            <div className="text-center text-secondary">
              Don't have an account? <Link to="/signup" className="fw-bold text-decoration-none">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
