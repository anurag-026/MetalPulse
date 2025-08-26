import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';
import { useCurrency } from '../context/CurrencyContext';
import { getCurrencyIcon } from '../utils/currencyUtils';
import { useNavigation } from '../context/NavigationContext';
import { 
  fetchAllMetalPrices, 
  fetchMetalPrice, 
  checkAPIStatus,
  type MetalPriceData,
  type ApiResponse 
} from '../services/metalApi';
import { 
  generateMockMetalPrice,
  MOCK_METAL_INFO,
  getSupportedMetalIds
} from '../mockData/metalData';
import Toast from 'react-native-toast-message';
import { CurrencySidebar } from '../components/CurrencySidebar';

import { EmptyState } from '../components/EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MetalPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  color: string;
  gradientColors: string[];
  icon: string;
  timestamp: Date;
  bid?: number;
  ask?: number;
  high?: number;
  low?: number;
  open?: number;
  prevClose?: number;
}

const metals: MetalPrice[] = getSupportedMetalIds().map(metalId => {
  const metalInfo = MOCK_METAL_INFO[metalId as keyof typeof MOCK_METAL_INFO];
  return {
    id: metalId,
    name: metalInfo.name,
    symbol: metalInfo.symbol,
    price: 0,
    change: 0,
    changePercent: 0,
    unit: 'per oz',
    color: metalInfo.color,
    gradientColors: metalInfo.gradientColors,
    icon: metalInfo.icon,
    timestamp: new Date(),
  };
});



