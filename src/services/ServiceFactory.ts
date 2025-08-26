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
  private useApi: boolean = shouldUseApi();

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  setServiceType(type: ServiceType): void {
    this.serviceType = type;

    this.services.clear();
  }

  getServiceType(): ServiceType {
    return this.serviceType;
  }

  setUseApi(useApi: boolean): void {
    this.useApi = useApi;

    this.services.clear();
  }

  getUseApi(): boolean {
    return this.useApi;
  }

  getMetalService(): MetalService {
    const serviceKey = `MetalService_${this.serviceType}_${this.useApi}`;

    if (!this.services.has(serviceKey)) {
      let metalDao;

      if (!this.useApi) {
        metalDao = new MockMetalServiceImp();
      } else {
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

  createMetalService(): MetalService {
    let metalDao;

    if (!this.useApi) {
      metalDao = new MockMetalServiceImp();
    } else {
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

  clearServices(): void {
    this.services.clear();
  }

  getServiceInfo(): {
    type: ServiceType;
    useApi: boolean;
    cachedServices: string[];
  } {
    return {
      type: this.serviceType,
      useApi: this.useApi,
      cachedServices: Array.from(this.services.keys()),
    };
  }

  isServiceCached(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  removeService(serviceName: string): void {
    this.services.delete(serviceName);
  }
}

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
