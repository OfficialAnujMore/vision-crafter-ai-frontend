import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ROUTES } from '../constants/routes';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Routes where navbar should NOT be displayed
  const noNavbarRoutes = [ROUTES.SIGNUP];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname as typeof noNavbarRoutes[number]);

  return (
    <div className="main-layout">
      {shouldShowNavbar && <Navbar/>}
      <main className={`layout-content ${shouldShowNavbar ? '' : 'no-navbar'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
