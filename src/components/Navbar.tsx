import React, { useState } from 'react';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import { LANDING_PAGE } from '../utils/local/en';
import '../styles/Navbar/Navbar.css';

interface NavbarProps {
  onNavClick: (section: 'home' | 'features' | 'pricing') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (section: 'home' | 'features' | 'pricing') => {
    onNavClick(section);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <CustomText 
          variant="h4" 
          value={LANDING_PAGE.navLogo}
          gradient={{
            from: '#7C5CFF',
            to: '#A795FF',
            angle: 135
          }}
        />
        
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <CustomText
            variant="p"
            value={LANDING_PAGE.navHome}
            color="secondary"
            onClick={() => handleNavClick('home')}
          />
          <CustomText
            variant="p"
            value={LANDING_PAGE.navFeatures}
            color="secondary"
            onClick={() => handleNavClick('features')}
          />
          <CustomText
            variant="p"
            value={LANDING_PAGE.navPricing}
            color="secondary"
            onClick={() => handleNavClick('pricing')}
          />
          <div className="mobile-login">
            <CustomButton
              variant="primary"
              text={LANDING_PAGE.navLogin}
              onClick={() => window.location.href = '/login'}
            />
          </div>
        </div>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="desktop-login">
          <CustomButton
            variant="primary"
            text={LANDING_PAGE.navLogin}
            onClick={() => window.location.href = '/login'}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
