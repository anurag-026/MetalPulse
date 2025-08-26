export const MOCK_MARKET_PERFORMANCE = {
  volume: '2.5M',
  marketCap: '$12.5T',
  volatility: 'Medium',
  yearlyReturn: '+15.2%',
  dailyVolume: '1.8M',
  weeklyChange: '+2.3%',
  monthlyChange: '+8.7%',
  yearlyChange: '+15.2%',
};

export const MOCK_MARKET_SENTIMENT = {
  bullish: 65,
  bearish: 20,
  neutral: 15,
  fearGreedIndex: 72,
  marketMood: 'Optimistic',
  riskLevel: 'Moderate',
};

export const MOCK_TRADING_SESSION = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '17:00',
  timezone: 'UTC',
  nextHoliday: '2024-01-01',
  sessionType: 'Regular',
};

export const MOCK_MARKET_NEWS = [
  {
    id: 1,
    title: 'Gold prices surge to 3-month high',
    summary:
      'Strong demand from central banks and geopolitical tensions drive gold prices higher',
    impact: 'positive',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    source: 'MarketWatch',
  },
  {
    id: 2,
    title: 'Silver industrial demand increases',
    summary:
      'Growing solar panel and electric vehicle production boosts silver demand',
    impact: 'positive',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    source: 'Reuters',
  },
  {
    id: 3,
    title: 'Platinum supply concerns emerge',
    summary: 'Mining disruptions in South Africa affect platinum supply',
    impact: 'neutral',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    source: 'Bloomberg',
  },
];

export const MOCK_ECONOMIC_INDICATORS = {
  inflation: '3.2%',
  interestRate: '5.25%',
  gdpGrowth: '2.1%',
  unemployment: '3.8%',
  consumerConfidence: '108.7',
  manufacturingPMI: '50.2',
};

export const MOCK_EXCHANGE_RATES = {
  INR: 83.25,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 148.5,
  CNY: 7.23,
  CAD: 1.35,
};

export const MOCK_VOLATILITY_DATA = {
  gold: {
    current: 0.15,
    average: 0.18,
    trend: 'decreasing',
  },
  silver: {
    current: 0.25,
    average: 0.28,
    trend: 'decreasing',
  },
  platinum: {
    current: 0.2,
    average: 0.22,
    trend: 'stable',
  },
  palladium: {
    current: 0.35,
    average: 0.32,
    trend: 'increasing',
  },
};

export const MOCK_CHART_DATA = {
  '1D': {
    intervals: 24,
    data: generateMockChartData(24, 0.05),
  },
  '1W': {
    intervals: 7,
    data: generateMockChartData(7, 0.15),
  },
  '1M': {
    intervals: 30,
    data: generateMockChartData(30, 0.25),
  },
  '6M': {
    intervals: 26,
    data: generateMockChartData(26, 0.35),
  },
  '1Y': {
    intervals: 52,
    data: generateMockChartData(52, 0.45),
  },
};

function generateMockChartData(points: number, volatility: number) {
  const data = [];
  let price = 1000;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility * price;
    price += change;
    data.push({
      timestamp: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000),
      price: Math.round(price * 100) / 100,
      volume: Math.round(Math.random() * 1000000 + 500000),
    });
  }

  return data;
}

export const MOCK_MARKET_ANALYSIS = {
  technical: {
    gold: {
      rsi: 58,
      macd: 'bullish',
      support: 1920,
      resistance: 1980,
      trend: 'uptrend',
    },
    silver: {
      rsi: 45,
      macd: 'neutral',
      support: 23.5,
      resistance: 25.2,
      trend: 'sideways',
    },
    platinum: {
      rsi: 62,
      macd: 'bullish',
      support: 920,
      resistance: 980,
      trend: 'uptrend',
    },
    palladium: {
      rsi: 38,
      macd: 'bearish',
      support: 1750,
      resistance: 1850,
      trend: 'downtrend',
    },
  },
  fundamental: {
    gold: {
      peRatio: 'N/A',
      dividendYield: 'N/A',
      marketCap: '$13.2T',
      supply: '201,296 tonnes',
      demand: '4,741 tonnes',
    },
    silver: {
      peRatio: 'N/A',
      dividendYield: 'N/A',
      marketCap: '$1.8T',
      supply: '26,800 tonnes',
      demand: '1,123 tonnes',
    },
  },
};

export function getMockMarketPerformance() {
  return MOCK_MARKET_PERFORMANCE;
}

export function getMockMarketSentiment() {
  return MOCK_MARKET_SENTIMENT;
}

export function getMockTradingSession() {
  return MOCK_TRADING_SESSION;
}

export function getMockMarketNews() {
  return MOCK_MARKET_NEWS;
}

export function getMockEconomicIndicators() {
  return MOCK_ECONOMIC_INDICATORS;
}

export function getMockExchangeRates() {
  return MOCK_EXCHANGE_RATES;
}

export function getMockVolatilityData() {
  return MOCK_VOLATILITY_DATA;
}

export function getMockChartData(timeframe: string) {
  return MOCK_CHART_DATA[timeframe as keyof typeof MOCK_CHART_DATA];
}

export function getMockMarketAnalysis() {
  return MOCK_MARKET_ANALYSIS;
}
