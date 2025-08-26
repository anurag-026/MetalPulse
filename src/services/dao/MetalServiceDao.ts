import { MetalPriceDTO, ApiResponseDTO } from '../../models/MetalModels';

export interface MetalServiceDao {
  fetchMetalPrice(
    metalId: string,
    currency: string,
    source: string
  ): Promise<ApiResponseDTO>;

  fetchMetalPriceByDate?: (
    metalId: string,
    currency: string,
    date: string,
    source?: string
  ) => Promise<ApiResponseDTO>;

  fetchMetalPriceWithFallback(
    metalId: string,
    currency: string
  ): Promise<ApiResponseDTO>;

  fetchAllMetalPrices(
    currency: string
  ): Promise<Record<string, ApiResponseDTO>>;

  checkAPIStatus(): Promise<Record<string, boolean>>;

  generateMockData(metalId: string): MetalPriceDTO;

  getSupportedMetals(): Record<string, any>;

  getSupportedCurrencies(): string[];

  getPrimaryCurrency(): string;
}
