// Mock Metal Service Implementation - For testing purposes
// Implements MetalServiceDao interface with mock data
// Following the clean architecture pattern

import { MetalServiceDao } from '../dao/MetalServiceDao';
import { MetalPriceDTO, ApiResponseDTO } from '../../models/MetalModels';
import { 
  generateMockMetalPrice, 
  getSupportedMetalIds,
  getMockMetalInfo,
  getMetalSymbols,
  getSupportedCurrencies,
  getPrimaryCurrency
} from '../../mockData';

export class MockMetalServiceImp implements MetalServiceDao {
  private mockData: Map<string, MetalPriceDTO> = new Map();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for all supported metals
   */
  private initializeMockData(): void {
    const metals = getSupportedMetalIds();
    metals.forEach(metalId => {
      this.mockData.set(metalId, this.generateMockData(metalId));
    });
  }

  /**
   * Fetch metal price from a specific API source (mock implementation)
   */
  async fetchMetalPrice(
    metalId: string,
    currency: string = 'INR',
    source: string = 'MOCK'
  ): Promise<ApiResponseDTO> {
    // Simulate API delay
    await this.simulateDelay(100 + Math.random() * 200);

    const mockData = this.mockData.get(metalId);
    if (!mockData) {
      return ApiResponseDTO.error(`Unsupported metal: ${metalId}`, source);
    }

    // Simulate occasional API failures for testing
    if (Math.random() < 0.1) {
      return ApiResponseDTO.error('Simulated API failure', source);
    }

    return ApiResponseDTO.success(mockData, source);
  }

  /**
   * Fetch metal price with fallback mechanism (mock implementation)
   */
  async fetchMetalPriceWithFallback(
    metalId: string,
    currency: string = 'INR'
  ): Promise<ApiResponseDTO> {
    // Simulate API delay
    await this.simulateDelay(150 + Math.random() * 300);

    const mockData = this.mockData.get(metalId);
    if (!mockData) {
      return ApiResponseDTO.error(`Unsupported metal: ${metalId}`, 'Mock Service');
    }

    return ApiResponseDTO.success(mockData, 'Mock Service');
  }

  /**
   * Fetch all metal prices for a given currency (mock implementation)
   */
  async fetchAllMetalPrices(
    currency: string = 'INR'
  ): Promise<Record<string, ApiResponseDTO>> {
    // Simulate API delay
    await this.simulateDelay(200 + Math.random() * 400);

    const results: Record<string, ApiResponseDTO> = {};
    const metals = getSupportedMetalIds();

    metals.forEach(metalId => {
      const mockData = this.mockData.get(metalId);
      if (mockData) {
        results[metalId] = ApiResponseDTO.success(mockData, 'Mock Service');
      } else {
        results[metalId] = ApiResponseDTO.error(`No data for ${metalId}`, 'Mock Service');
      }
    });

    return results;
  }

  /**
   * Check the status of all available API sources (mock implementation)
   */
  async checkAPIStatus(): Promise<Record<string, boolean>> {
    // Simulate API delay
    await this.simulateDelay(50 + Math.random() * 100);

    return {
      'Mock API': true,
      'Test API': Math.random() > 0.3, // 70% success rate
      'Development API': Math.random() > 0.1, // 90% success rate
    };
  }

  /**
   * Generate mock data for development/testing purposes
   */
  generateMockData(metalId: string): MetalPriceDTO {
    return generateMockMetalPrice(metalId);
  }

  /**
   * Get supported metal symbols
   */
  getSupportedMetals(): Record<string, any> {
    const symbols: Record<string, any> = {};
    getSupportedMetalIds().forEach(metalId => {
      symbols[metalId] = getMetalSymbols(metalId);
    });
    return symbols;
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return getSupportedCurrencies();
  }

  /**
   * Get primary currency
   */
  getPrimaryCurrency(): string {
    return getPrimaryCurrency();
  }

  /**
   * Update mock data for a specific metal
   * @param metalId - The metal identifier
   * @param data - The new mock data
   */
  updateMockData(metalId: string, data: MetalPriceDTO): void {
    this.mockData.set(metalId, data);
  }

  /**
   * Clear all mock data
   */
  clearMockData(): void {
    this.mockData.clear();
    this.initializeMockData();
  }

  /**
   * Get current mock data
   * @returns Map with current mock data
   */
  getCurrentMockData(): Map<string, MetalPriceDTO> {
    return new Map(this.mockData);
  }

  /**
   * Simulate API delay for realistic testing
   * @param ms - Delay in milliseconds
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
