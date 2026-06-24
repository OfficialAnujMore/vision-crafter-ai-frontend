import React from 'react';
import { Zap } from 'lucide-react';
import { useTokens } from '../context/tokenContext';
import '../styles/TokenBalance.css';

interface TokenBalanceProps {
  onClick?: () => void;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ onClick }) => {
  const { tokenBalance, isLoadingBalance } = useTokens();
  const isLow = tokenBalance !== null && tokenBalance < 10;

  return (
    <button
      className={`token-badge ${isLow ? 'token-badge--low' : ''}`}
      onClick={onClick}
      title={`${tokenBalance ?? '—'} AI tokens remaining — click to buy more`}
    >
      <Zap size={13} className="token-badge-icon" />
      <span>{isLoadingBalance ? '…' : (tokenBalance ?? '—')}</span>
    </button>
  );
};

export default TokenBalance;
