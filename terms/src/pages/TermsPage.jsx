// src/TermsPage.jsx
import { useState, useEffect } from 'react';
import './TermsPage.css';

export default function TermsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [terms, setTerms] = useState({ title: '', content: '' });

  // Get lang from URL query (e.g. ?lang=en)
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') === 'en' ? 'en' : 'sv';

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      setError(null);
      try {
        // 👇 Use full localhost URL to your Express backend
        const res = await fetch(`http://localhost:3001/api/terms?lang=${lang}`);

        // Optional: log response for debugging
        if (!res.ok) {
          const text = await res.text();
          console.error('API Error Response:', text);
          throw new Error(`Failed to load terms: ${res.status}`);
        }

        const data = await res.json();
        setTerms(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Could not load terms. Make sure the backend is running on localhost:3001.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [lang]);

  const isEnglish = lang === 'en';
  const backUrl = isEnglish ? '/en' : '/';
  const backButtonText = isEnglish ? 'Close and Go Back' : 'Stäng och Gå Tillbaka';
  const toggleLangUrl = isEnglish
    ? window.location.pathname
    : `${window.location.pathname}?lang=en`;

  return (
    <div className="terms-page">
      <nav className="terms-navbar">
        <div className="container">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="123 Fakturera"
          />
          <div>
            <a href={isEnglish ? '/en' : '/'}>Home</a>
            <a href={isEnglish ? '/en/order' : '/order'}>Order</a>
            <a href={isEnglish ? '/en/customers' : '/customers'}>Our Customers</a>
            <a href={isEnglish ? '/en/about' : '/about'}>About us</a>
            <a href={isEnglish ? '/en/contact' : '/contact'}>Contact Us</a>
            <a href={toggleLangUrl}>
              {isEnglish ? 'Svenska 🇸🇪' : 'English 🇬🇧'}
            </a>
          </div>
        </div>
      </nav>

      <div className="terms-container">
        <h1 className="terms-title">{terms.title || (isEnglish ? 'Terms' : 'Villkor')}</h1>
        <a href={backUrl} className="terms-back-button">
          {backButtonText}
        </a>

        {error ? (
          <div className="terms-error">{error}</div>
        ) : loading ? (
          <div className="terms-card">
            {isEnglish ? 'Loading terms...' : 'Laddar villkor...'}
          </div>
        ) : (
          <div className="terms-card">{terms.content}</div>
        )}
      </div>
    </div>
  );
}