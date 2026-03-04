import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomComponents/CustomButton';
import CustomText from './CustomComponents/CustomText';
import ProfileDropdown from './ProfileDropdown';
import { LANDING_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import '../styles/Navbar.css';
import { textVariant } from '../constants/textVariants';
import { LayoutDashboard, Sparkles, Menu, X } from 'lucide-react';
import { buttonVariants } from '../constants/buttonVariants';
import { authService } from '../services/api/authService';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleAuthAction = useCallback(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.SIGNUP);
    }
    setMobileMenuOpen(false);
  }, [isAuthenticated, navigate]);

  const handleNavClick = useCallback((sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const authButtonText = isAuthenticated ? 'Dashboard' : LANDING_PAGE.navLogin;

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => navigate(ROUTES.HOME)}>
            <div className="navbar-logo-glow">
              <Sparkles className="navbar-logo-icon" size={20} />
            </div>
            <CustomText
              variant={textVariant.h4}
              text={LANDING_PAGE.navLogo}
            />
          </div>

          <div className="navbar-links-pill">
            <button className="navbar-link" onClick={() => handleNavClick('features')}>
              {LANDING_PAGE.navFeatures}
            </button>
            <button className="navbar-link" onClick={() => handleNavClick('pricing')}>
              {LANDING_PAGE.navPricing}
            </button>
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="auth-section">
                <CustomButton
                  variant={buttonVariants.icon}
                  icon={<LayoutDashboard size={18} />}
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                />
                <ProfileDropdown />
              </div>
            ) : (
              <button className="navbar-cta" onClick={handleAuthAction}>
                {authButtonText}
              </button>
            )}
          </div>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className={`navbar-mobile-overlay${mobileMenuOpen ? ' navbar-mobile-overlay--open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`navbar-mobile-drawer${mobileMenuOpen ? ' navbar-mobile-drawer--open' : ''}`}>
        <div className="navbar-mobile-drawer-links">
          <button className="navbar-mobile-link" onClick={() => handleNavClick('features')}>
            {LANDING_PAGE.navFeatures}
          </button>
          <button className="navbar-mobile-link" onClick={() => handleNavClick('pricing')}>
            {LANDING_PAGE.navPricing}
          </button>
        </div>
        <div className="navbar-mobile-drawer-auth">
          {isAuthenticated ? (
            <div className="auth-section">
              <CustomButton
                variant={buttonVariants.icon}
                icon={<LayoutDashboard size={18} />}
                onClick={() => {
                  navigate(ROUTES.DASHBOARD);
                  setMobileMenuOpen(false);
                }}
              />
              <ProfileDropdown />
            </div>
          ) : (
            <button className="navbar-cta navbar-cta--full" onClick={handleAuthAction}>
              {authButtonText}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
