import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api/authService';
import { ROUTES } from '../constants/routes';
import CustomButton from './CustomComponents/CustomButton';
import CustomText from './CustomComponents/CustomText';
import '../styles/ProfileDropdown.css';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';
import { LogOut, Settings, LayoutDashboard, User } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
}

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useState<User | null>(() => authService.getCurrentUser());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await authService.logout();
    setIsOpen(false);
    navigate(ROUTES.HOME);
    window.location.href = ROUTES.HOME;
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="pd-container" ref={dropdownRef}>
      <button
        className="pd-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="pd-trigger-img" referrerPolicy="no-referrer" />
        ) : (
          <div className="pd-trigger-placeholder">
            {getInitials(user.name)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="pd-dropdown">
          {/* User info header */}
          <div className="pd-header">
            <div className="pd-header-avatar">
              {user.picture ? (
                <img src={user.picture} alt={user.name} className="pd-header-img" referrerPolicy="no-referrer" />
              ) : (
                <div className="pd-header-placeholder">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <div className="pd-header-info">
              <CustomText
                variant={textVariant.h4}
                text={user.name}
              />
              <CustomText
                variant={textVariant.p}
                text={user.email}
              />
            </div>
          </div>

          <div className="pd-divider" />

          {/* Menu items */}
          <div className="pd-menu">
            <CustomButton
              className="pd-menu-item"
              variant={buttonVariants.link}
              icon={<LayoutDashboard size={16} />}
              text="Dashboard"
              onClick={() => {
                navigate(ROUTES.DASHBOARD);
                setIsOpen(false);
              }}
            />
            <CustomButton
              className="pd-menu-item"
              variant={buttonVariants.link}
              icon={<User size={16} />}
              text="Profile"
              onClick={() => {
                navigate(ROUTES.PROFILE);
                setIsOpen(false);
              }}
            />
            <CustomButton
              className="pd-menu-item"
              variant={buttonVariants.link}
              icon={<Settings size={16} />}
              text="Settings"
              disabled
            />
          </div>

          <div className="pd-divider" />

          {/* Logout */}
          <div className="pd-menu">
            <CustomButton
              className="pd-menu-item pd-menu-item--danger"
              variant={buttonVariants.link}
              icon={<LogOut size={16} />}
              text="Log out"
              onClick={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
