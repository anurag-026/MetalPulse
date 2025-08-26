import {
  getMetalService,
  setServiceType,
  ServiceType,
  MetalService,
  MockMetalServiceImp,
} from '../services';

export async function basicUsageExample() {
  console.log('=== Basic Usage Example ===');

  const metalService = getMetalService();

  try {
    const goldResponse = await metalService.getMetalPrice('gold', 'INR');

    if (goldResponse.success && goldResponse.data) {
      console.log(
        `Gold Price: $${goldResponse.data.price} (${goldResponse.data.change >= 0 ? '+' : ''}${goldResponse.data.change}%)`
      );
    } else {
      console.error('Failed to get gold price:', goldResponse.error);
    }

    const allPrices = await metalService.getAllMetalPrices('INR');
    console.log(
      'All Metal Prices:',
      Object.keys(allPrices).length,
      'metals fetched'
    );
  } catch (error) {
    console.error('Error in basic usage:', error);
  }
}

export async function mockServiceExample() {
  console.log('=== Mock Service Example ===');

  setServiceType(ServiceType.MOCK);

  const metalService = getMetalService();

  try {
    const goldResponse = await metalService.getMetalPrice('gold', 'INR');

    if (goldResponse.success && goldResponse.data) {
      console.log(
        `Mock Gold Price: $${goldResponse.data.price} (${goldResponse.data.change >= 0 ? '+' : ''}${goldResponse.data.change}%)`
      );
    }

    const cacheStats = metalService.getCacheStats();
    console.log('Cache Stats:', cacheStats);
  } catch (error) {
    console.error('Error in mock service:', error);
  }
}

export async function advancedUsageExample() {
  console.log('=== Advanced Usage Example ===');

  const mockDao = new MockMetalServiceImp();
  const customService = new MetalService(mockDao);

  customService.setCacheDuration(10 * 60 * 1000);

  try {
    const goldFromSource = await customService.getMetalPriceFromSource(
      'gold',
      'INR',
      'MOCK'
    );
    console.log(
      'Gold from MOCK source:',
      goldFromSource.success ? 'Success' : 'Failed'
    );

    const supportedMetals = customService.getSupportedMetals();
    const supportedCurrencies = customService.getSupportedCurrencies();

    console.log('Supported Metals:', Object.keys(supportedMetals));
    console.log('Supported Currencies:', supportedCurrencies);

    const health = await customService.checkAPIHealth();
    console.log('API Health:', health);
  } catch (error) {
    console.error('Error in advanced usage:', error);
  }
}

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

    console.log(
      `Cache performance: ${time1}ms vs ${time2}ms (${Math.round(((time1 - time2) / time1) * 100)}% faster)`
    );

    console.log('Force refresh call...');
    const start3 = Date.now();
    const response3 = await metalService.getMetalPrice('silver', 'INR', true);
    const time3 = Date.now() - start3;
    console.log(`Silver price: $${response3.data?.price}, Time: ${time3}ms`);

    const cacheStats = metalService.getCacheStats();
    console.log('Cache Stats:', cacheStats);
  } catch (error) {
    console.error('Error in caching example:', error);
  }
}

export async function errorHandlingExample() {
  console.log('=== Error Handling Example ===');

  const metalService = getMetalService();

  try {
    const response = await metalService.getMetalPrice(
      'unsupported_metal',
      'INR'
    );

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

export async function serviceSwitchingExample() {
  console.log('=== Service Switching Example ===');

  setServiceType(ServiceType.PRODUCTION);
  let metalService = getMetalService();
  console.log('Service type: Production');

  try {
    const response = await metalService.getMetalPrice('gold', 'INR');
    console.log(
      'Production service result:',
      response.success ? 'Success' : 'Failed'
    );
  } catch (error) {
    console.log(
      'Production service error (expected if no internet):',
      error.message
    );
  }

  setServiceType(ServiceType.MOCK);
  metalService = getMetalService();
  console.log('Service type: Mock');

  try {
    const response = await metalService.getMetalPrice('gold', 'INR');
    console.log(
      'Mock service result:',
      response.success ? 'Success' : 'Failed'
    );
  } catch (error) {
    console.error('Mock service error:', error);
  }

  setServiceType(ServiceType.PRODUCTION);
  console.log('Service type: Production (restored)');
}

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

export {
  basicUsageExample,
  mockServiceExample,
  advancedUsageExample,
  cachingExample,
  errorHandlingExample,
  serviceSwitchingExample,
};
