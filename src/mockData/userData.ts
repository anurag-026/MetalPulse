export const MOCK_USER_PREFERENCES = {
  defaultCurrency: 'INR',
  defaultLanguage: 'en',
  theme: 'dark',
  notifications: {
    priceAlerts: true,
    marketUpdates: true,
    newsAlerts: false,
    pushNotifications: true,
  },
  display: {
    showPercentages: true,
    showTimestamps: true,
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 30,
  },
  privacy: {
    shareAnalytics: true,
    shareUsageData: false,
    allowTracking: false,
  },
};

export const MOCK_USER_PORTFOLIO = {
  totalValue: 125000,
  currency: 'INR',
  metals: [
    {
      id: 'gold',
      name: 'Gold',
      quantity: 2.5,
      unit: 'oz',
      averagePrice: 1850,
      currentPrice: 1950,
      totalValue: 4875,
      profitLoss: 250,
      profitLossPercent: 5.4,
    },
    {
      id: 'silver',
      name: 'Silver',
      quantity: 50,
      unit: 'oz',
      averagePrice: 22.5,
      currentPrice: 24.8,
      totalValue: 1240,
      profitLoss: 115,
      profitLossPercent: 10.2,
    },
    {
      id: 'platinum',
      name: 'Platinum',
      quantity: 1.0,
      unit: 'oz',
      averagePrice: 920,
      currentPrice: 950,
      totalValue: 950,
      profitLoss: 30,
      profitLossPercent: 3.3,
    },
  ],
  performance: {
    totalReturn: 395,
    totalReturnPercent: 3.2,
    monthlyReturn: 125,
    monthlyReturnPercent: 1.0,
    yearlyReturn: 1850,
    yearlyReturnPercent: 15.2,
  },
};

export const MOCK_USER_WATCHLIST = [
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'Au',
    currentPrice: 1950,
    change: 25,
    changePercent: 1.3,
    alertPrice: 2000,
    alertType: 'above',
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'Ag',
    currentPrice: 24.8,
    change: -0.3,
    changePercent: -1.2,
    alertPrice: 22.0,
    alertType: 'below',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    symbol: 'Pt',
    currentPrice: 950,
    change: 15,
    changePercent: 1.6,
    alertPrice: 1000,
    alertType: 'above',
  },
];

export const MOCK_USER_TRANSACTIONS = [
  {
    id: 1,
    type: 'buy',
    metalId: 'gold',
    metalName: 'Gold',
    quantity: 1.0,
    unit: 'oz',
    price: 1850,
    total: 1850,
    currency: 'INR',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: 2,
    type: 'buy',
    metalId: 'silver',
    metalName: 'Silver',
    quantity: 25,
    unit: 'oz',
    price: 22.5,
    total: 562.5,
    currency: 'INR',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: 3,
    type: 'sell',
    metalId: 'gold',
    metalName: 'Gold',
    quantity: 0.5,
    unit: 'oz',
    price: 1900,
    total: 950,
    currency: 'INR',
    timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
];

export const MOCK_USER_ALERTS = [
  {
    id: 1,
    type: 'price',
    metalId: 'gold',
    metalName: 'Gold',
    condition: 'above',
    price: 2000,
    currency: 'INR',
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    type: 'price',
    metalId: 'silver',
    metalName: 'Silver',
    condition: 'below',
    price: 22.0,
    currency: 'INR',
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: 'percentage',
    metalId: 'platinum',
    metalName: 'Platinum',
    condition: 'above',
    percentage: 5.0,
    isActive: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export const MOCK_USER_ACCOUNT = {
  id: 'user_12345',
  username: 'precious_metals_user',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+91-98765-43210',
  country: 'India',
  city: 'Mumbai',
  timezone: 'Asia/Kolkata',
  createdAt: new Date('2023-01-15'),
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
  isVerified: true,
  subscription: 'premium',
  subscriptionExpiry: new Date('2024-12-31'),
};

export const MOCK_USER_ACTIVITY = {
  loginCount: 45,
  lastMonthLogins: 12,
  favoriteMetals: ['gold', 'silver'],
  mostViewedTimeframe: '1D',
  averageSessionDuration: 15,
  totalAppUsage: 180,
  featuresUsed: ['priceTracking', 'portfolio', 'alerts', 'news'],
  deviceInfo: {
    platform: 'iOS',
    version: '17.0',
    appVersion: '1.2.0',
  },
};

export function getMockUserPreferences() {
  return MOCK_USER_PREFERENCES;
}

export function getMockUserPortfolio() {
  return MOCK_USER_PORTFOLIO;
}

export function getMockUserWatchlist() {
  return MOCK_USER_WATCHLIST;
}

export function getMockUserTransactions() {
  return MOCK_USER_TRANSACTIONS;
}

export function getMockUserAlerts() {
  return MOCK_USER_ALERTS;
}

export function getMockUserAccount() {
  return MOCK_USER_ACCOUNT;
}

export function getMockUserActivity() {
  return MOCK_USER_ACTIVITY;
}

export function updateMockUserPreferences(
  updates: Partial<typeof MOCK_USER_PREFERENCES>
) {
  Object.assign(MOCK_USER_PREFERENCES, updates);
  return MOCK_USER_PREFERENCES;
}

export function addMockTransaction(
  transaction: Omit<(typeof MOCK_USER_TRANSACTIONS)[0], 'id'>
) {
  const newTransaction = {
    ...transaction,
    id: MOCK_USER_TRANSACTIONS.length + 1,
  };
  MOCK_USER_TRANSACTIONS.unshift(newTransaction);
  return newTransaction;
}

export function addMockAlert(
  alert: Omit<(typeof MOCK_USER_ALERTS)[0], 'id' | 'createdAt'>
) {
  const newAlert = {
    ...alert,
    id: MOCK_USER_ALERTS.length + 1,
    createdAt: new Date(),
  } as (typeof MOCK_USER_ALERTS)[0];

  MOCK_USER_ALERTS.unshift(newAlert);
  return newAlert;
}
