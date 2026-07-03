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

type NavItemType = 'home' | 'scroll' | 'mail';

interface NavItem {
  id: string;
  label: string;
  type: NavItemType;
  href?: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: LANDING_PAGE.navHome, type: 'home' },
  { id: 'features', label: LANDING_PAGE.navFeatures, type: 'scroll' },
  { id: 'pricing', label: LANDING_PAGE.navPricing, type: 'scroll' },
  { id: 'about', label: LANDING_PAGE.navAbout, type: 'scroll' },
];

// Only scroll-type items need IntersectionObserver
const SCROLL_SECTIONS = ALL_NAV_ITEMS.filter((i) => i.type === 'scroll');

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => setIsAuthenticated(authService.isAuthenticated());
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
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min((window.scrollY / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = SCROLL_SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActiveSection(visible[0]?.target.id ?? '');
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleAuthAction = useCallback(() => {
    navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.SIGNUP);
    setMobileMenuOpen(false);
  }, [isAuthenticated, navigate]);

  const handleHomeClick = useCallback(() => {
    setMobileMenuOpen(false);
    if (window.location.pathname === ROUTES.HOME) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  const handleScrollClick = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 'home' is active when no scroll-section is intersecting
  const currentActiveId = activeSection || 'home';

  const activeIndex = useMemo(
    () => ALL_NAV_ITEMS.findIndex((item) => item.id === currentActiveId),
    [currentActiveId]
  );

  const authButtonText = isAuthenticated ? 'Dashboard' : LANDING_PAGE.navLogin;

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isActive = item.id === currentActiveId;
    const linkClass = isMobile
      ? `navbar-mobile-link${isActive ? ' navbar-mobile-link--active' : ''}`
      : `navbar-link${isActive ? ' navbar-link--active' : ''}`;

    if (item.type === 'mail') {
      return (
        <a key={item.id} href={item.href} className={linkClass}>
          {item.label}
        </a>
      );
    }

    const onClick = item.type === 'home'
      ? handleHomeClick
      : () => handleScrollClick(item.id);

    return (
      <button key={item.id} className={linkClass} onClick={onClick}>
        {item.label}
        {!isMobile && isActive && <span className="navbar-link-dot" aria-hidden="true" />}
      </button>
    );
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar-container">

          {/* Logo */}
          <div className="navbar-logo" onClick={() => navigate(ROUTES.HOME)}>
            <div className="navbar-logo-glow">
              <Sparkles className="navbar-logo-icon" size={20} />
            </div>
            <span className="navbar-logo-text">
              Vision Crafter AI
            </span>
          </div>

          {/* Single pill: Home · Features · Pricing · About · Contact */}
          <div
            className="navbar-links-pill"
            data-active-index={activeIndex >= 0 ? activeIndex : undefined}
            style={{ '--nav-count': ALL_NAV_ITEMS.length } as React.CSSProperties}
          >
            {activeIndex >= 0 && (
              <span
                className="navbar-link-indicator"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
            )}
            {ALL_NAV_ITEMS.map((item) => renderNavItem(item))}
          </div>

          {/* Auth */}
          <div className="navbar-auth">
            <div className="navbar-divider" aria-hidden="true" />
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

          {/* Mobile toggle */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Scroll progress bar */}
        <div
          className="navbar-progress-bar"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
      </nav>

      {/* Mobile overlay */}
      <div
        className={`navbar-mobile-overlay${mobileMenuOpen ? ' navbar-mobile-overlay--open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`navbar-mobile-drawer${mobileMenuOpen ? ' navbar-mobile-drawer--open' : ''}`}>
        <div className="navbar-mobile-drawer-header">
          <div
            className="navbar-logo"
            onClick={() => { navigate(ROUTES.HOME); setMobileMenuOpen(false); }}
          >
            <div className="navbar-logo-glow">
              <Sparkles className="navbar-logo-icon" size={18} />
            </div>
            <span className="navbar-logo-text">
              Vision<span className="navbar-logo-text-accent">Crafter</span>
            </span>
          </div>
          <span className="navbar-mobile-drawer-badge">AI Image Editor</span>
        </div>

        <div className="navbar-mobile-drawer-links">
          {ALL_NAV_ITEMS.map((item) => renderNavItem(item, true))}
        </div>

        <div className="navbar-mobile-drawer-auth">
          {isAuthenticated ? (
            <div className="auth-section">
              <CustomButton
                variant={buttonVariants.icon}
                icon={<LayoutDashboard size={18} />}
                onClick={() => { navigate(ROUTES.DASHBOARD); setMobileMenuOpen(false); }}
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
