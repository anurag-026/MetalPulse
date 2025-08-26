# Metal Pulse

<h2 align="center">
  A React Native mobile application for tracking precious metal prices with beautiful onboarding screens and real-time market data.
</h2>

<p align="center">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.71.14-blue.svg">
  <img alt="Expo" src="https://img.shields.io/badge/Expo-48.0.15-black.svg">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-4.9.4-blue.svg">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green.svg">
</p>

<div align="center">
  
  ## ⚠️ **IMPORTANT: API Rate Limit Notice**
  
  **If you hit the API rate limit, simply change `useApi: true` to `useApi: false` in `src/config/apiConfig.ts`**
  
  The app will automatically switch to mock data mode, so you can continue development without API restrictions!
  
  ```typescript
  // src/config/apiConfig.ts
  export const apiConfig = {
    useApi: false,  // ← Change this to false when API limit is reached
    defaultCurrency: 'INR',
    // ... other config
  }
  ```
  
</div>

## 📱 About

Elemental Pulse is a modern React Native application that provides users with real-time precious metal price tracking, beautiful onboarding experience, and an intuitive interface for monitoring market data. The app features smooth animations, gesture controls, and a responsive design built with modern React Native practices.

## 🎥 App Demo

![Elemental Pulse Demo](metal-pulse.gif)

*Watch Elemental Pulse in action - Beautiful onboarding screens and metal price tracking interface*



## ✨ Features

- **Onboarding Experience**: Beautiful animated onboarding screens with smooth transitions
- **Real-time Metal Prices**: Track precious metals like Gold, Silver, Platinum, and more
- **Multi-currency Support**: View prices in different currencies with real-time conversion
- **Interactive UI**: Smooth animations and gesture controls using React Native Reanimated
- **Responsive Design**: Optimized for both Android and iOS devices
- **Offline Support**: Mock data fallback when API is unavailable
- **Modern Architecture**: Built with TypeScript, Context API, and modern React patterns

## 🏗️ Project Structure

```
elemental_pulse/
├── android/                 # Android native configuration
├── assets/                  # App icons and splash screens
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── CurrencySidebar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Pagination.tsx
│   │   ├── PriceDisplay.tsx
│   │   └── SkeletonLoader.tsx
│   ├── config/            # API configuration
│   ├── constants/         # Theme and app constants
│   ├── context/           # React Context providers
│   │   ├── CurrencyContext.tsx
│   │   └── NavigationContext.tsx
│   ├── data/              # Screen definitions
│   ├── models/            # TypeScript interfaces and types
│   ├── screens/           # Main app screens
│   │   ├── Home.tsx
│   │   ├── MetalDetail.tsx
│   │   └── Onboarding.tsx
│   ├── services/          # Business logic and API services
│   │   ├── dao/          # Data Access Objects
│   │   ├── imp/          # Service implementations
│   │   └── metalApi.ts   # Metal price API integration
│   ├── utils/             # Utility functions
│   └── mockData/          # Mock data for development
├── App.tsx                # Main application component
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🚀 Technologies

- **React Native** (0.71.14) - Cross-platform mobile development
- **Expo** (48.0.15) - Development platform and tools
- **TypeScript** (4.9.4) - Type-safe JavaScript
- **React Navigation** - Screen navigation and routing
- **React Native Reanimated** - Smooth animations and gestures
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **Lottie React Native** - Advanced animations
- **React Native Toast Message** - User notifications

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/anurag-026/MetalPulse.git
   cd MetalPulse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/emulator**

   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios

   # For web (experimental)
   npm run web
   ```

## 📱 Running the App

### Development Mode

- Start the Metro bundler with `npm start`
- Use Expo Go app on your device to scan the QR code
- Or press `a` for Android emulator or `i` for iOS simulator

### Building for Production

```bash
# Build Android APK
expo build:android

# Build iOS IPA
expo build:ios
```

## 🔧 Configuration

### API Configuration

The app uses mock data by default. To configure real API endpoints, update the configuration in:

- `src/config/apiConfig.ts`
- `src/services/metalApi.ts`

### Environment Variables

Create a `.env` file in the root directory for any environment-specific configurations.

## 📊 Features in Detail

### Onboarding Screens

- Smooth animated transitions between screens
- Gesture-based navigation
- Beautiful visual design with gradients

### Metal Price Tracking

- Real-time price updates for precious metals
- Price change indicators and percentages
- Historical data visualization
- Multi-currency support

### User Interface

- Responsive design for all screen sizes
- Dark/light theme support
- Smooth animations and transitions
- Intuitive navigation patterns

## 🚧 Current Limitations

### 🔴 Critical Issues

- **API Integration**: Limited real API integration, relies heavily on mock data
- **Error Handling**: Basic error handling without user-friendly messages
- **Testing**: No unit tests or automated testing implemented
- **Offline Support**: No proper offline-first architecture

### 🟡 Medium Priority

- **Authentication**: No user login/signup system
- **Charts**: No interactive charts or historical data visualization
- **Notifications**: No push notifications for price alerts
- **Code Quality**: Missing ESLint, Prettier, and comprehensive documentation

### 🟢 Future Enhancements

- **Real-time Updates**: WebSocket integration for live price updates
- **Advanced Charts**: Interactive charts with multiple timeframes
- **Web Version**: React Native Web support for cross-platform accessibility
- **Portfolio Tracking**: User portfolio management and performance tracking

## 🎯 Immediate Action Items (2-Week Sprint)

### Week 1: Foundation & Core Issues

- [ ] Implement proper error handling and user feedback
- [ ] Add input validation and data sanitization
- [ ] Set up basic testing framework (Jest + React Native Testing Library)
- [ ] Add ESLint and Prettier for code quality
- [ ] Implement proper offline support with data persistence
- [ ] Add user authentication system (basic login/signup)

### Week 2: Features & Polish

- [ ] Create portfolio tracking functionality
- [ ] Implement push notifications for price alerts
- [ ] Add interactive charts and historical data
- [ ] Implement advanced search and filtering
- [ ] Performance optimization and memory management
- [ ] Prepare for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anurag** - [GitHub Profile](https://github.com/anurag-026)

## 🙏 Acknowledgments

- React Native community for the excellent framework
- Expo team for the amazing development platform
- Contributors and testers who helped improve the app

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/anurag-026/MetalPulse/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer for urgent matters

---

**Made with ❤️ using React Native and Expo**
