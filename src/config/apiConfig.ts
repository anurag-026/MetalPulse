// API Configuration - Simple boolean flag to control API usage
// Set this to false to use mock data instead of real APIs
// This helps conserve API requests during development/testing

export const API_CONFIG = {
  // Set to false to use mock data instead of real APIs
  // Set to true to use real APIs (consumes API requests)
  useApi: true, // Change this to false to save API requests
  
  // Primary currency configuration
  primaryCurrency: 'INR', // Primary currency for the app
  defaultCurrency: 'INR', // Default currency for API calls
  
  // API rate limiting info
  maxRequestsPerMonth: 50,
  remainingRequests: 0, // Update this as needed
  
  // Cache settings
  cacheDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Fallback settings
  enableFallback: true, // Enable fallback to secondary API if primary fails
};

// Helper function to check if APIs should be used
export const shouldUseApi = (): boolean => {
  return API_CONFIG.useApi;
};

// Helper function to update API usage setting
export const updateApiUsage = (useApi: boolean): void => {
  API_CONFIG.useApi = useApi;
};

// Helper function to get remaining API requests
export const getRemainingRequests = (): number => {
  return API_CONFIG.remainingRequests;
};

// Helper function to update remaining API requests
export const updateRemainingRequests = (count: number): void => {
  API_CONFIG.remainingRequests = count;
};

// Helper function to get primary currency
export const getPrimaryCurrency = (): string => {
  return API_CONFIG.primaryCurrency;
};

// Helper function to get default currency
export const getDefaultCurrency = (): string => {
  return API_CONFIG.defaultCurrency;
};
