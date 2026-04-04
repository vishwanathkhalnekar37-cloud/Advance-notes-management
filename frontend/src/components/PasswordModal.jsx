import React, { useState } from 'react';
import '../styles/PasswordModal.css';

const PasswordModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    const success = await onSubmit(password);
    if (!success) {
      setError('Invalid password');
      setPassword('');
    } else {
      setPassword('');
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div className="password-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="password-modal-header">
          <h2>🔒 Unlock Note</h2>
          <button className="password-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="password-modal-body">
          <p className="password-modal-description">This note is locked. Please enter the password to view it.</p>
          
          <input
            type="password"
            className="password-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            autoFocus
            disabled={loading}
          />
          
          {error && <div className="password-error">{error}</div>}
        </div>
        
        <div className="password-modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Unlocking...' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
