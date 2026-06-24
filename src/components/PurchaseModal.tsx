import React, { useState } from 'react';
import { Zap, X, ExternalLink, Check } from 'lucide-react';
import CustomButton from './CustomComponents/CustomButton';
import { buttonVariants } from '../constants/buttonVariants';
import { paymentService } from '../services/api/paymentService';
import { useTokens } from '../context/tokenContext';
import { showErrorToast } from '../utils/toast';
import '../styles/PurchaseModal.css';

const PLANS = [
  {
    key: 'creator' as const,
    name: 'Creator Pack',
    price: '$9',
    tokens: 500,
    features: ['500 AI tokens (never expire)', '4K exports', 'Unlimited cloud projects', 'Email support'],
    popular: true,
  },
  {
    key: 'pro' as const,
    name: 'Pro Pack',
    price: '$29',
    tokens: 2000,
    features: ['2,000 AI tokens (never expire)', '4K & PDF exports', 'Priority AI queue', 'Priority support'],
    popular: false,
  },
];

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
  const { tokenBalance } = useTokens();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async (plan: 'creator' | 'pro') => {
    setLoadingPlan(plan);
    try {
      const checkoutUrl = await paymentService.createCheckout(plan);
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = checkoutUrl;
    } catch {
      showErrorToast(new Error('Failed to start checkout. Please try again.'));
      setLoadingPlan(null);
    }
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-card" onClick={(e) => e.stopPropagation()}>
        <div className="pm-header">
          <div className="pm-header-text">
            <Zap size={18} className="pm-header-icon" />
            <div>
              <h3 className="pm-title">Buy AI Tokens</h3>
              <p className="pm-subtitle">
                Current balance: <strong>{tokenBalance ?? '—'}</strong> tokens
              </p>
            </div>
          </div>
          <button className="pm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="pm-plans">
          {PLANS.map((plan) => (
            <div key={plan.key} className={`pm-plan ${plan.popular ? 'pm-plan--popular' : ''}`}>
              {plan.popular && <span className="pm-plan-badge">Most Popular</span>}
              <div className="pm-plan-header">
                <h4 className="pm-plan-name">{plan.name}</h4>
                <div className="pm-plan-price">
                  {plan.price}
                  <span className="pm-plan-period"> one-time</span>
                </div>
              </div>
              <div className="pm-plan-tokens">
                <Zap size={14} />
                <strong>{plan.tokens.toLocaleString()}</strong> tokens
              </div>
              <ul className="pm-plan-features">
                {plan.features.map((feat) => (
                  <li key={feat}>
                    <Check size={13} className="pm-plan-check" />
                    {feat}
                  </li>
                ))}
              </ul>
              <CustomButton
                variant={plan.popular ? buttonVariants.default : buttonVariants.outline}
                text={loadingPlan === plan.key ? 'Redirecting…' : `Buy ${plan.name}`}
                icon={<ExternalLink size={14} />}
                disabled={loadingPlan !== null}
                onClick={() => handlePurchase(plan.key)}
                className="pm-plan-btn"
              />
            </div>
          ))}
        </div>

        <p className="pm-footer-note">
          Powered by Stripe. Tokens never expire and are added instantly after payment.
        </p>
      </div>
    </div>
  );
};

export default PurchaseModal;
