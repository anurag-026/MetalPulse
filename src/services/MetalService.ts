// Metal Service - Core Service Layer
// Handles business logic, state management, and core application functionality
// Following the clean architecture pattern

import { MetalServiceDao } from './dao/MetalServiceDao';
import { MetalServiceImp } from './imp/MetalServiceImp';
import { MetalPriceDTO, ApiResponseDTO } from '../models/MetalModels';

export class MetalService {
  private metalDao: MetalServiceDao;
  private cache: Map<string, { data: MetalPriceDTO; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(metalDao?: MetalServiceDao) {
    // Dependency injection - allows for easy testing with mock implementations
    this.metalDao = metalDao || new MetalServiceImp();
  }

  /**
   * Get metal price with caching mechanism
   * @param metalId - The metal identifier
   * @param currency - The currency code
   * @param forceRefresh - Force refresh cache
   * @returns Promise<ApiResponseDTO> - The API response with metal data or error
   */
  async getMetalPrice(
    metalId: string,
    currency: string = 'INR',
    forceRefresh: boolean = false
  ): Promise<ApiResponseDTO> {
    const cacheKey = `${metalId}_${currency}`;
    
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Returning cached data for ${metalId}`);
        return ApiResponseDTO.success(cached.data, 'Cache');
      }
    }

    try {
      // Fetch fresh data from API
      const response = await this.metalDao.fetchMetalPriceWithFallback(metalId, currency);
      
      // Cache successful responses
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

  /**
   * Get all metal prices with caching
   * @param currency - The currency code
   * @param forceRefresh - Force refresh cache
   * @returns Promise<Record<string, ApiResponseDTO>> - Object with metal prices
   */
  async getAllMetalPrices(
    currency: string = 'INR',
    forceRefresh: boolean = false
  ): Promise<Record<string, ApiResponseDTO>> {
    try {
      const results = await this.metalDao.fetchAllMetalPrices(currency);
      
      // Cache successful responses
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

  /**
   * Get metal price from specific API source
   * @param metalId - The metal identifier
   * @param currency - The currency code
   * @param source - The API source to use
   * @returns Promise<ApiResponseDTO> - The API response
   */
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

  /**
   * Check API health status
   * @returns Promise<Record<string, boolean>> - API source status
   */
  async checkAPIHealth(): Promise<Record<string, boolean>> {
    try {
      return await this.metalDao.checkAPIStatus();
    } catch (error) {
      console.error('Error checking API health:', error);
      return { 'All APIs': false };
    }
  }

  /**
   * Get supported metals
   * @returns Record<string, any> - Supported metal symbols
   */
  getSupportedMetals(): Record<string, any> {
    return this.metalDao.getSupportedMetals();
  }

  /**
   * Get supported currencies
   * @returns string[] - Supported currency codes
   */
  getSupportedCurrencies(): string[] {
    return this.metalDao.getSupportedCurrencies();
  }

  /**
   * Get primary currency
   * @returns string - Primary currency code
   */
  getPrimaryCurrency(): string {
    return this.metalDao.getPrimaryCurrency();
  }

  /**
   * Generate mock data for development/testing
   * @param metalId - The metal identifier
   * @returns MetalPriceDTO - Mock metal price data
   */
  generateMockData(metalId: string): MetalPriceDTO {
    return this.metalDao.generateMockData(metalId);
  }

  /**
   * Clear cache for specific metal/currency or all cache
   * @param metalId - Optional metal identifier
   * @param currency - Optional currency code
   */
  clearCache(metalId?: string, currency?: string): void {
    if (metalId && currency) {
      // Clear specific cache entry
      const cacheKey = `${metalId}_${currency}`;
      this.cache.delete(cacheKey);
    } else if (metalId) {
      // Clear all cache entries for a specific metal
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(`${metalId}_`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns Object with cache information
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Check if cache is valid for a given key
   * @param cacheKey - The cache key to check
   * @returns boolean - Whether cache is still valid
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.CACHE_DURATION;
  }

  /**
   * Set cache duration
   * @param duration - Cache duration in milliseconds
   */
  setCacheDuration(duration: number): void {
    this.CACHE_DURATION = duration;
  }

  /**
   * Get current cache duration
   * @returns number - Current cache duration in milliseconds
   */
  getCacheDuration(): number {
    return this.CACHE_DURATION;
  }
}
