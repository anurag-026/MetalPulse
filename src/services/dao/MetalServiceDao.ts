// Metal Service DAO - Data Access Object Interface
// Defines contracts for metal service operations
// Following the clean architecture pattern

import { MetalPriceDTO, ApiResponseDTO } from '../../models/MetalModels';

export interface MetalServiceDao {
  /**
   * Fetch metal price from a specific API source
   * @param metalId - The metal identifier (gold, silver, platinum, palladium)
   * @param currency - The currency code (USD, EUR, GBP, INR)
   * @param source - The API source to use
   * @returns Promise<ApiResponseDTO> - The API response with metal data or error
   */
  fetchMetalPrice(
    metalId: string,
    currency: string,
    source: string
  ): Promise<ApiResponseDTO>;

  /**
   * Fetch metal price for a specific historical date (GoldAPI format)
   * @param metalId - The metal identifier
   * @param currency - ISO 4217 currency code
   * @param date - Historical date in YYYYMMDD
   * @param source - Optional API source
   */
  fetchMetalPriceByDate?: (
    metalId: string,
    currency: string,
    date: string,
    source?: string
  ) => Promise<ApiResponseDTO>;

  /**
   * Fetch metal price with fallback mechanism
   * @param metalId - The metal identifier
   * @param currency - The currency code
   * @returns Promise<ApiResponseDTO> - The API response with metal data or error
   */
  fetchMetalPriceWithFallback(
    metalId: string,
    currency: string
  ): Promise<ApiResponseDTO>;

  /**
   * Fetch all metal prices for a given currency
   * @param currency - The currency code
   * @returns Promise<Record<string, ApiResponseDTO>> - Object with metal prices
   */
  fetchAllMetalPrices(
    currency: string
  ): Promise<Record<string, ApiResponseDTO>>;

  /**
   * Check the status of all available API sources
   * @returns Promise<Record<string, boolean>> - Object with API source status
   */
  checkAPIStatus(): Promise<Record<string, boolean>>;

  /**
   * Generate mock data for development/testing purposes
   * @param metalId - The metal identifier
   * @returns MetalPriceDTO - Mock metal price data
   */
  generateMockData(metalId: string): MetalPriceDTO;

  /**
   * Get supported metal symbols
   * @returns Record<string, any> - Object with supported metal symbols
   */
  getSupportedMetals(): Record<string, any>;

  /**
   * Get supported currencies
   * @returns string[] - Array of supported currency codes
   */
  getSupportedCurrencies(): string[];

  /**
   * Get primary currency
   * @returns string - Primary currency code
   */
  getPrimaryCurrency(): string;
}
