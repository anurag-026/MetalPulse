// Metal Models - Data Transfer Objects and interfaces
// Following the clean architecture pattern with immutable design

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

export interface MetalSymbols {
  goldApi: string;
  metalsDev: string;
}

export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  apiKey?: string;
}

export interface CurrencySymbols {
  USD: string;
  EUR: string;
  GBP: string;
  INR: string;
}

// DTO for API responses
export class MetalPriceDTO {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly symbol: string,
    public readonly price: number,
    public readonly change: number,
    public readonly changePercent: number,
    public readonly unit: string,
    public readonly timestamp: Date,
    public readonly bid?: number,
    public readonly ask?: number,
    public readonly high?: number,
    public readonly low?: number,
    public readonly open?: number,
    public readonly prevClose?: number
  ) {}

  // Factory method to create from JSON
  static fromJSON(json: any): MetalPriceDTO {
    return new MetalPriceDTO(
      json.id,
      json.name,
      json.symbol,
      json.price,
      json.change,
      json.changePercent,
      json.unit,
      new Date(json.timestamp),
      json.bid,
      json.ask,
      json.high,
      json.low,
      json.open,
      json.prevClose
    );
  }

  // Convert to JSON
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      symbol: this.symbol,
      price: this.price,
      change: this.change,
      changePercent: this.changePercent,
      unit: this.unit,
      timestamp: this.timestamp.toISOString(),
      bid: this.bid,
      ask: this.ask,
      high: this.high,
      low: this.low,
      open: this.open,
      prevClose: this.prevClose,
    };
  }

  // Validation method
  isValid(): boolean {
    return (
      !!this.id &&
      !!this.name &&
      !!this.symbol &&
      typeof this.price === 'number' &&
      !isNaN(this.price) &&
      this.price > 0
    );
  }
}

// DTO for API responses
export class ApiResponseDTO {
  constructor(
    public readonly success: boolean,
    public readonly data?: MetalPriceDTO,
    public readonly error?: string,
    public readonly source: string
  ) {}

  // Factory method to create success response
  static success(data: MetalPriceDTO, source: string): ApiResponseDTO {
    return new ApiResponseDTO(true, data, undefined, source);
  }

  // Factory method to create error response
  static error(error: string, source: string): ApiResponseDTO {
    return new ApiResponseDTO(false, undefined, error, source);
  }

  // Convert to JSON
  toJSON(): any {
    return {
      success: this.success,
      data: this.data?.toJSON(),
      error: this.error,
      source: this.source,
    };
  }
}
