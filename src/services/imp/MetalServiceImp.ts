import { MetalServiceDao } from '../dao/MetalServiceDao';
import {
  MetalPriceDTO,
  ApiResponseDTO,
  MetalSymbols,
  ApiConfig,
} from '../../models/MetalModels';

export class MetalServiceImp implements MetalServiceDao {
  private readonly API_CONFIG: Record<string, ApiConfig> = {
    GOLD_API: {
      baseUrl: 'https://www.goldapi.io/api',
      headers: {
        'x-access-token': 'goldapi-134fm3smer6nsf1-io',
        'Content-Type': 'application/json',
      },
    },
    METALS_DEV: {
      baseUrl: 'https://api.metals.dev/v1',
      apiKey: 'MJ2RNVNGJ0WJ2ENRXB7W529NRXB7W',
    },
  };

  private readonly METAL_SYMBOLS: Record<string, MetalSymbols> = {
    gold: { goldApi: 'XAU', metalsDev: 'gold' },
    silver: { goldApi: 'XAG', metalsDev: 'silver' },
    platinum: { goldApi: 'XPT', metalsDev: 'platinum' },
    palladium: { goldApi: 'XPD', metalsDev: 'palladium' },
  };

  private readonly CURRENCY_SYMBOLS = {
    INR: 'INR',
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
  };

  async fetchMetalPrice(
    metalId: string,
    currency: string = 'INR',
    source: string = 'GOLD_API'
  ): Promise<ApiResponseDTO> {
    try {
      switch (source.toUpperCase()) {
        case 'GOLD_API':
          return await this.fetchFromGoldAPI(metalId, currency);
        case 'METALS_DEV':
          return await this.fetchFromMetalsDev(metalId, currency);
        default:
          return ApiResponseDTO.error(
            `Unsupported API source: ${source}`,
            source
          );
      }
    } catch (error) {
      console.error(`${source} error for ${metalId}:`, error);
      return ApiResponseDTO.error(
        error instanceof Error ? error.message : 'Unknown error',
        source
      );
    }
  }

  async fetchMetalPriceWithFallback(
    metalId: string,
    currency: string = 'INR'
  ): Promise<ApiResponseDTO> {
    let response = await this.fetchFromGoldAPI(metalId, currency);

    if (!response.success) {
      console.log(`GoldAPI failed for ${metalId}, trying Metals.dev...`);
      response = await this.fetchFromMetalsDev(metalId, currency);
    }

    if (!response.success) {
      return ApiResponseDTO.error(
        `All API sources failed for ${metalId}`,
        'All sources'
      );
    }

    return response;
  }

  async fetchAllMetalPrices(
    currency: string = 'INR'
  ): Promise<Record<string, ApiResponseDTO>> {
    const metals = Object.keys(this.METAL_SYMBOLS);
    const results: Record<string, ApiResponseDTO> = {};

    const promises = metals.map(async metalId => {
      const result = await this.fetchMetalPriceWithFallback(metalId, currency);
      results[metalId] = result;
    });

    await Promise.all(promises);
    return results;
  }

