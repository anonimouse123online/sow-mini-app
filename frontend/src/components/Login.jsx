// Email: admin123@gmail.com
// Password: password123
// this is my comment about the file not ai generated

import { useState } from 'react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch('https://mini-app-backend-bdlo.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Handle non-OK responses (404, 500, etc.)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || 'Ogiltig e-post eller lösenord. Försök igen.';
      setError(message);
      return;
    }

    const data = await response.json();
    console.log('Login successful!', data);
    if (onLogin) onLogin(data.user);
  } catch (err) {
    console.error('Network error:', err);
    setError('Något gick fel. Försök igen senare.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <header className="top-nav">
        <button
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span>☰</span>
        </button>

        <img
          src="https://storage.123fakturera.se/public/icons/diamond.png"
          alt="Logo"
          className="logo"
        />

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home">Hem</a>
          <a href="#order">Beställ</a>
          <a href="#customers">Våra Kunder</a>
          <a href="#about">Om oss</a>
          <a href="#contact">Kontakta oss</a>
          <div className="language-toggle">
            <span>Svenska</span>
            <img
              src="https://storage.123fakturere.no/public/flags/SE.png"
              alt="Svenska"
              className="flag"
            />
          </div>
        </nav>

        <div className="language-toggle-mobile">
          <span>Svenska</span>
          <img
            src="https://storage.123fakturere.no/public/flags/SE.png"
            alt="Svenska"
            className="flag"
          />
        </div>
      </header>

      <div className="login-card">
        <h1 className="login-title">Logga in</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Skriv in din epost adress</label>
            <input
              type="email"
              placeholder="Epost adress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Skriv in ditt lösenord</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                disabled={loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <div className="login-footer">
          <a href="#register">Registrera dig</a>
          <span> | </span>
          <a href="#forgot">Glömt lösenord?</a>
        </div>
      </div>

      <footer className="final-footer">
        <div className="footer-top">
          <div className="footer-left">
            <h2>123 Fakturera</h2>
          </div>
          <div className="footer-right">
            <nav className="footer-menu">
              <a href="#home">Hem</a>
              <a href="#order">Beställ</a>
              <a href="#contact">Kontakta oss</a>
            </nav>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="copyright">
          © Lättfaktura, CRO no. 638537, 2025. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
