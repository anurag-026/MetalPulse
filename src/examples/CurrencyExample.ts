// Currency Example - Shows how to use the new INR-based currency system
// Demonstrates rupee icon display and currency formatting

import { 
  getMetalService, 
  setUseApi, 
  getUseApi 
} from '../services';
import { 
  formatPrice, 
  formatRupeePrice, 
  formatPriceForUI, 
  getCurrencyIcon,
  isPrimaryCurrency,
  formatLargeAmount,
  getPrimaryCurrencyInfo
} from '../utils/currencyUtils';

/**
 * Example: Basic currency formatting
 */
export function basicCurrencyFormatting() {
  console.log('=== Basic Currency Formatting ===');
  
  const amount = 1850.75;
  
  // Format with rupee icon (default)
  console.log('Rupee price (with icon):', formatRupeePrice(amount));
  
  // Format without icon
  console.log('Rupee price (no icon):', formatRupeePrice(amount, false));
  
  // Format with different currencies
  console.log('USD price:', formatPrice(amount, 'USD'));
  console.log('EUR price:', formatPrice(amount, 'EUR'));
  console.log('GBP price:', formatPrice(amount, 'GBP'));
  
  // Format with currency code
  console.log('INR with code:', formatPrice(amount, 'INR', false) + ' INR');
}

/**
 * Example: Currency information and icons
 */
export function currencyInformation() {
  console.log('=== Currency Information ===');
  
  // Get primary currency info
  const primaryCurrency = getPrimaryCurrencyInfo();
  console.log('Primary currency:', primaryCurrency);
  
  // Check if currencies are primary
  console.log('Is INR primary?', isPrimaryCurrency('INR'));
  console.log('Is USD primary?', isPrimaryCurrency('USD'));
  
  // Get currency icons
  console.log('INR icon:', getCurrencyIcon('INR'));
  console.log('USD icon:', getCurrencyIcon('USD'));
  console.log('EUR icon:', getCurrencyIcon('EUR'));
  console.log('GBP icon:', getCurrencyIcon('GBP'));
}

/**
 * Example: Price formatting for UI
 */
export function priceFormattingForUI() {
  console.log('=== Price Formatting for UI ===');
  
  const amount = 2450.50;
  
  // Get formatted parts for flexible UI rendering
  const priceInfo = formatPriceForUI(amount, 'INR');
  console.log('Price info object:', priceInfo);
  
  // Access individual parts
  console.log('Symbol:', priceInfo.symbol);
  console.log('Amount:', priceInfo.amount);
  console.log('Code:', priceInfo.code);
  console.log('Full formatted:', priceInfo.full);
  console.log('Icon:', priceInfo.icon);
  
  // Format for different currencies
  const usdInfo = formatPriceForUI(amount, 'USD');
  console.log('USD info:', usdInfo);
}

/**
 * Example: Large amount formatting
 */
export function largeAmountFormatting() {
  console.log('=== Large Amount Formatting ===');
  
  const amounts = [1500, 25000, 150000, 2500000, 15000000];
  
  amounts.forEach(amount => {
    const inrFormatted = formatLargeAmount(amount, 'INR');
    const usdFormatted = formatLargeAmount(amount, 'USD');
    
    console.log(`${amount} INR: ${inrFormatted}`);
    console.log(`${amount} USD: ${usdFormatted}`);
    console.log('---');
  });
}

/**
 * Example: Currency conversion
 */
export function currencyConversion() {
  console.log('=== Currency Conversion ===');
  
  // Mock exchange rates (1 USD = 75 INR, 1 EUR = 85 INR, 1 GBP = 100 INR)
  const exchangeRates = {
    USD: 75,
    EUR: 85,
    GBP: 100,
    INR: 1,
  };
  
  const amount = 1000; // 1000 INR
  
  // Convert INR to other currencies
  const usdAmount = amount / exchangeRates.USD;
  const eurAmount = amount / exchangeRates.EUR;
  const gbpAmount = amount / exchangeRates.GBP;
  
  console.log(`${formatRupeePrice(amount)} equals:`);
  console.log(`  ${formatPrice(usdAmount, 'USD')}`);
  console.log(`  ${formatPrice(eurAmount, 'EUR')}`);
  console.log(`  ${formatPrice(gbpAmount, 'GBP')}`);
}