const MetalCard = ({ metal, isLoading }: { metal: MetalPrice; isLoading: boolean }) => {
  const navigation = useNavigation();
  const { currency } = useCurrency();
  const cardScale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const cardRotation = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    cardScale.value = withSpring(1, { damping: 15 });
    cardRotation.value = withSpring(0, { damping: 20 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardScale.value },
      { rotate: `${cardRotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const handleCardPress = () => {
    navigation.navigateToDetail(metal);
  };

  const formatPrice = (price: number) => {
    const symbol = getCurrencyIcon(currency);
    return `${symbol}${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(change)}`;
  };

  const formatChangePercent = (changePercent: number) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  return (
    <Pressable onPress={handleCardPress}>
      <Animated.View style={[styles.metalCard, animatedStyle]}>
        <LinearGradient
          colors={metal.gradientColors}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >


        <View style={styles.cardHeader}>
          <View style={styles.metalInfo}>
            <View style={[styles.metalIconContainer, { backgroundColor: `${metal.color}20` }]}>
              <MaterialCommunityIcons name={metal.icon as any} size={24} color={metal.color} />
            </View>
            <View style={styles.metalText}>
              <Text style={styles.metalName}>{metal.name}</Text>
              <Text style={styles.metalSymbol}>{metal.symbol}</Text>
            </View>
          </View>
          <View style={styles.unitContainer}>
            <Text style={styles.unitText}>24K {metal.unit}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
                  {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
            <>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.priceText}>{formatPrice(metal.price)}</Text>
              
              {/* Price Change and Timestamp Row */}
              <View style={styles.priceInfoRow}>
                <View style={styles.changeContainer}>
                  <Text style={styles.changeLabel}>Daily Change</Text>
                  <Text
                    style={[
                      styles.changeText,
                      { color: metal.change >= 0 ? '#4CAF50' : '#F44336' },
                    ]}
                  >
                    {formatChange(metal.change)}
                  </Text>
                  <Text
                    style={[
                      styles.changePercentText,
                      { color: metal.changePercent >= 0 ? '#4CAF50' : '#F44336' },
                    ]}
                  >
                    {formatChangePercent(metal.changePercent)}
                  </Text>
                </View>
                
                {/* Timestamp - Right side */}
                <View style={styles.timestampContainer}>
                  <Text style={styles.timestampLabel}>Last Updated</Text>
                  <Text style={styles.timestampText}>
                    {metal.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Decorative Elements */}
        <View style={styles.cardDecoration}>
          <View style={[styles.decorationDot, { backgroundColor: metal.color }]} />
          <View style={[styles.decorationDot, { backgroundColor: metal.color, opacity: 0.6 }]} />
          <View style={[styles.decorationDot, { backgroundColor: metal.color, opacity: 0.3 }]} />
        </View>
      </LinearGradient>
    </Animated.View>
    </Pressable>
  );
};

export function Home() {
  const { resetOnboarding } = useNavigation();
  const { currency } = useCurrency();
  const { top } = useSafeAreaInsets();

  const [metalPrices, setMetalPrices] = useState<MetalPrice[]>(metals);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({
    gold: true,
    silver: true,
    platinum: true,
    palladium: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [apiStatus, setApiStatus] = useState<{ [key: string]: boolean }>({});
  const [useMockData, setUseMockData] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [hasAnyData, setHasAnyData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Check API status on component mount
  useEffect(() => {
    checkAPIStatusOnMount();
  }, []);

  const checkAPIStatusOnMount = async () => {
    try {
      const status = await checkAPIStatus();
      setApiStatus(status);
      
      // If both APIs are down, switch to mock data
      if (!status.GoldAPI && !status['Metals.dev']) {
        setUseMockData(true);
        Toast.show({
          type: 'error',
          text1: 'All APIs unavailable. Using mock data.',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      setUseMockData(true);
      Toast.show({
        type: 'error',
        text1: 'Failed to check API status. Using mock data.',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  // Fetch metal price using real API or fallback to mock
  const fetchMetalPriceData = async (metalId: string): Promise<MetalPrice> => {
    if (useMockData) {
      // Use mock data if APIs are unavailable
      const mockData = generateMockMetalPrice(metalId);
      return {
        ...metals.find(m => m.id === metalId)!,
        ...mockData,
        color: metals.find(m => m.id === metalId)!.color,
        gradientColors: metals.find(m => m.id === metalId)!.gradientColors,
        icon: metals.find(m => m.id === metalId)!.icon,
      };
    }

    try {
      const response: ApiResponse = await fetchMetalPrice(metalId, currency);
      
      if (response.success && response.data) {
        const metal = metals.find(m => m.id === metalId)!;
        // Show success toast for successful API calls
        // if (!useMockData) {
        //   Toast.show({
        //     type: 'success',
        //     text1: 'Data Updated',
        //     text2: `${metal.name} price updated successfully`,
        //     position: 'top',
        //     visibilityTime: 2000,
        //   });
        // }
        return {
          ...metal,
          ...response.data,
          color: metal.color,
          gradientColors: metal.gradientColors,
          icon: metal.icon,
        };
      } else {
        // If API fails, fallback to mock data
        console.warn(`API failed for ${metalId}:`, response.error);
        if (response.error?.includes('429') || response.error?.toLowerCase().includes('throttl')) {
          Toast.show({
            type: 'error',
            text1: 'Rate limit reached. Switching to mock data temporarily.',
            position: 'top',
            visibilityTime: 4000,
          });
          
        } else {
          Toast.show({
            type: 'error',
            text1: `${metalId} price unavailable. Showing mock data.`,
            position: 'top',
            visibilityTime: 4000,
          });
        }
        const mockData = generateMockMetalPrice(metalId);
        return {
          ...metals.find(m => m.id === metalId)!,
          ...mockData,
          color: metals.find(m => m.id === metalId)!.color,
          gradientColors: metals.find(m => m.id === metalId)!.gradientColors,
          icon: metals.find(m => m.id === metalId)!.icon,
        };
      }
    } catch (error) {
      console.error(`Error fetching ${metalId} price:`, error);
      Toast.show({
        type: 'error',
        text1: `Error fetching ${metalId} price. Using mock data.`,
        position: 'top',
        visibilityTime: 4000,
      });
      // Fallback to mock data on error
      const mockData = generateMockMetalPrice(metalId);
      return {
        ...metals.find(m => m.id === metalId)!,
        ...mockData,
        color: metals.find(m => m.id === metalId)!.color,
        gradientColors: metals.find(m => m.id === metalId)!.gradientColors,
        icon: metals.find(m => m.id === metalId)!.icon,
      };
    }
  };

  const loadAllPrices = async () => {
    setLastUpdated(new Date());
    setDataError(null);
    
    let successCount = 0;
    let totalMetals = metals.length;
    
    // Load each metal price individually
    for (const metal of metals) {
      try {
        const priceData = await fetchMetalPriceData(metal.id);
        setMetalPrices(prev => 
          prev.map(m => 
            m.id === metal.id 
              ? { ...m, ...priceData }
              : m
          )
        );
        setLoadingStates(prev => ({ ...prev, [metal.id]: false }));
        
        // Check if we got valid data (price > 0)
        if (priceData.price > 0) {
          successCount++;
        }
      } catch (error) {
        console.error(`Error fetching ${metal.name} price:`, error);
        setLoadingStates(prev => ({ ...prev, [metal.id]: false }));
      }
    }
    
    // Update data availability state
    setHasAnyData(successCount > 0);
    
    // If no data at all, set error message
    if (successCount === 0) {
      setDataError('No market data available');
    }
  };

  useEffect(() => {
    loadAllPrices();
  }, [useMockData, currency]);

  const onRefresh = async () => {
    setRefreshing(true);
    setLoadingStates({
      gold: true,
      silver: true,
      platinum: true,
      palladium: true,
    });
    await loadAllPrices();
    setRefreshing(false);
    
    // Show refresh completion toast
    Toast.show({
      type: 'success',
      text1: 'Market prices updated successfully',
      position: 'top',
      visibilityTime: 2000,
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Precious Metals</Text>
            <Text style={styles.headerSubtitle}>Live Market Prices (24 Carat)</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setIsSidebarVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color="#FFD700" />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <Ionicons name="trending-up" size={32} color="#FFD700" />
            </View>
          </View>
        </View>
        
        <View style={styles.lastUpdatedContainer}>
          <Ionicons name="time-outline" size={16} color="#8a8a8a" />
          <Text style={styles.lastUpdatedText}>
            Last updated: {formatTimestamp(lastUpdated)}
          </Text>
          
          {/* Currency Indicator */}
          <TouchableOpacity 
            style={styles.currencyIndicator}
            onPress={() => setIsSidebarVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.currencySymbol}>{getCurrencyIcon(currency)}</Text>
            <Text style={styles.currencyCode}>{currency}</Text>
          </TouchableOpacity>
          
          {/* API Status Indicator */}
          <View style={styles.apiStatusContainer}>
            {Object.keys(apiStatus).length > 0 && (
              <>
                <View style={[styles.apiStatusDot, { backgroundColor: apiStatus.GoldAPI ? '#4CAF50' : '#F44336' }]} />
                <Text style={styles.apiStatusText}>
                  {useMockData ? 'Mock Data' : 'Live Data'}
                </Text>
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      {!hasAnyData && dataError ? (
        <EmptyState
          type="no-data"
          title="No Market Data Available"
          message="We couldn't fetch any market data from our sources. This could be due to network issues, API unavailability, or temporary service disruptions."
          actionText="Try Again"
          onAction={onRefresh}
          showRetry={true}
          onRetry={onRefresh}
        />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFD700"
              colors={['#FFD700']}
            />
          }
          showsVerticalScrollIndicator={false}
        >
        {/* Market Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Market Overview</Text>
            <View style={styles.summaryIcon}>
              <Ionicons name="analytics-outline" size={20} color="#FFD700" />
            </View>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.summaryStatValue}>
                {metalPrices.filter(m => !loadingStates[m.id]).length}
              </Text>
              <Text style={styles.summaryStatLabel}>Active</Text>
            </View>
            <View style={styles.summaryStat}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.summaryStatValue}>
                {metalPrices.filter(m => m.change > 0 && !loadingStates[m.id]).length}
              </Text>
              <Text style={styles.summaryStatLabel}>Gaining</Text>
            </View>
            <View style={styles.summaryStat}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(244, 67, 54, 0.2)' }]}>
                <Ionicons name="trending-down" size={20} color="#F44336" />
              </View>
              <Text style={styles.summaryStatValue}>
                {metalPrices.filter(m => m.change < 0 && !loadingStates[m.id]).length}
              </Text>
              <Text style={styles.summaryStatLabel}>Declining</Text>
            </View>
          </View>
          
          {/* Market Trend Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>24h Trend</Text>
            <View style={styles.chartBars}>
              {metalPrices.map((metal, index) => (
                <View key={metal.id} style={styles.chartBarContainer}>
                  <View style={styles.chartBar}>
                                      {loadingStates[metal.id] ? (
                    <View style={styles.chartBar}>
                      <View style={[styles.chartBarFill, { height: '20%', backgroundColor: '#e9ecef' }]} />
                    </View>
                  ) : (
                      <View
                        style={[
                          styles.chartBarFill,
                          {
                            height: `${Math.min(Math.max(Math.abs(metal.changePercent) * 2, 10), 70)}%`,
                            backgroundColor: metal.change >= 0 ? '#4CAF50' : '#F44336',
                          },
                        ]}
                      />
                    )}
                  </View>
                  <Text style={styles.chartBarLabel}>{metal.symbol}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.chartSubtitle}>
              {loadingStates.gold || loadingStates.silver || loadingStates.platinum || loadingStates.palladium
                ? 'Loading market data...'
                : 'Percentage change over 24 hours'
              }
            </Text>
          </View>
        </View>

        {/* Metal Cards */}
        <View style={styles.metalsContainer}>
          {metalPrices.map((metal) => (
            <MetalCard
              key={metal.id}
              metal={metal}
              isLoading={loadingStates[metal.id]}
            />
          ))}
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Prices are updated every 30 seconds
          </Text>
          <Text style={styles.footerText}>
            All prices shown are for 24 Carat purity
          </Text>
          <Text style={styles.footerText}>
            Data sourced from live market feeds
          </Text>
        </View>
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={onRefresh}
      >
        <Ionicons name="refresh-outline" size={24} color="#ffffff" />
      </Pressable>

      {/* Currency Sidebar */}
      <CurrencySidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b0b0b0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastUpdatedText: {
    color: '#8a8a8a',
    fontSize: 14,
    marginLeft: 8,
  },
  currencyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginRight: 4,
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFD700',
  },
  apiStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  apiStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  apiStatusText: {
    color: '#8a8a8a',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  summaryStatLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  metalsContainer: {
    gap: 16,
  },
  metalCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 2,
  },
  cardGradient: {
    padding: 24,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metalIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  metalText: {
    marginLeft: 12,
  },
  metalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  metalSymbol: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  unitContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unitText: {
    fontSize: 12,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    width: '100%',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  priceLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  changeContainer: {
    alignItems: 'flex-start',
  },
  changeLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 15,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  changePercentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestampContainer: {
    alignItems: 'flex-end',
  },
  timestampLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'right',
  },

  cardDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  decorationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  chartContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    paddingBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 25,
    textAlign: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 10,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: 40,
    height: 80,
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: '100%',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 6,
  },

  chartBarLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
