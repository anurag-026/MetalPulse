import { MetalServiceDao } from '../dao/MetalServiceDao';
import { MetalPriceDTO, ApiResponseDTO } from '../../models/MetalModels';
import {
  generateMockMetalPrice,
  getSupportedMetalIds,
  getMockMetalInfo,
  getMetalSymbols,
  getSupportedCurrencies,
  getPrimaryCurrency,
} from '../../mockData';

export class MockMetalServiceImp implements MetalServiceDao {
  private mockData: Map<string, MetalPriceDTO> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const metals = getSupportedMetalIds();
    metals.forEach(metalId => {
      this.mockData.set(metalId, this.generateMockData(metalId));
    });
  }

  async fetchMetalPrice(
    metalId: string,
    currency: string = 'INR',
    source: string = 'MOCK'
  ): Promise<ApiResponseDTO> {
    await this.simulateDelay(100 + Math.random() * 200);

    const mockData = this.mockData.get(metalId);
    if (!mockData) {
      return ApiResponseDTO.error(`Unsupported metal: ${metalId}`, source);
    }

    if (Math.random() < 0.1) {
      return ApiResponseDTO.error('Simulated API failure', source);
    }

    return ApiResponseDTO.success(mockData, source);
  }

  async fetchMetalPriceWithFallback(
    metalId: string,
    currency: string = 'INR'
  ): Promise<ApiResponseDTO> {
    await this.simulateDelay(150 + Math.random() * 300);

    const mockData = this.mockData.get(metalId);
    if (!mockData) {
      return ApiResponseDTO.error(
        `Unsupported metal: ${metalId}`,
        'Mock Service'
      );
    }

    return ApiResponseDTO.success(mockData, 'Mock Service');
  }

  async fetchAllMetalPrices(
    currency: string = 'INR'
  ): Promise<Record<string, ApiResponseDTO>> {
    await this.simulateDelay(200 + Math.random() * 400);

    const results: Record<string, ApiResponseDTO> = {};
    const metals = getSupportedMetalIds();

    metals.forEach(metalId => {
      const mockData = this.mockData.get(metalId);
      if (mockData) {
        results[metalId] = ApiResponseDTO.success(mockData, 'Mock Service');
      } else {
        results[metalId] = ApiResponseDTO.error(
          `No data for ${metalId}`,
          'Mock Service'
        );
      }
    });

    return results;
  }

  async checkAPIStatus(): Promise<Record<string, boolean>> {
    await this.simulateDelay(50 + Math.random() * 100);

    return {
      'Mock API': true,
      'Test API': Math.random() > 0.3,
      'Development API': Math.random() > 0.1,
    };
  }

  generateMockData(metalId: string): MetalPriceDTO {
    return generateMockMetalPrice(metalId);
  }

  getSupportedMetals(): Record<string, any> {
    const symbols: Record<string, any> = {};
    getSupportedMetalIds().forEach(metalId => {
      symbols[metalId] = getMetalSymbols(metalId);
    });
    return symbols;
  }

  getSupportedCurrencies(): string[] {
    return getSupportedCurrencies();
  }

  getPrimaryCurrency(): string {
    return getPrimaryCurrency();
  }

  updateMockData(metalId: string, data: MetalPriceDTO): void {
    this.mockData.set(metalId, data);
  }

  clearMockData(): void {
    this.mockData.clear();
    this.initializeMockData();
  }

  getCurrentMockData(): Map<string, MetalPriceDTO> {
    return new Map(this.mockData);
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
