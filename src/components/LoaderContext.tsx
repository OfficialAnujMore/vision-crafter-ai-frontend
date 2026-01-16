import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const value = useMemo(
    () => ({ isLoading, setLoading }),
    [isLoading, setLoading]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};