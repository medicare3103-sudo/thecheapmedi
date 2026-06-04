import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPassword } from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await forgotPassword(contact);
      setSuccess('OTP sent successfully!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Please check your contact detail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await verifyOtp(contact, otp);
      setSuccess('OTP verified! You can now reset your password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await resetPassword(contact, otp, newPassword);
      alert('Password reset successfully! Please sign in with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password.');
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
              <h2 className="fw-bold text-primary mb-2">Password Recovery</h2>
              <p className="text-muted">
                {step === 1 && "Enter your email or phone to receive an OTP."}
                {step === 2 && "Enter the 6-digit OTP sent to you."}
                {step === 3 && "Create a new strong password."}
              </p>
            </div>
            
            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
            {success && <Alert variant="success" className="rounded-3">{success}</Alert>}
            
            {step === 1 && (
              <Form onSubmit={handleSendOtp}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-500 text-secondary">Email or Phone Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    placeholder="e.g. john@example.com or +15550000000"
                    className="py-2"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={handleVerifyOtp}>
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
                  <Form.Text className="text-muted mt-2 d-block text-center">
                    (Use 123456 for demo purposes)
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button variant="link" className="w-100 text-decoration-none text-secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
              </Form>
            )}

            {step === 3 && (
              <Form onSubmit={handleResetPassword}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-500 text-secondary">New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    required 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Create a new password"
                    className="py-2"
                    minLength="6"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-3" disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form>
            )}

            {step === 1 && (
              <div className="text-center text-secondary mt-3">
                Remembered your password? <Link to="/login" className="fw-bold text-decoration-none">Sign In</Link>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default ForgotPassword;
