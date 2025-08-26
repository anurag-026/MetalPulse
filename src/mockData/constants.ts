export const MOCK_API_CONFIG = {
  baseUrls: {
    goldApi: 'https://api.goldapi.io',
    metalsDev: 'https://api.metals.live',
    mockApi: 'https://mock-api.example.com',
  },
  endpoints: {
    goldPrice: '/v1/metal/price',
    metalsPrice: '/v1/spot',
    historicalData: '/v1/history',
    marketData: '/v1/market',
  },
  rateLimits: {
    goldApi: {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
    },
    metalsDev: {
      requestsPerMinute: 30,
      requestsPerHour: 500,
      requestsPerDay: 5000,
    },
  },
  timeouts: {
    request: 10000,
    connection: 5000,
    read: 15000,
  },
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2,
  },
};

export const MOCK_CURRENCY_CONFIG = {
  supported: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'],
  primary: 'INR',
  default: 'INR',
  symbols: {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: 'C$',
    AUD: 'A$',
  },
  names: {
    INR: 'Indian Rupee',
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CNY: 'Chinese Yuan',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
  },
  exchangeRates: {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0096,
    JPY: 1.78,
    CNY: 0.087,
    CAD: 0.016,
    AUD: 0.018,
  },
};

export const MOCK_METAL_CONFIG = {
  supported: ['gold', 'silver', 'platinum', 'palladium'],
  primary: 'gold',
  units: ['oz', 'g', 'kg', 't'],
  defaultUnit: 'oz',
  purityLevels: [24, 22, 21, 20, 18, 16, 14, 10],
  defaultPurity: 24,
  density: {
    gold: 19.32,
    silver: 10.49,
    platinum: 21.45,
    palladium: 12.02,
  },
  atomicWeights: {
    gold: 196.967,
    silver: 107.868,
    platinum: 195.084,
    palladium: 106.42,
  },
};

export const MOCK_TIME_CONFIG = {
  timeframes: ['1D', '1W', '1M', '6M', '1Y', 'All'],
  defaultTimeframe: '1D',
  refreshIntervals: [15, 30, 60, 300, 900],
  defaultRefreshInterval: 30,
  timezones: ['UTC', 'Asia/Kolkata', 'America/New_York', 'Europe/London'],
  defaultTimezone: 'Asia/Kolkata',
  dateFormats: {
    short: 'MM/DD/YYYY',
    long: 'MMMM DD, YYYY',
    iso: 'YYYY-MM-DD',
  },
  timeFormats: {
    short: 'HH:mm',
    long: 'HH:mm:ss',
    ampm: 'hh:mm A',
  },
};

export const MOCK_UI_CONFIG = {
  themes: {
    light: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#FFD700',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#1a1a2e',
      textSecondary: '#666666',
      border: '#e9ecef',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
    },
    dark: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#FFD700',
      background: '#0f0f23',
      surface: '#1a1a2e',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#2a2a3e',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
    },
  },
  defaultTheme: 'dark',
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const MOCK_NOTIFICATION_CONFIG = {
  types: {
    success: {
      icon: 'checkmark-circle',
      color: '#4CAF50',
      duration: 3000,
    },
    warning: {
      icon: 'warning',
      color: '#FF9800',
      duration: 4000,
    },
    error: {
      icon: 'close-circle',
      color: '#F44336',
      duration: 5000,
    },
    info: {
      icon: 'information-circle',
      color: '#2196F3',
      duration: 3000,
    },
  },
  positions: ['top', 'bottom', 'center'],
  defaultPosition: 'top',
  maxVisible: 3,
  autoHide: true,
  swipeEnabled: true,
};

export const MOCK_ERROR_CONFIG = {
  messages: {
    networkError:
      'Network connection error. Please check your internet connection.',
    apiError: 'API service temporarily unavailable. Please try again later.',
    rateLimitError:
      'Rate limit exceeded. Please wait before making another request.',
    timeoutError: 'Request timed out. Please try again.',
    unknownError: 'An unexpected error occurred. Please try again.',
    noDataError: 'No data available for the requested information.',
    validationError: 'Invalid input provided. Please check your data.',
    authenticationError: 'Authentication failed. Please log in again.',
    authorizationError: 'You do not have permission to access this resource.',
  },
  retryable: ['networkError', 'apiError', 'timeoutError', 'rateLimitError'],
  userFriendly: true,
  logErrors: true,
  showStackTraces: false,
};

export function getMockApiConfig() {
  return MOCK_API_CONFIG;
}

export function getMockCurrencyConfig() {
  return MOCK_CURRENCY_CONFIG;
}

export function getMockMetalConfig() {
  return MOCK_METAL_CONFIG;
}

export function getMockTimeConfig() {
  return MOCK_TIME_CONFIG;
}

export function getMockUiConfig() {
  return MOCK_UI_CONFIG;
}

export function getMockNotificationConfig() {
  return MOCK_NOTIFICATION_CONFIG;
}

export function getMockErrorConfig() {
  return MOCK_ERROR_CONFIG;
}

export function getMockConfigValue(category: string, key: string) {
  const configs = {
    api: MOCK_API_CONFIG,
    currency: MOCK_CURRENCY_CONFIG,
    metal: MOCK_METAL_CONFIG,
    time: MOCK_TIME_CONFIG,
    ui: MOCK_UI_CONFIG,
    notification: MOCK_NOTIFICATION_CONFIG,
    error: MOCK_ERROR_CONFIG,
  };

  const config = configs[category as keyof typeof configs];
  if (!config) {
    throw new Error(`Unknown configuration category: ${category}`);
  }

  return (config as any)[key];
}
