import {
  getMetalService,
  setUseApi,
  getUseApi,
  setServiceType,
  ServiceType,
} from '../services';
import {
  API_CONFIG,
  shouldUseApi,
  updateApiUsage,
  getRemainingRequests,
  updateRemainingRequests,
} from '../config/apiConfig';

export function checkApiConfiguration() {
  console.log('=== API Configuration ===');
  console.log('Config file useApi:', API_CONFIG.useApi);
  console.log('Service factory useApi:', getUseApi());
  console.log('Should use API:', shouldUseApi());
  console.log('Remaining API requests:', getRemainingRequests());
  console.log('Max requests per month:', API_CONFIG.maxRequestsPerMonth);
}

export function switchToMockData() {
  console.log('=== Switching to Mock Data ===');

  updateApiUsage(false);
  console.log('Updated config file useApi to:', API_CONFIG.useApi);

  setUseApi(false);
  console.log('Updated service factory useApi to:', getUseApi());

  setServiceType(ServiceType.MOCK);
  console.log('Service type set to:', ServiceType.MOCK);

  console.log('Now using mock data - no API requests will be made!');
}

export function switchToRealApis() {
  console.log('=== Switching to Real APIs ===');

  if (getRemainingRequests() > 0) {
    updateApiUsage(true);
    console.log('Updated config file useApi to:', API_CONFIG.useApi);

    setUseApi(true);
    console.log('Updated service factory useApi to:', getUseApi());

    setServiceType(ServiceType.PRODUCTION);
    console.log('Service type set to:', ServiceType.PRODUCTION);

    console.log('Now using real APIs - API requests will be consumed!');
  } else {
    console.log('⚠️  No API requests remaining! Staying with mock data.');
    console.log('Update remaining requests count or wait for next month.');
  }
}

export function updateRemainingApiRequests(count: number) {
  console.log('=== Updating Remaining API Requests ===');
  console.log('Previous count:', getRemainingRequests());

  updateRemainingRequests(count);
  console.log('New count:', getRemainingRequests());

  if (count > 0) {
    console.log('✅ API requests available - you can switch to real APIs');
  } else {
    console.log('⚠️  No API requests available - using mock data');

    switchToMockData();
  }
}

export async function testServiceBehavior() {
  console.log('=== Testing Service Behavior ===');

  const metalService = getMetalService();

  try {
    const response = await metalService.getMetalPrice('gold', 'INR');

    if (response.success && response.data) {
      console.log(`Gold Price: $${response.data.price}`);
      console.log('Data source:', response.source);

      if (response.source === 'Cache') {
        console.log('📋 Data served from cache');
      } else if (response.source === 'Mock Service') {
        console.log('🎭 Data served from mock service (no API request)');
      } else {
        console.log('🌐 Data served from real API (consumed API request)');
      }
    } else {
      console.error('Failed to get gold price:', response.error);
    }
  } catch (error) {
    console.error('Error testing service:', error);
  }
}

export function monitorApiUsage() {
  console.log('=== API Usage Monitor ===');

  const remaining = getRemainingRequests();
  const max = API_CONFIG.maxRequestsPerMonth;
  const used = max - remaining;
  const percentage = (used / max) * 100;

  console.log(
    `📊 API Usage: ${used}/${max} requests used (${percentage.toFixed(1)}%)`
  );

  if (remaining === 0) {
    console.log('🚫 No API requests remaining - using mock data');
  } else if (remaining <= 5) {
    console.log('⚠️  Low on API requests - consider switching to mock data');
  } else if (remaining <= 10) {
    console.log('⚠️  Moderate API requests remaining');
  } else {
    console.log('✅ Plenty of API requests available');
  }

  if (remaining <= 2) {
    console.log(
      '🔄 Auto-switching to mock data to preserve remaining requests'
    );
    switchToMockData();
  }
}

export function developmentWorkflow() {
  console.log('=== Development Workflow ===');

  console.log('1. 🔧 During development:');
  console.log('   - Set useApi: false in src/config/apiConfig.ts');
  console.log('   - Use mock data for testing');
  console.log('   - No API requests consumed');

  console.log('\n2. 🧪 During testing:');
  console.log('   - Keep useApi: false');
  console.log('   - Mock data provides consistent test environment');

  console.log('\n3. 🚀 Before production:');
  console.log('   - Set useApi: true in config');
  console.log('   - Update remaining API requests count');
  console.log('   - Test with real APIs');

  console.log('\n4. 📱 In production:');
  console.log('   - Monitor API usage');
  console.log('   - Switch to mock data if running low on requests');
}

export function runAllExamples() {
  console.log('🚀 Starting API Control Examples...\n');

  try {
    checkApiConfiguration();
    console.log();

    monitorApiUsage();
    console.log();

    developmentWorkflow();
    console.log();

    console.log('💡 Quick Commands:');
    console.log(
      '  switchToMockData()     - Switch to mock data (save API requests)'
    );
    console.log(
      '  switchToRealApis()     - Switch to real APIs (if requests available)'
    );
    console.log(
      '  updateRemainingApiRequests(25) - Update remaining request count'
    );
    console.log('  testServiceBehavior()  - Test current service behavior');

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

export {
  checkApiConfiguration,
  switchToMockData,
  switchToRealApis,
  updateRemainingApiRequests,
  testServiceBehavior,
  monitorApiUsage,
  developmentWorkflow,
};
