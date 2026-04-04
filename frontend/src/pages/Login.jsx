import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';
import Button from '../components/Button';

const Login = ({ onSuccess, onSignup, onBackToLanding }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      onSuccess && onSuccess();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button 
          className="auth-back-btn" 
          onClick={() => onBackToLanding && onBackToLanding()}
          title="Back to home"
        >
          ← Home
        </button>

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to access your notes</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSignup && onSignup(); }}>Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