  async checkAPIStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};

    try {
      const response = await fetch(
        `${this.API_CONFIG.GOLD_API.baseUrl}/status`
      );
      status.GoldAPI = response.ok;
    } catch {
      status.GoldAPI = false;
    }

    try {
      const response = await fetch(
        `${this.API_CONFIG.METALS_DEV.baseUrl}/latest?api_key=${this.API_CONFIG.METALS_DEV.apiKey}&currency=USD&unit=toz`
      );
      status['Metals.dev'] = response.ok;
    } catch {
      status['Metals.dev'] = false;
    }

    return status;
  }

  generateMockData(metalId: string): MetalPriceDTO {
    const basePrices: Record<string, number> = {
      gold: 1950 + Math.random() * 100,
      silver: 25 + Math.random() * 5,
      platinum: 950 + Math.random() * 50,
      palladium: 1800 + Math.random() * 200,
    };

    const price = basePrices[metalId] || 1000;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / price) * 100;

    return new MetalPriceDTO(
      metalId,
      this.getMetalName(metalId),
      this.getMetalSymbol(metalId),
      Math.round(price * 100) / 100,
      Math.round(change * 100) / 100,
      Math.round(changePercent * 100) / 100,
      'per oz',
      new Date(),
      price - 0.5,
      price + 0.5,
      price + change * 1.2,
      price - change * 0.8,
      price - change * 0.8,
      price - change
    );
  }

  getSupportedMetals(): Record<string, any> {
    return this.METAL_SYMBOLS;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(this.CURRENCY_SYMBOLS);
  }

  getPrimaryCurrency(): string {
    return 'INR';
  }

  private async fetchFromGoldAPI(
    metalId: string,
    currency: string = 'USD'
  ): Promise<ApiResponseDTO> {
    const symbol = this.METAL_SYMBOLS[metalId]?.goldApi;
    if (!symbol) {
      return ApiResponseDTO.error(`Unsupported metal: ${metalId}`, 'GoldAPI');
    }

    const url = `${this.API_CONFIG.GOLD_API.baseUrl}/${symbol}/${currency}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.API_CONFIG.GOLD_API.headers,
    });

    if (response.status === 429) {
      return ApiResponseDTO.error(
        '429 Too Many Requests - Throttled by GoldAPI',
        'GoldAPI'
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      return ApiResponseDTO.error(data.error, 'GoldAPI');
    }

    if (data.price === undefined || data.price === null) {
      return ApiResponseDTO.error('Price data not available', 'GoldAPI');
    }

    const prevClose = data.prev_close_price || data.price;
    const change = data.price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

    const metalData = new MetalPriceDTO(
      metalId,
      this.getMetalName(metalId),
      this.getMetalSymbol(metalId),
      data.price,
      data.ch || change,
      data.chp || changePercent,
      'per oz',
      new Date(data.timestamp * 1000),
      data.bid,
      data.ask,
      data.high_price,
      data.low_price,
      data.open_price,
      data.prev_close_price
    );

    return ApiResponseDTO.success(metalData, 'GoldAPI');
  }

  private async fetchFromMetalsDev(
    metalId: string,
    currency: string = 'USD'
  ): Promise<ApiResponseDTO> {
    const symbol = this.METAL_SYMBOLS[metalId]?.metalsDev;
    if (!symbol) {
      return ApiResponseDTO.error(
        `Unsupported metal: ${metalId}`,
        'Metals.dev'
      );
    }

    const url = `${this.API_CONFIG.METALS_DEV.baseUrl}/latest?api_key=${this.API_CONFIG.METALS_DEV.apiKey}&currency=${currency}&unit=toz`;
    const response = await fetch(url);

    if (response.status === 429) {
      return ApiResponseDTO.error(
        '429 Too Many Requests - Throttled by Metals.dev',
        'Metals.dev'
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      return ApiResponseDTO.error('API request failed', 'Metals.dev');
    }

    if (!data.metals || !data.metals[symbol]) {
      return ApiResponseDTO.error('Price data not available', 'Metals.dev');
    }

    const price = data.metals[symbol];
    if (!price || price === null) {
      return ApiResponseDTO.error('Price data not available', 'Metals.dev');
    }

    const mockChange = (Math.random() - 0.5) * 20;
    const mockChangePercent = (mockChange / price) * 100;

    const metalData = new MetalPriceDTO(
      metalId,
      this.getMetalName(metalId),
      this.getMetalSymbol(metalId),
      price,
      mockChange,
      mockChangePercent,
      'per oz',
      new Date()
    );

    return ApiResponseDTO.success(metalData, 'Metals.dev');
  }

  private getMetalName(metalId: string): string {
    const names: Record<string, string> = {
      gold: 'Gold',
      silver: 'Silver',
      platinum: 'Platinum',
      palladium: 'Palladium',
    };
    return names[metalId] || metalId;
  }

  private getMetalSymbol(metalId: string): string {
    const symbols: Record<string, string> = {
      gold: 'Au',
      silver: 'Ag',
      platinum: 'Pt',
      palladium: 'Pd',
    };
    return symbols[metalId] || metalId;
  }
}
