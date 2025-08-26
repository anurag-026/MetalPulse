// Metal API Service - Legacy compatibility layer
// This file maintains backward compatibility while using the new service architecture
// Following the clean architecture pattern

import { 
  MetalService, 
  getMetalService, 
  setServiceType, 
  ServiceType,
  getServiceType,
  setUseApi,
  getUseApi
} from './index';

// Legacy interfaces for backward compatibility
export interface MetalPriceData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  timestamp: Date;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
  open?: number;
  prevClose?: number;
  volume?: string;
  marketCap?: string;
  volatility?: string;
  yearlyReturn?: string;
  allTimeHigh?: number;
  allTimeLow?: number;
}

export interface ApiResponse {
  success: boolean;
  data?: MetalPriceData;
  error?: string;
  source: string;
}

// Legacy functions that now use the new service layer
let metalService: MetalService | undefined;

/**
 * Initialize the metal service (called automatically on first use)
 */
function initializeService(): MetalService {
  if (!metalService) {
    metalService = getMetalService();
  }
  return metalService!;
}

/**
 * Fetch metal price with fallback mechanism (legacy function)
 * @deprecated Use getMetalService().getMetalPrice() instead
 */
export async function fetchMetalPrice(
  metalId: string,
  currency: string = 'INR'
): Promise<ApiResponse> {
  const service = initializeService();
  const response = await service.getMetalPrice(metalId, currency);
  
  // Convert to legacy format for backward compatibility
  return {
    success: response.success,
    data: response.data ? {
      id: response.data.id,
      name: response.data.name,
      symbol: response.data.symbol,
      price: response.data.price,
      change: response.data.change,
      changePercent: response.data.changePercent,
      unit: response.data.unit,
      timestamp: response.data.timestamp,
      bid: response.data.bid,
      ask: response.data.ask,
      high: response.data.high,
      low: response.data.low,
      open: response.data.open,
      prevClose: response.data.prevClose,
    } : undefined,
    error: response.error,
    source: response.source,
  };
}

/**
 * Fetch all metal prices (legacy function)
 * @deprecated Use getMetalService().getAllMetalPrices() instead
 */
export async function fetchAllMetalPrices(
  currency: string = 'INR'
): Promise<{ [key: string]: ApiResponse }> {
  const service = initializeService();
  const results = await service.getAllMetalPrices(currency);
  
  // Convert to legacy format for backward compatibility
  const legacyResults: { [key: string]: ApiResponse } = {};
  
  Object.entries(results).forEach(([metalId, response]) => {
    legacyResults[metalId] = {
      success: response.success,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        symbol: response.data.symbol,
        price: response.data.price,
        change: response.data.change,
        changePercent: response.data.changePercent,
        unit: response.data.unit,
        timestamp: response.data.timestamp,
        bid: response.data.bid,
        ask: response.data.ask,
        high: response.data.high,
        low: response.data.low,
        open: response.data.open,
        prevClose: response.data.prevClose,
      } : undefined,
      error: response.error,
      source: response.source,
    };
  });
  
  return legacyResults;
}

/**
 * Check API status (legacy function)
 * @deprecated Use getMetalService().checkAPIHealth() instead
 */
export async function checkAPIStatus(): Promise<{ [key: string]: boolean }> {
  const service = initializeService();
  return await service.checkAPIHealth();
}

/**
 * Generate mock data for development/testing (legacy function)
 * @deprecated Use getMetalService().generateMockData() instead
 */
export function generateMockMetalData(metalId: string): MetalPriceData {
  // Import from centralized mock data
  const { generateMockMetalPrice } = require('../mockData/metalData');
  const mockData = generateMockMetalPrice(metalId);
  
  // Convert to legacy format for backward compatibility
  return {
    id: mockData.id,
    name: mockData.name,
    symbol: mockData.symbol,
    price: mockData.price,
    change: mockData.change,
    changePercent: mockData.changePercent,
    unit: mockData.unit,
    timestamp: mockData.timestamp,
    bid: mockData.bid,
    ask: mockData.ask,
    high: mockData.high,
    low: mockData.low,
    open: mockData.open,
    prevClose: mockData.prevClose,
  };
}

/**
 * Set service type for testing/development
 * @param type - The service type to use
 */
export function setServiceMode(type: 'production' | 'mock' | 'test'): void {
  const serviceType = type === 'production' ? ServiceType.PRODUCTION : 
                     type === 'mock' ? ServiceType.MOCK : 
                     ServiceType.TEST;
  setServiceType(serviceType);
  metalService = undefined; // Reset service to force reinitialization
}

/**
 * Get current service mode
 */
export function getServiceMode(): 'production' | 'mock' | 'test' {
  const serviceType = getServiceType();
  return serviceType === ServiceType.PRODUCTION ? 'production' :
         serviceType === ServiceType.MOCK ? 'mock' : 'test';
}

/**
 * Set whether to use real APIs or mock data
 * @param useApi - true to use real APIs, false to use mock data
 */
export function setApiUsage(useApi: boolean): void {
  setUseApi(useApi);
}

/**
 * Get whether real APIs are being used
 */
export function getApiUsage(): boolean {
  return getUseApi();
}

// Export the new service for advanced usage
export { MetalService, getMetalService } from './index';
