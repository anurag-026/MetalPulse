import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Onboarding } from './src/screens/Onboarding';
import { Home } from './src/screens/Home';
import { MetalDetail } from './src/screens/MetalDetail';
import { NavigationProvider, useNavigation } from './src/context/NavigationContext';
import { CurrencyProvider } from './src/context/CurrencyContext';

function AppContent() {
  const { currentScreen, selectedMetal } = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen === 'onboarding' && <Onboarding />}
      {currentScreen === 'home' && <Home />}
      {currentScreen === 'metalDetail' && selectedMetal && <MetalDetail metal={selectedMetal} />}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CurrencyProvider>
          <NavigationProvider>
            <AppContent />
            <Toast />
          </NavigationProvider>
        </CurrencyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