/**
 * Example: Metal prices with currency formatting
 */
export async function metalPricesWithCurrency() {
  console.log('=== Metal Prices with Currency Formatting ===');
  
  // Switch to mock service to avoid API calls
  setUseApi(false);
  const metalService = getMetalService();
  
  try {
    // Get gold price in INR
    const goldResponse = await metalService.getMetalPrice('gold', 'INR');
    
    if (goldResponse.success && goldResponse.data) {
      const price = goldResponse.data.price;
      const change = goldResponse.data.change;
      const changePercent = goldResponse.data.changePercent;
      
      console.log('Gold Price:', formatRupeePrice(price));
      console.log('Change:', formatRupeePrice(change));
      console.log('Change %:', `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`);
      
      // Format for UI display
      const priceInfo = formatPriceForUI(price, 'INR');
      console.log('UI Price Info:', priceInfo);
      
      // Check if using primary currency
      console.log('Using primary currency?', isPrimaryCurrency('INR'));
      
    } else {
      console.error('Failed to get gold price:', goldResponse.error);
    }
    
  } catch (error) {
    console.error('Error getting metal price:', error);
  }
}

/**
 * Example: Currency validation and utilities
 */
export function currencyUtilities() {
  console.log('=== Currency Utilities ===');
  
  // Validate currency codes
  const testCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'XYZ'];
  
  testCurrencies.forEach(currency => {
    const isValid = isValidCurrency(currency);
    const name = getCurrencyName(currency);
    console.log(`${currency}: ${isValid ? 'Valid' : 'Invalid'}${name ? ` (${name})` : ''}`);
  });
  
  // Get supported currencies
  const supported = getSupportedCurrencies();
  console.log('Supported currencies:', supported);
  
  // Check primary currency
  console.log('Primary currency:', getPrimaryCurrencyInfo());
}

/**
 * Example: Price display variations
 */
export function priceDisplayVariations() {
  console.log('=== Price Display Variations ===');
  
  const amount = 1850.75;
  
  // Different formatting options
  console.log('1. Basic rupee:', formatRupeePrice(amount));
  console.log('2. With code:', formatPrice(amount, 'INR', false) + ' INR');
  console.log('3. Large amount:', formatLargeAmount(amount * 1000, 'INR'));
  console.log('4. UI format:', formatPriceForUI(amount, 'INR').full);
  
  // Different currencies
  console.log('5. USD:', formatPrice(amount, 'USD'));
  console.log('6. EUR:', formatPrice(amount, 'EUR'));
  console.log('7. GBP:', formatPrice(amount, 'GBP'));
}

/**
 * Run all currency examples
 */
export function runAllCurrencyExamples() {
  console.log('🚀 Starting Currency Examples...\n');
  
  try {
    basicCurrencyFormatting();
    console.log();
    
    currencyInformation();
    console.log();
    
    priceFormattingForUI();
    console.log();
    
    largeAmountFormatting();
    console.log();
    
    currencyConversion();
    console.log();
    
    currencyUtilities();
    console.log();
    
    priceDisplayVariations();
    console.log();
    
    // Run async example last
    metalPricesWithCurrency().then(() => {
      console.log('\n✅ All currency examples completed successfully!');
    });
    
  } catch (error) {
    console.error('❌ Error running currency examples:', error);
  }
}

// Import the missing function
import { isValidCurrency } from '../utils/currencyUtils';

// Export individual examples for selective testing
export {
  basicCurrencyFormatting,
  currencyInformation,
  priceFormattingForUI,
  largeAmountFormatting,
  currencyConversion,
  metalPricesWithCurrency,
  currencyUtilities,
  priceDisplayVariations
};
