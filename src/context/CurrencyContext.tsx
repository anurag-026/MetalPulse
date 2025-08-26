import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { getSupportedCurrencies as utilGetSupportedCurrencies } from '../utils/currencyUtils';

export type CurrencyCode = string;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  supportedCurrencies: CurrencyCode[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = (): CurrencyContextType => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

interface Props { children: ReactNode }

export const CurrencyProvider: React.FC<Props> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const supportedCurrencies = useMemo(() => utilGetSupportedCurrencies(), []);

  const value = useMemo(() => ({ currency, setCurrency, supportedCurrencies }), [currency, supportedCurrencies]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
