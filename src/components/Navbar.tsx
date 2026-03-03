import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomComponents/CustomButton';
import CustomText from './CustomComponents/CustomText';
import ProfileDropdown from './ProfileDropdown';
import { LANDING_PAGE } from '../utils/local/en';
import { ROUTES } from '../constants/routes';
import '../styles/Navbar.css';
import { textVariant } from '../constants/textVariants';
import { LayoutDashboard } from 'lucide-react';
import { buttonVariants } from '../constants/buttonVariants';
import { authService } from '../services/api/authService';



const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
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

  const authButtonText = isAuthenticated ? 'Dashboard' : LANDING_PAGE.navLogin;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <CustomText
          variant={textVariant.h4}
          text={LANDING_PAGE.navLogo}
          onClick={() => navigate(ROUTES.HOME)}
        />

        <div className="desktop-auth">
          {isAuthenticated ? (
            <div className="auth-section">
              <CustomButton
                variant={buttonVariants.default}
                text='Dashboard'
                icon={<LayoutDashboard />}
                onClick={() => {
                  navigate(ROUTES.DASHBOARD)
                }} />
              <ProfileDropdown />
            </div>
          ) : (
            <CustomButton
              variant={buttonVariants.default}
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
