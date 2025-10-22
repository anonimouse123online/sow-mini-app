// src/App.jsx
import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Import your pages
import HomePage from './pages/HomePage';     // Your existing main page
import TermsPage from './pages/TermsPage';   // The new Terms page

// Shared Navbar (shown on all pages)
function Navbar() {
  const location = useLocation();

  // Hide navbar on Terms page if you prefer (optional)
  // if (location.pathname === '/terms') return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <img src="/logo.png" alt="123 Fakturera" className="h-10" />
        <div className="flex space-x-6 text-sm font-medium text-blue-600">
          <a href="/" className="hover:text-blue-800">Hem</a>
          <a href="/order" className="hover:text-blue-800">Beställ</a>
          <a href="/customers" className="hover:text-blue-800">Våra Kunder</a>
          <a href="/about" className="hover:text-blue-800">Om oss</a>
          <a href="/contact" className="hover:text-blue-800">Kontakta oss</a>
        </div>
      </div>
    </nav>
  );
}

// Main App
function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20"> {/* Push content below fixed navbar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </>
  );
}

export default App;