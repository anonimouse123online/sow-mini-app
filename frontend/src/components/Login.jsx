// Email: admin123@gmail.com
// Password: password123
// this is my comment about the file not ai generated

import { useState, useEffect } from 'react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('sv'); // default
  const [translations, setTranslations] = useState({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  // Define fallback translations (hardcoded safety net)
  const fallbackTranslations = {
    sv: {
      login_title: 'Logga in',
      email_label: 'Skriv in din epost adress',
      email_placeholder: 'Epost adress',
      password_label: 'Skriv in ditt lösenord',
      password_placeholder: 'Lösenord',
      show_password: 'Visa lösenord',
      hide_password: 'Dölj lösenord',
      login_button: 'Logga in',
      logging_in: 'Loggar in...',
      register_link: 'Registrera dig',
      forgot_password: 'Glömt lösenord?',
      home: 'Hem',
      order: 'Beställ',
      customers: 'Våra Kunder',
      about: 'Om oss',
      contact: 'Kontakta oss',
      error_invalid_credentials: 'Ogiltig e-post eller lösenord. Försök igen.',
      error_network: 'Något gick fel. Försök igen senare.'
    },
    en: {
      login_title: 'Log in',
      email_label: 'Enter your email address',
      email_placeholder: 'Email address',
      password_label: 'Enter your password',
      password_placeholder: 'Password',
      show_password: 'Show password',
      hide_password: 'Hide password',
      login_button: 'Log in',
      logging_in: 'Logging in...',
      register_link: 'Register',
      forgot_password: 'Forgot password?',
      home: 'Home',
      order: 'Order',
      customers: 'Our Customers',
      about: 'About Us',
      contact: 'Contact Us',
      error_invalid_credentials: 'Invalid email or password. Please try again.',
      error_network: 'Something went wrong. Please try again later.'
    }
  };

  // Fetch translations when language changes
  useEffect(() => {
    setIsLoadingTranslations(true);
    const fetchTranslations = async () => {
      try {
        const res = await fetch(`https://mini-app-backend-bdlo.onrender.com/api/translations/${currentLanguage}`);
        if (!res.ok) throw new Error('Failed to load translations');
        const data = await res.json();
        setTranslations(data);
      } catch (err) {
        console.error('Translation fetch error:', err);
        // Use fallback translations
        setTranslations(fallbackTranslations[currentLanguage]);
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    fetchTranslations();
  }, [currentLanguage]);

  // Helper: returns translation or fallback
  const t = (key) => {
    if (isLoadingTranslations) {
      return fallbackTranslations[currentLanguage][key] || key;
    }
    return translations[key] || fallbackTranslations[currentLanguage][key] || key;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://mini-app-backend-bdlo.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || t('error_invalid_credentials');
        setError(message);
        return;
      }

      const data = await response.json();
      console.log('Login successful!', data);
      if (onLogin) onLogin(data.user);
    } catch (err) {
      console.error('Network error:', err);
      setError(t('error_network'));
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
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
          <a href="#home">{t('home')}</a>
          <a href="#order">{t('order')}</a>
          <a href="#customers">{t('customers')}</a>
          <a href="#about">{t('about')}</a>
          <a href="#contact">{t('contact')}</a>
          <div className="language-toggle" onClick={toggleLanguageDropdown}>
            <span>
              {currentLanguage === 'sv' ? 'Svenska' : 'English'}
            </span>
            <img
              src={
                currentLanguage === 'sv'
                  ? 'https://storage.123fakturere.no/public/flags/SE.png'
                  : 'https://storage.123fakturere.no/public/flags/GB.png'
              }
              alt={currentLanguage === 'sv' ? 'Svenska' : 'English'}
              className="flag"
            />
            <span className="dropdown-arrow">▼</span>

            {isLanguageDropdownOpen && (
              <div className="language-dropdown-menu">
                <div
                  className="language-option"
                  onClick={() => handleLanguageChange('sv')}
                >
                  <img
                    src="https://storage.123fakturere.no/public/flags/SE.png"
                    alt="Svenska"
                    className="flag small"
                  />
                  <span>Svenska</span>
                </div>
                <div
                  className="language-option"
                  onClick={() => handleLanguageChange('en')}
                >
                  <img
                    src="https://storage.123fakturere.no/public/flags/GB.png"
                    alt="English"
                    className="flag small"
                  />
                  <span>English</span>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile version */}
        <div className="language-toggle-mobile" onClick={toggleLanguageDropdown}>
          <span>
            {currentLanguage === 'sv' ? 'Svenska' : 'English'}
          </span>
          <img
            src={
              currentLanguage === 'sv'
                ? 'https://storage.123fakturere.no/public/flags/SE.png'
                : 'https://storage.123fakturere.no/public/flags/GB.png'
            }
            alt={currentLanguage === 'sv' ? 'Svenska' : 'English'}
            className="flag"
          />
          <span className="dropdown-arrow">▼</span>

          {isLanguageDropdownOpen && (
            <div className="language-dropdown-menu mobile">
              <div
                className="language-option"
                onClick={() => handleLanguageChange('sv')}
              >
                <img
                  src="https://storage.123fakturere.no/public/flags/SE.png"
                  alt="Svenska"
                  className="flag small"
                />
                <span>Svenska</span>
              </div>
              <div
                className="language-option"
                onClick={() => handleLanguageChange('en')}
              >
                <img
                  src="https://storage.123fakturere.no/public/flags/GB.png"
                  alt="English"
                  className="flag small"
                />
                <span>English</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="login-card">
        <h1 className="login-title">{t('login_title')}</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('email_label')}</label>
            <input
              type="email"
              placeholder={t('email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>{t('password_label')}</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('hide_password') : t('show_password')}
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
            {loading ? t('logging_in') : t('login_button')}
          </button>
        </form>
        <div className="login-footer">
          <a href="#register">{t('register_link')}</a>
          <span> | </span>
          <a href="#forgot">{t('forgot_password')}</a>
        </div>
      </div>

      <footer className="final-footer">
        <div className="footer-top">
          <div className="footer-left">
            <h2>123 Fakturera</h2>
          </div>
          <div className="footer-right">
            <nav className="footer-menu">
              <a href="#home">{t('home')}</a>
              <a href="#order">{t('order')}</a>
              <a href="#contact">{t('contact')}</a>
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