import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const [authMode, setAuthMode] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to profile
  if (isAuthenticated) {
    navigate('/profile', { replace: true });
    return null;
  }

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'phone') {
      if (!/^[6-9]\d{9}$/.test(phone.trim())) {
        setError('Please enter a valid 10-digit Indian mobile number');
        return;
      }
    } else {
      if (!/\S+@\S+\.\S+/.test(email.trim())) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setOtpStep(true);
    setOtp('1234'); // Pre-fill mock OTP for convenience
    showToast('Mock OTP sent: 1234', 'info');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    login({
      name: name.trim() || 'Priya Sharma',
      phone: phone.trim() || '9876543210',
      email: email.trim() || 'priya.sharma@example.com',
    });

    showToast('Signed in successfully!', 'success');
    navigate(from, { replace: true });
  };

  const handleQuickDemoLogin = () => {
    login({
      name: 'Priya Sharma',
      phone: '9876543210',
      email: 'priya.sharma@example.com',
    });
    showToast('Welcome back, Priya!', 'success');
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-brand-header">
          <span className="login-cart-emoji">🛒</span>
          <h1 className="login-title">Welcome to Supermart</h1>
          <p className="login-subtitle">
            Fresh groceries delivered in 15 mins. Enter your mobile to sign in.
          </p>
        </div>

        {/* Quick Demo Login Pill */}
        <div className="quick-demo-login-box">
          <button
            type="button"
            className="btn-quick-demo"
            onClick={handleQuickDemoLogin}
          >
            ⚡ 1-Click Demo Login (Priya Sharma)
          </button>
        </div>

        <div className="login-divider">
          <span>or continue with credentials</span>
        </div>

        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="auth-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${authMode === 'phone' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('phone');
                  setError('');
                }}
              >
                Phone Number
              </button>
              <button
                type="button"
                className={`mode-btn ${authMode === 'email' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('email');
                  setError('');
                }}
              >
                Email Address
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="login-name">Your Name (Optional)</label>
              <input
                id="login-name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {authMode === 'phone' ? (
              <div className="form-group">
                <label htmlFor="login-phone">Mobile Number</label>
                <div className="phone-prefix-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    id="login-phone"
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <div className="form-error-alert">{error}</div>}

            <button type="submit" className="btn-login-submit">
              Continue with OTP →
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="otp-banner">
              <p>
                Enter the 4-digit code sent to{' '}
                <strong>{authMode === 'phone' ? `+91 ${phone}` : email}</strong>
              </p>
              <span className="mock-otp-pill">Demo OTP: 1234</span>
            </div>

            <div className="form-group">
              <label htmlFor="otp-input">Verification Code</label>
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="otp-field"
                required
              />
            </div>

            {error && <div className="form-error-alert">{error}</div>}

            <button type="submit" className="btn-login-submit">
              Verify & Sign In
            </button>

            <button
              type="button"
              className="btn-change-number"
              onClick={() => setOtpStep(false)}
            >
              ← Change {authMode === 'phone' ? 'phone number' : 'email'}
            </button>
          </form>
        )}

        <div className="login-perks-footer">
          <span>🔒 100% Privacy</span>
          <span>•</span>
          <span>⚡ Fast Checkout</span>
          <span>•</span>
          <span>🏷️ Exclusive Coupons</span>
        </div>
      </div>
    </div>
  );
};

