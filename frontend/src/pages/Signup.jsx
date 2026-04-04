import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';
import Button from '../components/Button';

const Signup = ({ onSuccess, onBackToLogin }) => {
  const { register, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !username || !password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const success = await register(email, username, password, fullName);
    if (success) {
      onSuccess && onSuccess();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button 
          className="auth-back-btn" 
          onClick={() => onBackToLogin && onBackToLogin()}
          title="Back to home"
        >
          ← Home
        </button>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start creating notes</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name (Optional)</label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {(localError || error) && (
            <div className="error-message">
              {localError || error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="auth-submit"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin && onBackToLogin(); }}>Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
