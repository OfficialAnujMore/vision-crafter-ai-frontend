/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { paymentService } from '../services/api/paymentService';
import { authService } from '../services/api/authService';

interface TokenContextType {
  tokenBalance: number | null;
  isLoadingBalance: boolean;
  refreshBalance: () => Promise<void>;
  deductOptimistic: (amount: number) => void;
}

export const TokenContext = createContext<TokenContextType | null>(null);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tokenBalance, setTokenBalance] = useState<number | null>(() => {
    const cached = localStorage.getItem('token_balance');
    return cached ? parseInt(cached) : null;
  });
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!authService.isAuthenticated()) return;
    setIsLoadingBalance(true);
    try {
      const data = await paymentService.getBalance();
      setTokenBalance(data.balance);
      localStorage.setItem('token_balance', String(data.balance));
    } catch {
      // Keep cached value on error
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  const deductOptimistic = useCallback((amount: number) => {
    setTokenBalance(prev => {
      const next = Math.max(0, (prev ?? 0) - amount);
      localStorage.setItem('token_balance', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return (
    <TokenContext.Provider value={{ tokenBalance, isLoadingBalance, refreshBalance, deductOptimistic }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useTokens must be used within TokenProvider');
  return ctx;
};
