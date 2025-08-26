// Currency Utilities - Handle currency formatting and icons
// Primary focus on INR (Indian Rupee) support

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  icon: string;
  position: 'before' | 'after';
  decimalPlaces: number;
}

// Currency configuration with INR as primary
export const CURRENCIES: Record<string, CurrencyInfo> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    icon: '₹', // Rupee symbol
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

// Primary currency
export const PRIMARY_CURRENCY = 'INR';

/**
 * Get currency information
 * @param currencyCode - The currency code (e.g., 'INR', 'USD')
 * @returns CurrencyInfo or undefined if not found
 */
export function getCurrencyInfo(currencyCode: string): CurrencyInfo | undefined {
  return CURRENCIES[currencyCode.toUpperCase()];
}

/**
 * Get primary currency information
 * @returns CurrencyInfo for primary currency (INR)
 */
export function getPrimaryCurrencyInfo(): CurrencyInfo {
  return CURRENCIES[PRIMARY_CURRENCY]!;
}

/**
 * Format price with currency symbol and icon
 * @param amount - The amount to format
 * @param currencyCode - The currency code (defaults to INR)
 * @param showIcon - Whether to show the currency icon (defaults to true)
 * @returns Formatted price string
 */
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

/**
 * Format price with rupee icon (INR specific)
 * @param amount - The amount in rupees
 * @param showIcon - Whether to show the rupee icon (defaults to true)
 * @returns Formatted price string with rupee symbol
 */
export function formatRupeePrice(amount: number, showIcon: boolean = true): string {
  return formatPrice(amount, 'INR', showIcon);
}

/**
 * Format price for display in UI components
 * @param amount - The amount to format
 * @param currencyCode - The currency code (defaults to INR)
 * @returns Object with formatted parts for flexible UI rendering
 */
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

/**
 * Get currency icon for display
 * @param currencyCode - The currency code
 * @returns Currency icon string
 */
export function getCurrencyIcon(currencyCode: string): string {
  const currency = getCurrencyInfo(currencyCode);
  return currency?.icon || '₹'; // Default to rupee if not found
}

/**
 * Check if a currency is the primary currency (INR)
 * @param currencyCode - The currency code to check
 * @returns boolean - True if it's the primary currency
 */
export function isPrimaryCurrency(currencyCode: string): boolean {
  return currencyCode.toUpperCase() === PRIMARY_CURRENCY;
}

/**
 * Convert amount between currencies (basic conversion)
 * @param amount - The amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param exchangeRates - Exchange rates object
 * @returns Converted amount
 */
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
  
  // Convert to base currency (USD) then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
}

/**
 * Get all supported currencies
 * @returns Array of currency codes
 */
export function getSupportedCurrencies(): string[] {
  return Object.keys(CURRENCIES);
}

/**
 * Validate currency code
 * @param currencyCode - The currency code to validate
 * @returns boolean - True if valid
 */
export function isValidCurrency(currencyCode: string): boolean {
  return currencyCode.toUpperCase() in CURRENCIES;
}

/**
 * Get currency name
 * @param currencyCode - The currency code
 * @returns Currency name or undefined if not found
 */
export function getCurrencyName(currencyCode: string): string | undefined {
  return getCurrencyInfo(currencyCode)?.name;
}

/**
 * Format large amounts with appropriate suffixes (K, L, Cr for INR)
 * @param amount - The amount to format
 * @param currencyCode - The currency code (defaults to INR)
 * @returns Formatted amount with suffix
 */
export function formatLargeAmount(
  amount: number,
  currencyCode: string = PRIMARY_CURRENCY
): string {
  if (currencyCode.toUpperCase() === 'INR') {
    // Indian numbering system
    if (amount >= 10000000) { // 1 Crore
      return `${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) { // 1 Thousand
      return `${(amount / 1000).toFixed(2)} K`;
    }
  } else {
    // International numbering system
    if (amount >= 1000000000) { // 1 Billion
      return `${(amount / 1000000000).toFixed(2)} B`;
    } else if (amount >= 1000000) { // 1 Million
      return `${(amount / 1000000).toFixed(2)} M`;
    } else if (amount >= 1000) { // 1 Thousand
      return `${(amount / 1000).toFixed(2)} K`;
    }
  }
  
  return amount.toFixed(2);
}
