import { MetalPriceDTO } from '../models/MetalModels';

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

export const SUPPORTED_METALS = Object.keys(MOCK_METAL_INFO);

export const METAL_SYMBOLS = {
  gold: { goldApi: 'XAU', metalsDev: 'gold' },
  silver: { goldApi: 'XAG', metalsDev: 'silver' },
  platinum: { goldApi: 'XPT', metalsDev: 'platinum' },
  palladium: { goldApi: 'XPD', metalsDev: 'palladium' },
};

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

export const METAL_UNITS = ['oz', 'g', 'kg'];

export const CHART_TIMEFRAMES = ['1D', '1W', '1M', '6M', '1Y', 'All'];

export function generateMockMetalPrice(
  metalId: string,
  currency: string = 'INR'
): MetalPriceDTO {
  const metalInfo = MOCK_METAL_INFO[metalId as keyof typeof MOCK_METAL_INFO];

  if (!metalInfo) {
    throw new Error(`Unsupported metal: ${metalId}`);
  }

  const basePrice = metalInfo.basePrice;
  const priceRange = metalInfo.priceRange;
  const volatility = metalInfo.volatility;

  const randomFactor = 0.8 + Math.random() * 0.4;
  const price = basePrice * randomFactor + (Math.random() - 0.5) * priceRange;

  const maxChange = price * volatility;
  const change = (Math.random() - 0.5) * maxChange * 2;
  const changePercent = (change / price) * 100;

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

export function generateAllMockMetalPrices(
  currency: string = 'INR'
): Record<string, MetalPriceDTO> {
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

export function getMockMetalInfo(metalId: string) {
  return MOCK_METAL_INFO[metalId as keyof typeof MOCK_METAL_INFO];
}

export function getSupportedMetalIds(): string[] {
  return SUPPORTED_METALS;
}

export function getMetalSymbols(metalId: string) {
  return METAL_SYMBOLS[metalId as keyof typeof METAL_SYMBOLS];
}

export function getCaratOptions() {
  return CARAT_OPTIONS;
}

export function getMetalUnits() {
  return METAL_UNITS;
}

export function getChartTimeframes() {
  return CHART_TIMEFRAMES;
}

export function isMockDataAvailable(metalId: string): boolean {
  return metalId in MOCK_METAL_INFO;
}

export function getAvailableMockMetalsCount(): number {
  return SUPPORTED_METALS.length;
}

export function hasAnyMockData(): boolean {
  return SUPPORTED_METALS.length > 0;
}
