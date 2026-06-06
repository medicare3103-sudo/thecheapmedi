import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await signupUser({ 
        username: name, 
        email: email, 
        phone_number: mobile, 
        password: password 
      });
      alert('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
        <Card className="p-4 p-md-5 shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '500px' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary mb-2">Create an Account</h2>
              <p className="text-muted">Join Medicare for secure shopping</p>
            </div>
            
            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
            
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-500 text-secondary">Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. John Doe"
                  className="py-2"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-500 text-secondary">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="john@example.com"
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-500 text-secondary">Mobile Number</Form.Label>
                <Form.Control 
                  type="tel" 
                  required 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)} 
                  placeholder="+1 (555) 000-0000"
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-500 text-secondary">Password</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Create a strong password"
                    className="py-2"
                    minLength="6"
                    autoComplete="new-password"
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

              <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-4" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Register Now'}
              </Button>
            </Form>

            <div className="text-center text-secondary">
              Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Sign In</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default Signup;
