import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api/authService';
import { ROUTES } from '../constants/routes';
import CustomButton from './CustomComponents/CustomButton';
import CustomText from './CustomComponents/CustomText';
import '../styles/ProfileDropdown.css';
import { textVariant } from '../constants/textVarients';
import { buttonVarients } from '../constants/buttonVarients';

interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
}

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

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
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button
        className="profile-avatar-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
      >
        {user.picture ? (
          <img src={user.picture} alt={user.name} className="profile-avatar-image" />
        ) : (
          <div className="profile-avatar-placeholder">
            {getInitials(user.name)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="profile-dropdown-modal">
          <div className="profile-dropdown-header">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="profile-modal-image" />
            ) : (
              <div className="profile-modal-placeholder">
                {getInitials(user.name)}
              </div>
            )}
          </div>
          
          <div className="profile-dropdown-info">
            <CustomText 
              variant={textVariant.h4}
              text={user.name} 
            />
            <CustomText 
              variant={textVariant.p}
              text={user.email} 
            />
          </div>

          <div className="profile-dropdown-actions">
            <CustomButton
              variant={buttonVarients.default}
              text="Logout"
              onClick={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
