// Price Display Component - Shows prices with currency icons
// Primary focus on INR (Indian Rupee) display

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatPrice, formatPriceForUI, getCurrencyIcon, isPrimaryCurrency } from '../utils/currencyUtils';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: any;
  showCurrencyCode?: boolean;
  formatLarge?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'INR',
  showIcon = true,
  size = 'medium',
  color,
  style,
  showCurrencyCode = false,
  formatLarge = false,
}) => {
  const currencyInfo = formatPriceForUI(amount, currency);
  const isPrimary = isPrimaryCurrency(currency);
  
  // Size-based text styles
  const getTextStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  // Format amount based on size preference
  const displayAmount = formatLarge 
    ? formatLarge ? `${(amount / 1000).toFixed(1)}K` : amount.toFixed(2)
    : amount.toFixed(2);

  return (
    <View style={[styles.container, style]}>
      {showIcon && (
        <Text style={[getTextStyle(), styles.icon, { color: color || (isPrimary ? '#FF6B35' : '#333') }]}>
          {currencyInfo.icon}
        </Text>
      )}
      <Text style={[getTextStyle(), { color: color || '#333' }]}>
        {displayAmount}
      </Text>
      {showCurrencyCode && (
        <Text style={[getTextStyle(), styles.currencyCode, { color: color || '#666' }]}>
          {` ${currencyInfo.code}`}
        </Text>
      )}
    </View>
  );
};

// Price with change indicator
interface PriceWithChangeProps extends PriceDisplayProps {
  change?: number;
  changePercent?: number;
  showChange?: boolean;
}

export const PriceWithChange: React.FC<PriceWithChangeProps> = ({
  amount,
  currency = 'INR',
  change = 0,
  changePercent = 0,
  showChange = true,
  size = 'medium',
  color,
  style,
}) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? '#4CAF50' : '#F44336';

  return (
    <View style={[styles.priceChangeContainer, style]}>
      <PriceDisplay
        amount={amount}
        currency={currency}
        size={size}
        color={color}
        showIcon={true}
      />
      
      {showChange && (change !== 0 || changePercent !== 0) && (
        <View style={styles.changeContainer}>
          <Text style={[getChangeTextStyle(size), { color: changeColor }]}>
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </Text>
          <Text style={[getChangeTextStyle(size), { color: changeColor }]}>
            {` (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`}
          </Text>
        </View>
      )}
    </View>
  );
};

// Helper function for change text styles
const getChangeTextStyle = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return styles.smallChangeText;
    case 'large':
      return styles.largeChangeText;
    default:
      return styles.mediumChangeText;
  }
};

// Compact price display for lists
export const CompactPriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'INR',
  showIcon = true,
  style,
}) => {
  return (
    <PriceDisplay
      amount={amount}
      currency={currency}
      showIcon={showIcon}
      size="small"
      style={[styles.compact, style]}
    />
  );
};

// Large price display for headers
export const LargePriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  currency = 'INR',
  showIcon = true,
  style,
}) => {
  return (
    <PriceDisplay
      amount={amount}
      currency={currency}
      showIcon={showIcon}
      size="large"
      style={[styles.large, style]}
    />
  );
};

// Currency selector component
interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  currencies?: string[];
  style?: any;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  currencies = ['INR', 'USD', 'EUR', 'GBP'],
  style,
}) => {
  return (
    <View style={[styles.currencySelector, style]}>
      {currencies.map((currency) => (
        <Text
          key={currency}
          style={[
            styles.currencyOption,
            selectedCurrency === currency && styles.selectedCurrency,
          ]}
          onPress={() => onCurrencyChange(currency)}
        >
          {getCurrencyIcon(currency)} {currency}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 2,
    fontWeight: 'bold',
  },
  currencyCode: {
    marginLeft: 4,
    opacity: 0.7,
  },
  smallText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediumText: {
    fontSize: 18,
    fontWeight: '600',
  },
  largeText: {
    fontSize: 24,
    fontWeight: '700',
  },
  priceChangeContainer: {
    alignItems: 'flex-start',
  },
  changeContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  smallChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mediumChangeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  largeChangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  compact: {
    marginVertical: 2,
  },
  large: {
    marginVertical: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  currencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCurrency: {
    backgroundColor: '#FF6B35',
    color: 'white',
  },
});

export default PriceDisplay;
