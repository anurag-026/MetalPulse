// Services Index - Export all services and related components
// Following the clean architecture pattern

// Core Services
export { MetalService } from './MetalService';

// DAO Layer
export { MetalServiceDao } from './dao/MetalServiceDao';

// Implementation Layer
export { MetalServiceImp } from './imp/MetalServiceImp';
export { MockMetalServiceImp } from './imp/MockMetalServiceImp';

// Service Factory
export { 
  ServiceFactory, 
  ServiceType,
  getMetalService,
  createMetalService,
  setServiceType,
  getServiceType,
  setUseApi,
  getUseApi
} from './ServiceFactory';

// Models
export * from '../models/MetalModels';
