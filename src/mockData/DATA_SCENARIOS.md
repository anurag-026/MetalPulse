# App Data Scenarios & Error Handling

This document explains how the Precious Metals app handles different data availability scenarios and what users will see in each case.

## Data Availability Scenarios

### 1. **Full Data Available (Optimal Scenario)**
- **API Status**: All APIs working
- **Mock Data**: Available as fallback
- **User Experience**: 
  - Real-time market data displayed
  - All metal cards show live prices
  - Charts and analytics fully functional
  - Toast notifications for successful updates

### 2. **Partial API Data (Mixed Scenario)**
- **API Status**: Some APIs working, some failing
- **Mock Data**: Available for failed APIs
- **User Experience**:
  - Working APIs show live data
  - Failed APIs fallback to mock data
  - Toast notifications explain fallbacks
  - Mixed data sources clearly indicated

### 3. **No API Data, Mock Data Available (Fallback Scenario)**
- **API Status**: All APIs down
- **Mock Data**: Available and functional
- **User Experience**:
  - Mock data displayed with clear indication
  - "Mock Data" indicator in header
  - Toast notification explaining the situation
  - App remains fully functional with realistic data

### 4. **No API Data, No Mock Data (Critical Scenario)**
- **API Status**: All APIs down
- **Mock Data**: Unavailable or corrupted
- **User Experience**:
  - EmptyState component displayed
  - Clear error message explaining the issue
  - Retry button to attempt data fetch
  - Helpful guidance for users

## Visual States

### Loading State
```
┌─────────────────────────────────────┐
│ 🔄 Loading...                       │
│                                     │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ ███████████ │ │ ███████████ │    │
│ │ ███████████ │ │ ███████████ │    │
│ │ ███████████ │ │ ███████████ │    │
│ └─────────────┘ └─────────────┘    │
│                                     │
│ Loading market data...              │
└─────────────────────────────────────┘
```

### Empty State (No Data)
```
┌─────────────────────────────────────┐
│                                     │
│           🗄️                        │
│                                     │
│      No Market Data Available       │
│                                     │
│ We couldn't fetch any market data  │
│ from our sources. This could be    │
│ due to network issues, API         │
│ unavailability, or temporary       │
│ service disruptions.                │
│                                     │
│        [Try Again]                  │
│                                     │
│        [Retry]                      │
│                                     │
│ Try refreshing or check your       │
│ connection                          │
└─────────────────────────────────────┘
```

### Mock Data State
```
┌─────────────────────────────────────┐
│ Precious Metals                    │
│ Live Market Prices (24 Carat)      │
│                                     │
│ Last updated: 2:30:45 PM           │
│ 💰 INR  [Mock Data]                │
│                                     │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ 🥇 Gold     │ │ 🥈 Silver   │    │
│ │ $1,950.00   │ │ $24.80     │    │
│ │ +$25.00     │ │ -$0.30     │    │
│ │ +1.3%       │ │ -1.2%      │    │
│ └─────────────┘ └─────────────┘    │
└─────────────────────────────────────┘
```

## Error Handling Flow

### 1. **API Check Phase**
```
App Start → Check API Status → Determine Data Source
```

### 2. **Data Fetch Phase**
```
Fetch Data → Success? → Display Live Data
     ↓
   Failure? → Fallback to Mock Data
     ↓
   Mock Data Available? → Display Mock Data
     ↓
   No Mock Data? → Show Empty State
```

### 3. **User Feedback Phase**
```
Toast Notifications → Status Indicators → Error States
```

## User Experience Guidelines

### ✅ **Good Practices**
- Always show loading states during data fetch
- Provide clear feedback about data source (Live vs Mock)
- Offer retry mechanisms for failed requests
- Use appropriate error messages for different scenarios
- Maintain app functionality even with limited data

### ❌ **Avoid**
- Infinite loading states
- Unclear error messages
- No retry options
- App crashes or blank screens
- Confusing data source indicators

## Testing Scenarios

### **Test Case 1: Network Disconnection**
1. Disconnect internet
2. Open app
3. Expected: Mock data with "Mock Data" indicator
4. Expected: Toast notification about API unavailability

### **Test Case 2: API Rate Limiting**
1. Make multiple rapid requests
2. Expected: Rate limit warning toast
3. Expected: Fallback to mock data
4. Expected: Clear indication of data source

### **Test Case 3: Mock Data Corruption**
1. Corrupt mock data files
2. Expected: Empty state with retry option
3. Expected: Clear error message
4. Expected: Helpful user guidance

### **Test Case 4: Mixed Data Sources**
1. Some APIs working, some failing
2. Expected: Mixed data display
3. Expected: Clear indication of which data is live vs mock
4. Expected: Appropriate fallback messages

## Implementation Notes

### **Components Used**
- `EmptyState`: For no-data scenarios
- `SkeletonLoader`: For loading states
- `Toast`: For user notifications
- `StatusBar`: For API status indicators

### **State Management**
- `hasAnyData`: Tracks if any data is available
- `dataError`: Stores error messages
- `useMockData`: Indicates data source
- `loadingStates`: Individual loading states per metal

### **Error Recovery**
- Automatic fallback to mock data
- User-initiated retry mechanisms
- Graceful degradation of features
- Clear communication about limitations

## Future Improvements

### **Planned Enhancements**
- Offline mode with cached data
- Better error categorization
- User preferences for data sources
- Advanced retry strategies
- Data quality indicators

### **Monitoring & Analytics**
- Track API failure rates
- Monitor user experience metrics
- Alert on critical failures
- Performance optimization based on usage patterns
