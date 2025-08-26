// Service Factory - Provides easy dependency injection and service instantiation
// Following the clean architecture pattern

import { MetalService } from './MetalService';
import { MetalServiceImp } from './imp/MetalServiceImp';
import { MockMetalServiceImp } from './imp/MockMetalServiceImp';
import { shouldUseApi } from '../config/apiConfig';

export enum ServiceType {
  PRODUCTION = 'production',
  MOCK = 'mock',
  TEST = 'test',
}

export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();
  private serviceType: ServiceType = ServiceType.PRODUCTION;
  private useApi: boolean = shouldUseApi(); // Control whether to use real APIs or mock data

  private constructor() {}

  /**
   * Get singleton instance of ServiceFactory
   */
  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  /**
   * Set the service type (production, mock, or test)
   * @param type - The service type to use
   */
  setServiceType(type: ServiceType): void {
    this.serviceType = type;
    // Clear existing services when switching types
    this.services.clear();
  }

  /**
   * Get the current service type
   */
  getServiceType(): ServiceType {
    return this.serviceType;
  }

  /**
   * Set whether to use real APIs or mock data
   * @param useApi - true to use real APIs, false to use mock data
   */
  setUseApi(useApi: boolean): void {
    this.useApi = useApi;
    // Clear existing services when switching API usage
    this.services.clear();
  }

  /**
   * Get whether real APIs are being used
   */
  getUseApi(): boolean {
    return this.useApi;
  }

  /**
   * Get Metal Service instance
   * @returns MetalService - The metal service instance
   */
  getMetalService(): MetalService {
    const serviceKey = `MetalService_${this.serviceType}_${this.useApi}`;
    
    if (!this.services.has(serviceKey)) {
      let metalDao;
      
      // If useApi is false, always use mock implementation regardless of service type
      if (!this.useApi) {
        metalDao = new MockMetalServiceImp();
      } else {
        // Use service type logic when APIs are enabled
        switch (this.serviceType) {
          case ServiceType.MOCK:
          case ServiceType.TEST:
            metalDao = new MockMetalServiceImp();
            break;
          case ServiceType.PRODUCTION:
          default:
            metalDao = new MetalServiceImp();
            break;
        }
      }
      
      const service = new MetalService(metalDao);
      this.services.set(serviceKey, service);
    }
    
    return this.services.get(serviceKey);
  }

  /**
   * Create a new Metal Service instance (ignoring cache)
   * @returns MetalService - A new metal service instance
   */
  createMetalService(): MetalService {
    let metalDao;
    
    // If useApi is false, always use mock implementation regardless of service type
    if (!this.useApi) {
      metalDao = new MockMetalServiceImp();
    } else {
      // Use service type logic when APIs are enabled
      switch (this.serviceType) {
        case ServiceType.MOCK:
        case ServiceType.TEST:
          metalDao = new MockMetalServiceImp();
          break;
        case ServiceType.PRODUCTION:
          default:
          metalDao = new MetalServiceImp();
          break;
      }
    }
    
    return new MetalService(metalDao);
  }

  /**
   * Clear all cached services
   */
  clearServices(): void {
    this.services.clear();
  }

  /**
   * Get service information
   * @returns Object with service information
   */
  getServiceInfo(): { type: ServiceType; useApi: boolean; cachedServices: string[] } {
    return {
      type: this.serviceType,
      useApi: this.useApi,
      cachedServices: Array.from(this.services.keys()),
    };
  }

  /**
   * Check if a service is cached
   * @param serviceName - The name of the service to check
   * @returns boolean - Whether the service is cached
   */
  isServiceCached(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Remove a specific service from cache
   * @param serviceName - The name of the service to remove
   */
  removeService(serviceName: string): void {
    this.services.delete(serviceName);
  }
}

// Export convenience functions
export const getMetalService = (): MetalService => {
  return ServiceFactory.getInstance().getMetalService();
};

export const createMetalService = (): MetalService => {
  return ServiceFactory.getInstance().createMetalService();
};

export const setServiceType = (type: ServiceType): void => {
  ServiceFactory.getInstance().setServiceType(type);
};

export const getServiceType = (): ServiceType => {
  return ServiceFactory.getInstance().getServiceType();
};

export const setUseApi = (useApi: boolean): void => {
  ServiceFactory.getInstance().setUseApi(useApi);
};

export const getUseApi = (): boolean => {
  return ServiceFactory.getInstance().getUseApi();
};
