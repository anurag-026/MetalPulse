export const API_CONFIG = {
  useApi: false,

  primaryCurrency: 'INR',
  defaultCurrency: 'INR',

  maxRequestsPerMonth: 50,
  remainingRequests: 0,

  cacheDuration: 5 * 60 * 1000,

  enableFallback: true,
};

export const shouldUseApi = (): boolean => {
  return API_CONFIG.useApi;
};

export const updateApiUsage = (useApi: boolean): void => {
  API_CONFIG.useApi = useApi;
};

export const getRemainingRequests = (): number => {
  return API_CONFIG.remainingRequests;
};

export const updateRemainingRequests = (count: number): void => {
  API_CONFIG.remainingRequests = count;
};

export const getPrimaryCurrency = (): string => {
  return API_CONFIG.primaryCurrency;
};

export const getDefaultCurrency = (): string => {
  return API_CONFIG.defaultCurrency;
};
