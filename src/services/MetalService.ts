import { MetalServiceDao } from './dao/MetalServiceDao';
import { MetalServiceImp } from './imp/MetalServiceImp';
import { MetalPriceDTO, ApiResponseDTO } from '../models/MetalModels';

export class MetalService {
  private metalDao: MetalServiceDao;
  private cache: Map<string, { data: MetalPriceDTO; timestamp: number }> =
    new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  constructor(metalDao?: MetalServiceDao) {
    this.metalDao = metalDao || new MetalServiceImp();
  }

  async getMetalPrice(
    metalId: string,
    currency: string = 'INR',
    forceRefresh: boolean = false
  ): Promise<ApiResponseDTO> {
    const cacheKey = `${metalId}_${currency}`;

    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Returning cached data for ${metalId}`);
        return ApiResponseDTO.success(cached.data, 'Cache');
      }
    }

    try {
      const response = await this.metalDao.fetchMetalPriceWithFallback(
        metalId,
        currency
      );

      if (response.success && response.data) {
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }

      return response;
    } catch (error) {
      console.error(`Error fetching metal price for ${metalId}:`, error);
      return ApiResponseDTO.error(
        error instanceof Error ? error.message : 'Unknown error',
        'MetalService'
      );
    }
  }

  async getAllMetalPrices(
    currency: string = 'INR',
    forceRefresh: boolean = false
  ): Promise<Record<string, ApiResponseDTO>> {
    try {
      const results = await this.metalDao.fetchAllMetalPrices(currency);

      Object.entries(results).forEach(([metalId, response]) => {
        if (response.success && response.data) {
          const cacheKey = `${metalId}_${currency}`;
          this.cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Error fetching all metal prices:', error);
      return {};
    }
  }

  async getMetalPriceFromSource(
    metalId: string,
    currency: string = 'INR',
    source: string = 'GOLD_API'
  ): Promise<ApiResponseDTO> {
    try {
      return await this.metalDao.fetchMetalPrice(metalId, currency, source);
    } catch (error) {
      console.error(`Error fetching from ${source} for ${metalId}:`, error);
      return ApiResponseDTO.error(
        error instanceof Error ? error.message : 'Unknown error',
        source
      );
    }
  }

  async checkAPIHealth(): Promise<Record<string, boolean>> {
    try {
      return await this.metalDao.checkAPIStatus();
    } catch (error) {
      console.error('Error checking API health:', error);
      return { 'All APIs': false };
    }
  }

  getSupportedMetals(): Record<string, any> {
    return this.metalDao.getSupportedMetals();
  }

  getSupportedCurrencies(): string[] {
    return this.metalDao.getSupportedCurrencies();
  }

  getPrimaryCurrency(): string {
    return this.metalDao.getPrimaryCurrency();
  }

  generateMockData(metalId: string): MetalPriceDTO {
    return this.metalDao.generateMockData(metalId);
  }

  clearCache(metalId?: string, currency?: string): void {
    if (metalId && currency) {
      const cacheKey = `${metalId}_${currency}`;
      this.cache.delete(cacheKey);
    } else if (metalId) {
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(`${metalId}_`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;

    const now = Date.now();
    return now - cached.timestamp < this.CACHE_DURATION;
  }

  setCacheDuration(duration: number): void {
    this.CACHE_DURATION = duration;
  }

  getCacheDuration(): number {
    return this.CACHE_DURATION;
  }
}
