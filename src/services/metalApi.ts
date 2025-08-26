import {
  MetalService,
  getMetalService,
  setServiceType,
  ServiceType,
  getServiceType,
  setUseApi,
  getUseApi,
} from './index';

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

let metalService: MetalService | undefined;

function initializeService(): MetalService {
  if (!metalService) {
    metalService = getMetalService();
  }
  return metalService!;
}

export async function fetchMetalPrice(
  metalId: string,
  currency: string = 'INR'
): Promise<ApiResponse> {
  const service = initializeService();
  const response = await service.getMetalPrice(metalId, currency);

  return {
    success: response.success,
    data: response.data
      ? {
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
        }
      : undefined,
    error: response.error,
    source: response.source,
  };
}

export async function fetchAllMetalPrices(
  currency: string = 'INR'
): Promise<{ [key: string]: ApiResponse }> {
  const service = initializeService();
  const results = await service.getAllMetalPrices(currency);

  const legacyResults: { [key: string]: ApiResponse } = {};

  Object.entries(results).forEach(([metalId, response]) => {
    legacyResults[metalId] = {
      success: response.success,
      data: response.data
        ? {
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
          }
        : undefined,
      error: response.error,
      source: response.source,
    };
  });

  return legacyResults;
}

export async function checkAPIStatus(): Promise<{ [key: string]: boolean }> {
  const service = initializeService();
  return await service.checkAPIHealth();
}

export function generateMockMetalData(metalId: string): MetalPriceData {
  const { generateMockMetalPrice } = require('../mockData/metalData');
  const mockData = generateMockMetalPrice(metalId);

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

export function setServiceMode(type: 'production' | 'mock' | 'test'): void {
  const serviceType =
    type === 'production'
      ? ServiceType.PRODUCTION
      : type === 'mock'
        ? ServiceType.MOCK
        : ServiceType.TEST;
  setServiceType(serviceType);
  metalService = undefined;
}

export function getServiceMode(): 'production' | 'mock' | 'test' {
  const serviceType = getServiceType();
  return serviceType === ServiceType.PRODUCTION
    ? 'production'
    : serviceType === ServiceType.MOCK
      ? 'mock'
      : 'test';
}

export function setApiUsage(useApi: boolean): void {
  setUseApi(useApi);
}

export function getApiUsage(): boolean {
  return getUseApi();
}

export { MetalService, getMetalService } from './index';
