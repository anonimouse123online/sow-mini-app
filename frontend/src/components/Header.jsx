import React from 'react';
import '../styles/Header.css';

export default function Header() {
  return (
    <header className="sow-header">
      <div className="user-info">
        <span className="user-name">John Andre</span>
        <span className="company-name">Storfjord AS</span>
      </div>
      <div className="language-selector">
        <span>Norsk Bokmål</span>
        <span className="flag">🇳🇴</span>
      </div>
    </header>
  );
}