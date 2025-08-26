// Mock Metal Data - Centralized location for all metal mock data
// This file contains all mock data related to metals, prices, and market information

import { MetalPriceDTO } from '../models/MetalModels';

// Base metal information
export const MOCK_METAL_INFO = {
  gold: {
    id: 'gold',
    name: 'Gold',
    symbol: 'Au',
    color: '#FFD700',
    gradientColors: ['#FFD700', '#FFA500'],
    icon: 'medal',
    basePrice: 1950,
    priceRange: 100,
    volatility: 0.15,
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    symbol: 'Ag',
    color: '#C0C0C0',
    gradientColors: ['#C0C0C0', '#A0A0A0'],
    icon: 'silverware',
    basePrice: 25,
    priceRange: 5,
    volatility: 0.12,
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    symbol: 'Pt',
    color: '#E5E4E2',
    gradientColors: ['#E5E4E2', '#C0C0C0'],
    icon: 'diamond',
    basePrice: 950,
    priceRange: 50,
    volatility: 0.18,
  },
  palladium: {
    id: 'palladium',
    name: 'Palladium',
    symbol: 'Pd',
    color: '#CED0DD',
    gradientColors: ['#CED0DD', '#A0A0A0'],
    icon: 'circle',
    basePrice: 1800,
    priceRange: 200,
    volatility: 0.25,
  },
};

// Supported metals list
export const SUPPORTED_METALS = Object.keys(MOCK_METAL_INFO);

// Metal symbols mapping for different APIs
export const METAL_SYMBOLS = {
  gold: { goldApi: 'XAU', metalsDev: 'gold' },
  silver: { goldApi: 'XAG', metalsDev: 'silver' },
  platinum: { goldApi: 'XPT', metalsDev: 'platinum' },
  palladium: { goldApi: 'XPD', metalsDev: 'palladium' },
};

// Carat options for pricing
export const CARAT_OPTIONS = [
  { value: 24, purity: 1.0, name: '24K' },
  { value: 22, purity: 0.916, name: '22K' },
  { value: 21, purity: 0.875, name: '21K' },
  { value: 20, purity: 0.833, name: '20K' },
  { value: 18, purity: 0.75, name: '18K' },
  { value: 16, purity: 0.667, name: '16K' },
  { value: 14, purity: 0.585, name: '14K' },
  { value: 10, purity: 0.417, name: '10K' },
];

// Units for metal pricing
export const METAL_UNITS = ['oz', 'g', 'kg'];

// Timeframes for charts
export const CHART_TIMEFRAMES = ['1D', '1W', '1M', '6M', '1Y', 'All'];

/**
 * Generate realistic mock metal price data
 * @param metalId - The metal identifier
 * @param currency - The currency code (default: INR)
 * @returns MetalPriceDTO with realistic mock data
 */
export function generateMockMetalPrice(metalId: string, currency: string = 'INR'): MetalPriceDTO {
  const metalInfo = MOCK_METAL_INFO[metalId as keyof typeof MOCK_METAL_INFO];
  
  if (!metalInfo) {
    throw new Error(`Unsupported metal: ${metalId}`);
  }

  // Generate realistic price with some randomness
  const basePrice = metalInfo.basePrice;
  const priceRange = metalInfo.priceRange;
  const volatility = metalInfo.volatility;
  
  // Add some realistic price variation
  const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
  const price = (basePrice * randomFactor) + (Math.random() - 0.5) * priceRange;
  
  // Generate realistic price change
  const maxChange = price * volatility;
  const change = (Math.random() - 0.5) * maxChange * 2; // -maxChange to +maxChange
  const changePercent = (change / price) * 100;
  
  // Generate additional market data
  const bid = price - (Math.random() * 2 + 0.5);
  const ask = price + (Math.random() * 2 + 0.5);
  const high = price + Math.abs(change) * 1.2;
  const low = price - Math.abs(change) * 0.8;
  const open = price - change * 0.8;
  const prevClose = price - change;
  
  return new MetalPriceDTO(
    metalId,
    metalInfo.name,
    metalInfo.symbol,
    Math.round(price * 100) / 100,
    Math.round(change * 100) / 100,
    Math.round(changePercent * 100) / 100,
    'per oz',
    new Date(),
    Math.round(bid * 100) / 100,
    Math.round(ask * 100) / 100,
    Math.round(high * 100) / 100,
    Math.round(low * 100) / 100,
    Math.round(open * 100) / 100,
    Math.round(prevClose * 100) / 100
  );
}

/**
 * Generate mock data for all supported metals
 * @param currency - The currency code (default: INR)
 * @returns Record of metal ID to mock data
 */
export function generateAllMockMetalPrices(currency: string = 'INR'): Record<string, MetalPriceDTO> {
  const results: Record<string, MetalPriceDTO> = {};
  
  SUPPORTED_METALS.forEach(metalId => {
    try {
      results[metalId] = generateMockMetalPrice(metalId, currency);
    } catch (error) {
      console.warn(`Failed to generate mock data for ${metalId}:`, error);
    }
  });
  
  return results;
}

/**
 * Get mock metal information
 * @param metalId - The metal identifier
 * @returns Metal information object
 */
export function getMockMetalInfo(metalId: string) {
  return MOCK_METAL_INFO[metalId as keyof typeof MOCK_METAL_INFO];
}

/**
 * Get all supported metal IDs
 * @returns Array of supported metal IDs
 */
export function getSupportedMetalIds(): string[] {
  return SUPPORTED_METALS;
}

/**
 * Get metal symbols for API calls
 * @param metalId - The metal identifier
 * @returns Object with API-specific symbols
 */
export function getMetalSymbols(metalId: string) {
  return METAL_SYMBOLS[metalId as keyof typeof METAL_SYMBOLS];
}

/**
 * Get carat options
 * @returns Array of carat options
 */
export function getCaratOptions() {
  return CARAT_OPTIONS;
}

/**
 * Get metal units
 * @returns Array of metal units
 */
export function getMetalUnits() {
  return METAL_UNITS;
}

/**
 * Get chart timeframes
 * @returns Array of chart timeframes
 */
export function getChartTimeframes() {
  return CHART_TIMEFRAMES;
}

/**
 * Check if mock data is available for a specific metal
 * @param metalId - The metal identifier
 * @returns boolean indicating if mock data is available
 */
export function isMockDataAvailable(metalId: string): boolean {
  return metalId in MOCK_METAL_INFO;
}

/**
 * Get available mock metals count
 * @returns number of available mock metals
 */
export function getAvailableMockMetalsCount(): number {
  return SUPPORTED_METALS.length;
}

/**
 * Check if any mock data is available
 * @returns boolean indicating if any mock data is available
 */
export function hasAnyMockData(): boolean {
  return SUPPORTED_METALS.length > 0;
}
