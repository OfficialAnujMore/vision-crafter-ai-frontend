import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CreditCard,
  LogOut,
  Mail,
  Palette,
  Shield,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import CustomText from '../components/CustomComponents/CustomText';
import CustomButton from '../components/CustomComponents/CustomButton';
import CustomInput from '../components/CustomComponents/CustomInput';
import { authService } from '../services/api/authService';
import { ROUTES } from '../constants/routes';
import { textVariant } from '../constants/textVariants';
import { buttonVariants } from '../constants/buttonVariants';
import '../styles/Profile.css';

interface ProfileUser {
  id: number;
  name: string;
  email: string;
  picture: string | null;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (!current) {
      navigate(ROUTES.SIGNUP);
      return;
    }
    setUser(current);
    setDisplayName(current.name ?? '');
  }, [navigate]);

  const memberSince = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = ROUTES.HOME;
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-back">
        <CustomButton
          variant={buttonVariants.link}
          icon={<ArrowLeft size={16} />}
          text="Back to Dashboard"
          onClick={() => navigate(ROUTES.DASHBOARD)}
        />
      </div>

      <section className="profile-header-card">
        <div className="profile-header-avatar">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="profile-header-img"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="profile-header-placeholder">{getInitials(user.name)}</div>
          )}
        </div>
        <div className="profile-header-info">
          <CustomText variant={textVariant.h2} text={user.name} />
          <CustomText variant={textVariant.p} text={user.email} />
          <CustomText
            variant={textVariant.p}
            text={`Member since ${memberSince}`}
          />
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <UserIcon size={18} />
          <CustomText variant={textVariant.h3} text="Basic details" />
        </div>
        <div className="profile-section-body profile-grid-2">
          <CustomInput
            label="Display name"
            value={displayName}
            onChange={(value) => setDisplayName(String(value))}
            placeholder="Your name"
          />
          <CustomInput
            label="Email"
            value={user.email}
            onChange={() => {}}
            type="email"
            disabled
            icon={<Mail size={16} />}
          />
        </div>
        <div className="profile-section-actions">
          <CustomButton
            variant={buttonVariants.default}
            text="Save changes"
            disabled
          />
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <Palette size={18} />
          <CustomText variant={textVariant.h3} text="Preferences" />
        </div>
        <div className="profile-section-body">
          <div className="profile-row">
            <div className="profile-row-info">
              <CustomText variant={textVariant.h4} text="Theme" />
              <CustomText
                variant={textVariant.p}
                text="Dark theme (default)"
              />
            </div>
            <CustomButton
              variant={buttonVariants.outline}
              text="Coming soon"
              disabled
            />
          </div>

          <div className="profile-row">
            <div className="profile-row-info">
              <Bell size={16} />
              <div>
                <CustomText variant={textVariant.h4} text="Email notifications" />
                <CustomText
                  variant={textVariant.p}
                  text="Get notified about project activity"
                />
              </div>
            </div>
            <label className="profile-toggle">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span className="profile-toggle-slider" />
            </label>
          </div>

          <div className="profile-row">
            <div className="profile-row-info">
              <Sparkles size={16} />
              <div>
                <CustomText variant={textVariant.h4} text="Product updates" />
                <CustomText
                  variant={textVariant.p}
                  text="Occasional news about new features"
                />
              </div>
            </div>
            <label className="profile-toggle">
              <input
                type="checkbox"
                checked={productUpdates}
                onChange={(e) => setProductUpdates(e.target.checked)}
              />
              <span className="profile-toggle-slider" />
            </label>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <CreditCard size={18} />
          <CustomText variant={textVariant.h3} text="Plan & credits" />
        </div>
        <div className="profile-section-body">
          <div className="profile-row">
            <div className="profile-row-info">
              <CustomText variant={textVariant.h4} text="Free plan" />
              <CustomText
                variant={textVariant.p}
                text="Upgrade to unlock AI generations and higher export limits"
              />
            </div>
            <CustomButton
              variant={buttonVariants.default}
              text="Upgrade"
              disabled
            />
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <Shield size={18} />
          <CustomText variant={textVariant.h3} text="Security" />
        </div>
        <div className="profile-section-body">
          <div className="profile-row">
            <div className="profile-row-info">
              <CustomText variant={textVariant.h4} text="Sign-in method" />
              <CustomText variant={textVariant.p} text="Google OAuth" />
            </div>
          </div>
          <div className="profile-row">
            <div className="profile-row-info">
              <CustomText variant={textVariant.h4} text="Active sessions" />
              <CustomText
                variant={textVariant.p}
                text="Manage devices signed in to your account"
              />
            </div>
            <CustomButton
              variant={buttonVariants.outline}
              text="Coming soon"
              disabled
            />
          </div>
        </div>
      </section>

      <section className="profile-section profile-section--danger">
        <div className="profile-section-head">
          <CustomText variant={textVariant.h3} text="Account" />
        </div>
        <div className="profile-section-body">
          <div className="profile-row">
            <div className="profile-row-info">
              <CustomText variant={textVariant.h4} text="Log out" />
              <CustomText
                variant={textVariant.p}
                text="End your current session on this device"
              />
            </div>
            <CustomButton
              variant={buttonVariants.outline}
              icon={<LogOut size={16} />}
              text="Log out"
              onClick={handleLogout}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
