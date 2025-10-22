import React, { useState, useEffect } from 'react';
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

const DESKTOP_BREAKPOINT = 1200;


function isDesktopViewport() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

export default function Sidebar() {
  const [isDesktop, setIsDesktop] = useState(() => isDesktopViewport());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const nowIsDesktop = isDesktopViewport();
      setIsDesktop(nowIsDesktop);
      if (nowIsDesktop) {
        setIsMenuOpen(true); 
      } else {
        
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);


  useEffect(() => {
    if (isDesktop) {
      setIsMenuOpen(true);
    }
  }, [isDesktop]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const showSidebar = isDesktop || isMenuOpen;

  return (
    <>

      {!isDesktop && (
        <button
          className="floating-hamburger"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>
      )}

      <aside className={`sow-sidebar ${showSidebar ? 'open' : ''} ${isDesktop ? 'desktop' : ''}`}>
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


      {!isDesktop && isMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
}