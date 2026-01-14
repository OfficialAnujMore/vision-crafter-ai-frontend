import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import ProfileDropdown from './ProfileDropdown';
import { LANDING_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import '../styles/Navbar/Navbar.css';

interface NavbarProps {
  onNavClick?: (section: 'home' | 'features' | 'pricing') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('access_token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for storage changes (e.g., when logging in from another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavClick = (section: 'home' | 'features' | 'pricing') => {
    if (onNavClick) {
      onNavClick(section);
    }
    setIsMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.SIGNUP);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Listen for auth state changes to update navbar
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };

    window.addEventListener('storage', handleAuthChange);
    
    // Also listen for custom auth events
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const authButtonText = isAuthenticated ? 'Dashboard' : LANDING_PAGE.navLogin;

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
          onClick={() => navigate(ROUTES.HOME)}
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
          <div className="mobile-auth">
            <CustomButton
              variant="primary"
              text={authButtonText}
              onClick={handleAuthAction}
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

        <div className="desktop-auth">
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <CustomButton
              variant="primary"
              text={authButtonText}
              onClick={handleAuthAction}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
