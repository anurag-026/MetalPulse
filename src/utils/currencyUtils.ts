export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  icon: string;
  position: 'before' | 'after';
  decimalPlaces: number;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    icon: '₹',
    position: 'before',
    decimalPlaces: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    icon: '$',
    position: 'before',
    decimalPlaces: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    icon: '€',
    position: 'before',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    icon: '£',
    position: 'before',
    decimalPlaces: 2,
  },
};

export const PRIMARY_CURRENCY = 'INR';

export function getCurrencyInfo(
  currencyCode: string
): CurrencyInfo | undefined {
  return CURRENCIES[currencyCode.toUpperCase()];
}

export function getPrimaryCurrencyInfo(): CurrencyInfo {
  return CURRENCIES[PRIMARY_CURRENCY]!;
}

export function formatPrice(
  amount: number,
  currencyCode: string = PRIMARY_CURRENCY,
  showIcon: boolean = true
): string {
  const currency = getCurrencyInfo(currencyCode);
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }

  const formattedAmount = amount.toFixed(currency.decimalPlaces);

  if (!showIcon) {
    return `${formattedAmount} ${currency.code}`;
  }

  if (currency.position === 'before') {
    return `${currency.icon}${formattedAmount}`;
  } else {
    return `${formattedAmount}${currency.icon}`;
  }
}

export function formatRupeePrice(
  amount: number,
  showIcon: boolean = true
): string {
  return formatPrice(amount, 'INR', showIcon);
}

export function formatPriceForUI(
  amount: number,
  currencyCode: string = PRIMARY_CURRENCY
): {
  symbol: string;
  amount: string;
  code: string;
  full: string;
  icon: string;
} {
  const currency = getCurrencyInfo(currencyCode) || getPrimaryCurrencyInfo();
  const formattedAmount = amount.toFixed(currency.decimalPlaces);

  return {
    symbol: currency.symbol,
    amount: formattedAmount,
    code: currency.code,
    full: formatPrice(amount, currencyCode, true),
    icon: currency.icon,
  };
}

export function getCurrencyIcon(currencyCode: string): string {
  const currency = getCurrencyInfo(currencyCode);
  return currency?.icon || '₹';
}

export function isPrimaryCurrency(currencyCode: string): boolean {
  return currencyCode.toUpperCase() === PRIMARY_CURRENCY;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;

  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
}

export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCIES);
}

export function isValidCurrency(currencyCode: string): boolean {
  return currencyCode.toUpperCase() in CURRENCIES;
}

export function getCurrencyName(currencyCode: string): string | undefined {
  return getCurrencyInfo(currencyCode)?.name;
}

export function formatLargeAmount(
  amount: number,
  currencyCode: string = PRIMARY_CURRENCY
): string {
  if (currencyCode.toUpperCase() === 'INR') {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)} K`;
    }
  } else {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)} B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)} M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)} K`;
    }
  }

  return amount.toFixed(2);
}
