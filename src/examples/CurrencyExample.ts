import { getMetalService, setUseApi, getUseApi } from '../services';
import {
  formatPrice,
  formatRupeePrice,
  formatPriceForUI,
  getCurrencyIcon,
  isPrimaryCurrency,
  formatLargeAmount,
  getPrimaryCurrencyInfo,
  isValidCurrency,
  getCurrencyName,
  getSupportedCurrencies,
} from '../utils/currencyUtils';

export function basicCurrencyFormatting() {
  console.log('=== Basic Currency Formatting ===');

  const amount = 1850.75;

  console.log('Rupee price (with icon):', formatRupeePrice(amount));

  console.log('Rupee price (no icon):', formatRupeePrice(amount, false));

  console.log('USD price:', formatPrice(amount, 'USD'));
  console.log('EUR price:', formatPrice(amount, 'EUR'));
  console.log('GBP price:', formatPrice(amount, 'GBP'));

  console.log('INR with code:', formatPrice(amount, 'INR', false) + ' INR');
}

export function currencyInformation() {
  console.log('=== Currency Information ===');

  const primaryCurrency = getPrimaryCurrencyInfo();
  console.log('Primary currency:', primaryCurrency);

  console.log('Is INR primary?', isPrimaryCurrency('INR'));
  console.log('Is USD primary?', isPrimaryCurrency('USD'));

  console.log('INR icon:', getCurrencyIcon('INR'));
  console.log('USD icon:', getCurrencyIcon('USD'));
  console.log('EUR icon:', getCurrencyIcon('EUR'));
  console.log('GBP icon:', getCurrencyIcon('GBP'));
}

export function priceFormattingForUI() {
  console.log('=== Price Formatting for UI ===');

  const amount = 2450.5;

  const priceInfo = formatPriceForUI(amount, 'INR');
  console.log('Price info object:', priceInfo);

  console.log('Symbol:', priceInfo.symbol);
  console.log('Amount:', priceInfo.amount);
  console.log('Code:', priceInfo.code);
  console.log('Full formatted:', priceInfo.full);
  console.log('Icon:', priceInfo.icon);

  const usdInfo = formatPriceForUI(amount, 'USD');
  console.log('USD info:', usdInfo);
}

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

export function currencyConversion() {
  console.log('=== Currency Conversion ===');

  const exchangeRates = {
    USD: 75,
    EUR: 85,
    GBP: 100,
    INR: 1,
  };

  const amount = 1000;

  const usdAmount = amount / exchangeRates.USD;
  const eurAmount = amount / exchangeRates.EUR;
  const gbpAmount = amount / exchangeRates.GBP;

  console.log(`${formatRupeePrice(amount)} equals:`);
  console.log(`  ${formatPrice(usdAmount, 'USD')}`);
  console.log(`  ${formatPrice(eurAmount, 'EUR')}`);
  console.log(`  ${formatPrice(gbpAmount, 'GBP')}`);
}

export async function metalPricesWithCurrency() {
  console.log('=== Metal Prices with Currency Formatting ===');

  setUseApi(false);
  const metalService = getMetalService();

  try {
    const goldResponse = await metalService.getMetalPrice('gold', 'INR');

    if (goldResponse.success && goldResponse.data) {
      const price = goldResponse.data.price;
      const change = goldResponse.data.change;
      const changePercent = goldResponse.data.changePercent;

      console.log('Gold Price:', formatRupeePrice(price));
      console.log('Change:', formatRupeePrice(change));
      console.log(
        'Change %:',
        `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
      );

      const priceInfo = formatPriceForUI(price, 'INR');
      console.log('UI Price Info:', priceInfo);

      console.log('Using primary currency?', isPrimaryCurrency('INR'));
    } else {
      console.error('Failed to get gold price:', goldResponse.error);
    }
  } catch (error) {
    console.error('Error getting metal price:', error);
  }
}

export function currencyUtilities() {
  console.log('=== Currency Utilities ===');

  const testCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'XYZ'];

  testCurrencies.forEach(currency => {
    const isValid = isValidCurrency(currency);
    const name = getCurrencyName(currency);
    console.log(
      `${currency}: ${isValid ? 'Valid' : 'Invalid'}${name ? ` (${name})` : ''}`
    );
  });

  const supported = getSupportedCurrencies();
  console.log('Supported currencies:', supported);

  console.log('Primary currency:', getPrimaryCurrencyInfo());
}

export function priceDisplayVariations() {
  console.log('=== Price Display Variations ===');

  const amount = 1850.75;

  console.log('1. Basic rupee:', formatRupeePrice(amount));
  console.log('2. With code:', formatPrice(amount, 'INR', false) + ' INR');
  console.log('3. Large amount:', formatLargeAmount(amount * 1000, 'INR'));
  console.log('4. UI format:', formatPriceForUI(amount, 'INR').full);

  console.log('5. USD:', formatPrice(amount, 'USD'));
  console.log('6. EUR:', formatPrice(amount, 'EUR'));
  console.log('7. GBP:', formatPrice(amount, 'GBP'));
}

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

    metalPricesWithCurrency().then(() => {
      console.log('\n✅ All currency examples completed successfully!');
    });
  } catch (error) {
    console.error('❌ Error running currency examples:', error);
  }
}


