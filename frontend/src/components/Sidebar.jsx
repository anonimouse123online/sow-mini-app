import React, { useState } from 'react';
import '../styles/Sidebar.css';

const menuItems = [
  { icon: '📖', label: 'Invoice Journal' },
  { icon: '💰', label: 'Price List', active: true }, 
  { icon: '📦', label: 'Multiple Invoicing' },
  { icon: '❗', label: 'Unpaid Invoices' },
  { icon: '🎯', label: 'Offer' },
  { icon: '📊', label: 'Inventory Control' },
  { icon: '👥', label: 'Member Invoicing' },
  { icon: '📤', label: 'Import/Export' },
  { icon: '🔚', label: 'Log out' },
];

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className="floating-hamburger"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        ☰
      </button>


      <aside className={`sow-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-title">My Business</div>
        <nav>
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className={`menu-item ${item.active ? 'active' : ''}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.active && <span className="active-indicator"></span>}
            </div>
          ))}
        </nav>
      </aside>

      {isMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}