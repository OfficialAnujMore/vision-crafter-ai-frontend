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
  Zap,
  ExternalLink,
  Check,
} from 'lucide-react';
import CustomText from '../components/CustomComponents/CustomText';
import CustomButton from '../components/CustomComponents/CustomButton';
import CustomInput from '../components/CustomComponents/CustomInput';
import PurchaseModal from '../components/PurchaseModal';
import { authService } from '../services/api/authService';
import { useTokens } from '../context/tokenContext';
import { paymentService } from '../services/api/paymentService';
import type { PurchasesResponse } from '../services/api/paymentService';
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
  const [user] = useState<ProfileUser | null>(() => authService.getCurrentUser());
  const [displayName, setDisplayName] = useState(() => authService.getCurrentUser()?.name ?? '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchases, setPurchases] = useState<PurchasesResponse['purchases']>([]);
  const { tokenBalance } = useTokens();

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.SIGNUP);
      return;
    }
    paymentService.getPurchases().then((data) => setPurchases(data.purchases)).catch(() => {});
  }, [navigate, user]);

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
              <Zap size={16} className="profile-zap-icon" />
              <div>
                <CustomText variant={textVariant.h4} text="Token balance" />
                <CustomText
                  variant={textVariant.p}
                  text={tokenBalance !== null ? `${tokenBalance} AI tokens remaining` : 'Loading…'}
                />
              </div>
            </div>
            <CustomButton
              variant={buttonVariants.default}
              icon={<ExternalLink size={14} />}
              text="Buy Tokens"
              onClick={() => setIsPurchaseOpen(true)}
            />
          </div>

          {purchases.length > 0 && (
            <div className="profile-purchase-history">
              <CustomText variant={textVariant.p} text="Purchase history" />
              <div className="profile-purchase-list">
                {purchases.map((p) => (
                  <div key={p.id} className="profile-purchase-item">
                    <div className="profile-purchase-info">
                      <Zap size={13} />
                      <span>+{p.tokens_granted.toLocaleString()} tokens</span>
                      <span className="profile-purchase-amount">${(p.amount_cents / 100).toFixed(2)}</span>
                    </div>
                    <div className="profile-purchase-meta">
                      {p.status === 'completed' ? (
                        <span className="profile-purchase-status profile-purchase-status--ok">
                          <Check size={11} /> Fulfilled
                        </span>
                      ) : (
                        <span className="profile-purchase-status profile-purchase-status--pending">
                          Pending
                        </span>
                      )}
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <PurchaseModal isOpen={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />

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
