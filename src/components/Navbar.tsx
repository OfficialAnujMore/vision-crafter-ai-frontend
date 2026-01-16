import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import CustomText from './CustomText';
import ProfileDropdown from './ProfileDropdown';
import { LANDING_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import '../styles/Navbar/Navbar.css';



const Navbar: React.FC = () => {
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


  const handleAuthAction = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.SIGNUP);
    }
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
          onClick={() => navigate(ROUTES.HOME)}
        />

        <div className="desktop-auth">
          {isAuthenticated ? (
            <div className="auth-section">
              <CustomButton variant='primary' text='Dashboard' onClick={() => {
                navigate(ROUTES.DASHBOARD)
              }} />
              <ProfileDropdown />
            </div>
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
