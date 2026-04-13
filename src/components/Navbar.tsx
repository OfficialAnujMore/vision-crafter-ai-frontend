import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomComponents/CustomButton';
import ProfileDropdown from './ProfileDropdown';
import { LANDING_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import '../styles/Navbar.css';
import { LayoutDashboard, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { buttonVariants } from '../constants/buttonVariants';
import { authService } from '../services/api/authService';

const NAV_SECTIONS = [
  { id: 'features', label: LANDING_PAGE.navFeatures },
  { id: 'pricing', label: LANDING_PAGE.navPricing },
  { id: 'about', label: LANDING_PAGE.navAbout },
];

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
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
    const sections = NAV_SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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

  const activeIndex = useMemo(
    () => NAV_SECTIONS.findIndex((s) => s.id === activeSection),
    [activeSection]
  );

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => navigate(ROUTES.HOME)}>
            <div className="navbar-logo-glow">
              <Sparkles className="navbar-logo-icon" size={20} />
            </div>
            <span className="navbar-logo-text">
              Vision<span className="navbar-logo-text-accent">Crafter</span>
            </span>
          </div>

          <div
            className="navbar-links-pill"
            data-active-index={activeIndex >= 0 ? activeIndex : undefined}
          >
            {activeIndex >= 0 && (
              <span
                className="navbar-link-indicator"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
            )}
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`navbar-link${activeSection === s.id ? ' navbar-link--active' : ''}`}
                onClick={() => handleNavClick(s.id)}
              >
                {s.label}
              </button>
            ))}
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
                <span>{authButtonText}</span>
                <ArrowRight size={15} className="navbar-cta-arrow" />
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
          {NAV_SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`navbar-mobile-link${activeSection === s.id ? ' navbar-mobile-link--active' : ''}`}
              onClick={() => handleNavClick(s.id)}
            >
              {s.label}
            </button>
          ))}
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
              <span>{authButtonText}</span>
              <ArrowRight size={15} className="navbar-cta-arrow" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
