import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrency } from '../context/CurrencyContext';
import { getCurrencyInfo, getCurrencyName } from '../utils/currencyUtils';
import Toast from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8;

interface CurrencySidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

export const CurrencySidebar: React.FC<CurrencySidebarProps> = ({
  isVisible,
  onClose,
}) => {
  const { currency, setCurrency, supportedCurrencies } = useCurrency();
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleCurrencySelect = (selectedCurrency: string) => {
    const currencyInfo = getCurrencyInfo(selectedCurrency);
    const currencyName = getCurrencyName(selectedCurrency);

    setCurrency(selectedCurrency);
    onClose();

    Toast.show({
      type: 'success',
      text1: `Switched to ${currencyName} (${selectedCurrency})`,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const renderCurrencyOption = (currencyCode: string) => {
    const currencyInfo = getCurrencyInfo(currencyCode);
    const currencyName = getCurrencyName(currencyCode);
    const isSelected = currency === currencyCode;

    return (
      <TouchableOpacity
        key={currencyCode}
        style={[
          styles.currencyOption,
          isSelected && styles.selectedCurrencyOption,
        ]}
        onPress={() => handleCurrencySelect(currencyCode)}
        activeOpacity={0.7}
      >
        <View style={styles.currencyInfo}>
          <View
            style={[styles.currencyIcon, isSelected && styles.selectedIcon]}
          >
            <Text
              style={[
                styles.currencySymbol,
                isSelected && styles.selectedIconText,
              ]}
            >
              {currencyInfo?.icon || currencyCode}
            </Text>
          </View>
          <View style={styles.currencyDetails}>
            <Text
              style={[styles.currencyCode, isSelected && styles.selectedText]}
            >
              {currencyCode}
            </Text>
            <Text
              style={[
                styles.currencyName,
                isSelected && styles.selectedSubText,
              ]}
            >
              {currencyName}
            </Text>
          </View>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.backdropView} />
      </TouchableOpacity>

      {}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

        {}
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Currency</Text>
            <Text style={styles.headerSubtitle}>
              Select your preferred currency
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>

        {}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Available Currencies</Text>
          {supportedCurrencies.map(renderCurrencyOption)}
        </View>

        {}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Prices will be displayed in your selected currency
          </Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdropView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 20,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCurrencyOption: {
    backgroundColor: '#f0f8ff',
    borderColor: '#FFD700',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIcon: {
    backgroundColor: '#FFD700',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
  },
  selectedIconText: {
    color: '#1a1a2e',
  },
  currencyDetails: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  selectedText: {
    color: '#1a1a2e',
  },
  selectedSubText: {
    color: '#495057',
  },
  checkmark: {
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 18,
  },
});
