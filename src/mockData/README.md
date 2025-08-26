# Mock Data Directory

This directory contains all mock data for the Precious Metals app. **No other files in the app should contain mock data directly** - all mock data must be imported from this centralized location.

## Structure

```
src/mockData/
├── index.ts              # Main export file
├── metalData.ts          # Metal prices, symbols, and configuration
├── marketData.ts         # Market performance, sentiment, and analytics
├── userData.ts           # User preferences, portfolio, and activity
├── constants.ts          # Configuration constants and settings
└── README.md            # This documentation file
```

## Usage

### Importing Mock Data

```typescript
// Import specific mock data
import { generateMockMetalPrice, MOCK_METAL_INFO } from '../mockData/metalData';

// Import from main index (recommended)
import { generateMockMetalPrice, getMockMarketPerformance } from '../mockData';
```

### Available Mock Data

#### Metal Data (`metalData.ts`)
- **Metal Information**: Names, symbols, colors, icons
- **Price Generation**: Realistic mock price data with volatility
- **Configuration**: Units, carats, timeframes
- **Functions**: `generateMockMetalPrice()`, `getSupportedMetalIds()`

#### Market Data (`marketData.ts`)
- **Performance Metrics**: Volume, market cap, returns
- **Sentiment Data**: Bullish/bearish indicators, fear/greed index
- **Trading Information**: Session data, news, economic indicators
- **Chart Data**: Timeframe-based mock chart data
- **Functions**: `getMockMarketPerformance()`, `getMockChartData()`

#### User Data (`userData.ts`)
- **Preferences**: Theme, notifications, display settings
- **Portfolio**: Holdings, performance, transactions
- **Watchlist**: Tracked metals and alerts
- **Account**: User profile and activity data
- **Functions**: `getMockUserPortfolio()`, `updateMockUserPreferences()`

#### Constants (`constants.ts`)
- **API Configuration**: URLs, endpoints, rate limits
- **Currency Settings**: Supported currencies, exchange rates
- **UI Configuration**: Themes, spacing, animations
- **Error Messages**: Standardized error text
- **Functions**: `getMockApiConfig()`, `getMockUiConfig()`

## Best Practices

### ✅ Do's
- Import all mock data from this directory
- Use the provided helper functions
- Keep mock data realistic and varied
- Update mock data when adding new features

### ❌ Don'ts
- Create mock data in other files
- Hardcode mock values in components
- Duplicate mock data across files
- Use inconsistent data formats

## Adding New Mock Data

1. **Create a new file** in the `mockData` directory
2. **Export functions** for accessing the data
3. **Add to index.ts** for easy importing
4. **Update this README** with new data description

### Example

```typescript
// newMockData.ts
export const NEW_MOCK_DATA = {
  // Your mock data here
};

export function getNewMockData() {
  return NEW_MOCK_DATA;
}

// index.ts
export * from './newMockData';
```

## Migration Guide

If you have existing mock data in other files:

1. **Move the data** to appropriate files in this directory
2. **Update imports** to use the centralized location
3. **Remove old mock data** from original files
4. **Test thoroughly** to ensure functionality remains

## Testing

Mock data is designed to be:
- **Realistic**: Mimics real-world data patterns
- **Consistent**: Same data structure across the app
- **Maintainable**: Centralized and easy to update
- **Performant**: No unnecessary API calls during development

## Support

For questions about mock data structure or adding new mock data, refer to:
- This README file
- The individual mock data files
- The main app documentation
