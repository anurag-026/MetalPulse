// Metal Service Example - Demonstrates usage of the new service layer architecture
// This file shows various ways to use the metal service

import { 
  getMetalService, 
  setServiceType, 
  ServiceType,
  MetalService,
  MockMetalServiceImp
} from '../services';

/**
 * Basic usage example
 */
export async function basicUsageExample() {
  console.log('=== Basic Usage Example ===');
  
  // Get the metal service (uses production by default)
  const metalService = getMetalService();
  
  try {
    // Get gold price
    const goldResponse = await metalService.getMetalPrice('gold', 'INR');
    
    if (goldResponse.success && goldResponse.data) {
      console.log(`Gold Price: $${goldResponse.data.price} (${goldResponse.data.change >= 0 ? '+' : ''}${goldResponse.data.change}%)`);
    } else {
      console.error('Failed to get gold price:', goldResponse.error);
    }
    
    // Get all metal prices
    const allPrices = await metalService.getAllMetalPrices('INR');
    console.log('All Metal Prices:', Object.keys(allPrices).length, 'metals fetched');
    
  } catch (error) {
    console.error('Error in basic usage:', error);
  }
}

/**
 * Mock service example for development/testing
 */
export async function mockServiceExample() {
  console.log('=== Mock Service Example ===');
  
  // Switch to mock service
  setServiceType(ServiceType.MOCK);
  
  const metalService = getMetalService();
  
  try {
    // Get mock gold price
    const goldResponse = await metalService.getMetalPrice('gold', 'INR');
    
    if (goldResponse.success && goldResponse.data) {
      console.log(`Mock Gold Price: $${goldResponse.data.price} (${goldResponse.data.change >= 0 ? '+' : ''}${goldResponse.data.change}%)`);
    }
    
    // Check cache stats
    const cacheStats = metalService.getCacheStats();
    console.log('Cache Stats:', cacheStats);
    
  } catch (error) {
    console.error('Error in mock service:', error);
  }
}

/**
 * Advanced usage example with custom service
 */
export async function advancedUsageExample() {
  console.log('=== Advanced Usage Example ===');
  
  // Create custom service with mock implementation
  const mockDao = new MockMetalServiceImp();
  const customService = new MetalService(mockDao);
  
  // Configure cache duration (10 minutes)
  customService.setCacheDuration(10 * 60 * 1000);
  
  try {
    // Get prices from different sources
    const goldFromSource = await customService.getMetalPriceFromSource('gold', 'INR', 'MOCK');
    console.log('Gold from MOCK source:', goldFromSource.success ? 'Success' : 'Failed');
    
    // Get supported metals and currencies
    const supportedMetals = customService.getSupportedMetals();
    const supportedCurrencies = customService.getSupportedCurrencies();
    
    console.log('Supported Metals:', Object.keys(supportedMetals));
    console.log('Supported Currencies:', supportedCurrencies);
    
    // Check API health
    const health = await customService.checkAPIHealth();
    console.log('API Health:', health);
    
  } catch (error) {
    console.error('Error in advanced usage:', error);
  }
}

/**
 * Caching example
 */
export async function cachingExample() {
  console.log('=== Caching Example ===');
  
  const metalService = getMetalService();
  
  try {
    console.log('First call (will fetch from API)...');
    const start1 = Date.now();
    const response1 = await metalService.getMetalPrice('silver', 'INR');
    const time1 = Date.now() - start1;
    console.log(`Silver price: $${response1.data?.price}, Time: ${time1}ms`);
    
    console.log('Second call (will use cache)...');
    const start2 = Date.now();
    const response2 = await metalService.getMetalPrice('silver', 'INR');
    const time2 = Date.now() - start2;
    console.log(`Silver price: $${response2.data?.price}, Time: ${time2}ms`);
    
    console.log(`Cache performance: ${time1}ms vs ${time2}ms (${Math.round((time1 - time2) / time1 * 100)}% faster)`);
    
    // Force refresh
    console.log('Force refresh call...');
    const start3 = Date.now();
    const response3 = await metalService.getMetalPrice('silver', 'INR', true);
    const time3 = Date.now() - start3;
    console.log(`Silver price: $${response3.data?.price}, Time: ${time3}ms`);
    
    // Get cache statistics
    const cacheStats = metalService.getCacheStats();
    console.log('Cache Stats:', cacheStats);
    
  } catch (error) {
    console.error('Error in caching example:', error);
  }
}

/**
 * Error handling example
 */
export async function errorHandlingExample() {
  console.log('=== Error Handling Example ===');
  
  const metalService = getMetalService();
  
  try {
    // Try to get price for unsupported metal
    const response = await metalService.getMetalPrice('unsupported_metal', 'INR');
    
    if (response.success) {
      console.log('Unexpected success for unsupported metal');
    } else {
      console.log('Expected error:', response.error);
      console.log('Error source:', response.source);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

/**
 * Service switching example
 */
export async function serviceSwitchingExample() {
  console.log('=== Service Switching Example ===');
  
  // Start with production service
  setServiceType(ServiceType.PRODUCTION);
  let metalService = getMetalService();
  console.log('Service type: Production');
  
  try {
    const response = await metalService.getMetalPrice('gold', 'INR');
    console.log('Production service result:', response.success ? 'Success' : 'Failed');
  } catch (error) {
    console.log('Production service error (expected if no internet):', error.message);
  }
  
  // Switch to mock service
  setServiceType(ServiceType.MOCK);
  metalService = getMetalService();
  console.log('Service type: Mock');
  
  try {
    const response = await metalService.getMetalPrice('gold', 'INR');
    console.log('Mock service result:', response.success ? 'Success' : 'Failed');
  } catch (error) {
    console.error('Mock service error:', error);
  }
  
  // Switch back to production
  setServiceType(ServiceType.PRODUCTION);
  console.log('Service type: Production (restored)');
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Starting Metal Service Examples...\n');
  
  try {
    await basicUsageExample();
    console.log();
    
    await mockServiceExample();
    console.log();
    
    await advancedUsageExample();
    console.log();
    
    await cachingExample();
    console.log();
    
    await errorHandlingExample();
    console.log();
    
    await serviceSwitchingExample();
    console.log();
    
    console.log('✅ All examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export individual examples for selective testing
export {
  basicUsageExample,
  mockServiceExample,
  advancedUsageExample,
  cachingExample,
  errorHandlingExample,
  serviceSwitchingExample
};
