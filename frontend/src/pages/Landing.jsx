import React, { useState } from 'react';
import '../styles/Landing.css';

const Landing = ({ onLoginClick, onSignupClick }) => {
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'how-it-works', label: 'How it Works', icon: '⚙️' },
    { id: 'pricing', label: 'Pricing', icon: '💰' }
  ];

  return (
    <div className="landing">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-wrapper">
          <div className="nav-pill">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.id);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="nav-buttons">
            <button className="btn-nav-login" onClick={onLoginClick}>
              Login
            </button>
            <button className="btn-nav-signup" onClick={onSignupClick}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-background"></div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            YOUR NOTES
            <br />
            APP IS HERE.
          </h1>
          
          <p className="hero-subtitle">
            Keep your thoughts organized, secured, and always accessible. 
            Write, lock, and share notes instantly.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onSignupClick}>
              Start Writing Notes
            </button>
            <button className="btn btn-secondary">
              Watch Demo
            </button>
          </div>

          <p className="hero-meta">
            Join thousands of users. No credit card required.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="features-container">
          <h2>Everything You Need</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Lock Your Notes</h3>
              <p>Protect sensitive notes with PIN-based encryption. Only you can access them.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Share Instantly</h3>
              <p>Generate shareable links. Control who sees what. Revoke access anytime.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Search Everything</h3>
              <p>Find any note instantly. Search by title, content, or tags.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Rich Formatting</h3>
              <p>Write with bold, italics, code blocks. Support for multiple content types.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Organize with Tags</h3>
              <p>Categorize notes with custom tags. Filter and sort your collection.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Real-time syncing. Access your notes from anywhere, instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="how-container">
          <h2>How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <h3>Sign Up</h3>
              <p>Create your account in seconds. No complicated setup.</p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <h3>Write Notes</h3>
              <p>Start writing. Use rich formatting, add tags, and organize.</p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <h3>Secure & Share</h3>
              <p>Lock sensitive notes or share with others via secure links.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="pricing-container">
          <h2>Simple, Transparent Pricing</h2>
          <p className="pricing-subtitle">All features included. No hidden fees.</p>
          
          <div className="pricing-card">
            <h3>Free Forever</h3>
            <p className="price">$0</p>
            <ul className="pricing-features">
              <li>✓ Unlimited notes</li>
              <li>✓ Lock & share notes</li>
              <li>✓ Full search</li>
              <li>✓ Rich formatting</li>
              <li>✓ Tag organization</li>
            </ul>
            <button className="btn btn-primary" onClick={onSignupClick}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-footer">
        <div className="cta-content">
          <h2>Ready to organize your thoughts?</h2>
          <p>Join thousands of users keeping their notes secure and organized.</p>
          
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={onSignupClick}>
              Start Free
            </button>
            <button className="btn btn-secondary" onClick={onLoginClick}>
              Already have an account?
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2026 Notes App. Built for clarity and security.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
