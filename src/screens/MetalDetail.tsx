import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '../context/NavigationContext';
import { useCurrency } from '../context/CurrencyContext';
import { getCurrencyIcon } from '../utils/currencyUtils';
import { fetchMetalPrice, type MetalPriceData } from '../services/metalApi';
import {
  generateMockMetalPrice,
  getChartTimeframes,
  getMetalUnits,
  getCaratOptions,
} from '../mockData/metalData';
import Toast from 'react-native-toast-message';

import { EmptyState } from '../components/EmptyState';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MetalDetailProps {
  metal: {
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
  };
}

export function MetalDetail({ metal }: MetalDetailProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const { currency } = useCurrency();
  const [selectedUnit, setSelectedUnit] = useState('oz');
  const [selectedCarat, setSelectedCarat] = useState(24);
  const [showCaratDropdown, setShowCaratDropdown] = useState(false);
  const [liveData, setLiveData] = useState<MetalPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const timeframes = getChartTimeframes();
  const units = getMetalUnits();

  const caratOptions = getCaratOptions();

  useEffect(() => {
    fetchLiveData();
  }, [currency]);

  const fetchLiveData = async () => {
    setIsLoading(true);
    setDataError(null);
    try {
      const response = await fetchMetalPrice(metal.id, currency);
      if (response.success && response.data) {
        setLiveData(response.data);
        setHasData(true);
      } else {
        if (
          response.error?.includes('429') ||
          response.error?.toLowerCase().includes('throttl')
        ) {
          Toast.show({
            type: 'error',
            text1: 'Rate limit reached. Showing cached/mock data.',
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (response.error?.toLowerCase().includes('no data')) {
          Toast.show({
            type: 'error',
            text1: 'No data available for this pair/date.',
            position: 'top',
            visibilityTime: 4000,
          });
        } else if (response.error) {
          setDataError(response.error);
          setHasData(false);
          Toast.show({
            type: 'error',
            text1: response.error,
            position: 'top',
            visibilityTime: 4000,
          });
        }
        const mockData = generateMockMetalPrice(metal.id);
        setLiveData(mockData);
      }
    } catch (error) {
      console.error('Error fetching live data:', error);
      setDataError('Failed to fetch data');
      setHasData(false);

      Toast.show({
        type: 'error',
        text1: 'Error retrieving live data. Showing mock data.',
        position: 'top',
        visibilityTime: 4000,
      });
      const mockData = generateMockMetalPrice(metal.id);
      setLiveData(mockData);
      setHasData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getCaratPrice = (carat: number) => {
    const caratOption = caratOptions.find(option => option.value === carat);
    if (caratOption) {
      const currentPrice = liveData?.price || metal.price;
      return (currentPrice / 31.1035) * caratOption.purity;
    }
    return (liveData?.price || metal.price) / 31.1035;
  };

  const currentMetal = liveData
    ? {
        ...metal,
        price: liveData.price,
        change: liveData.change,
        changePercent: liveData.changePercent,
        timestamp: liveData.timestamp,
        bid: liveData.bid,
        ask: liveData.ask,
        high: liveData.high,
        low: liveData.low,
        open: liveData.open,
        prevClose: liveData.prevClose,
      }
    : metal;

  const marketData = {
    prevClose:
      currentMetal.prevClose || currentMetal.price - currentMetal.change,
    prevOpen:
      currentMetal.open || currentMetal.price - currentMetal.change * 0.8,
    high: currentMetal.high || currentMetal.price + currentMetal.change * 1.2,
    low: currentMetal.low || currentMetal.price - currentMetal.change * 0.8,
    volume: '2.5M',
    marketCap: '$12.5T',
    volatility: 'Medium',
    yearlyReturn: '+15.2%',
    allTimeHigh: currentMetal.price * 1.3,
    allTimeLow: currentMetal.price * 0.7,
    bid: currentMetal.bid || currentMetal.price - 0.5,
    ask: currentMetal.ask || currentMetal.price + 0.5,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(change)}`;
  };

  const formatChangePercent = (changePercent: number) => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const handleRefresh = async () => {
    await fetchLiveData();
  };

  // Show empty state if no data available
  if (!hasData && dataError && !isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <EmptyState
          type="no-data"
          title={`No Data for ${metal.name}`}
          message={`We couldn't fetch any data for ${metal.name}. This could be due to network issues, API unavailability, or the metal not being available in the selected currency.`}
          actionText="Try Again"
          onAction={handleRefresh}
          showRetry={true}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {}
      {isLoading ? (
        <View style={styles.loadingHeader}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.header}>
          <LinearGradient
            colors={metal.gradientColors}
            style={styles.headerGradient}
          >
            {}
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{metal.name}</Text>
                <Text style={styles.headerSymbol}>{metal.symbol}</Text>
              </View>

              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.refreshButton,
                  isLoading && styles.refreshButtonLoading,
                ]}
                onPress={handleRefresh}
                disabled={isLoading}
              >
                <Ionicons
                  name={isLoading ? 'sync' : 'refresh-outline'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {}
            <View style={styles.priceDisplay}>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.priceValue}>
                {formatPrice(currentMetal.price)}
              </Text>

              {}
              <Text style={styles.timestamp}>
                {currentMetal.timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}

      {}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>Loading market data...</Text>
          </View>
        ) : (
          <>
            {}
            {}

            {}
            <View style={styles.priceChangeSection}>
              <View style={styles.priceChangeHeader}>
                <Text style={styles.priceChangeTitle}>Price Change</Text>
                <Text style={styles.priceChangeTime}>Today</Text>
              </View>
              <View style={styles.priceChangeContent}>
                <View style={styles.priceChangeMain}>
                  <Ionicons
                    name={
                      currentMetal.change >= 0 ? 'trending-up' : 'trending-down'
                    }
                    size={20}
                    color={currentMetal.change >= 0 ? '#4CAF50' : '#F44336'}
                  />
                  <Text
                    style={[
                      styles.priceChangeValue,
                      {
                        color: currentMetal.change >= 0 ? '#4CAF50' : '#F44336',
                      },
                    ]}
                  >
                    {formatChange(currentMetal.change)}
                  </Text>
                  <Text
                    style={[
                      styles.priceChangePercent,
                      {
                        color: currentMetal.change >= 0 ? '#4CAF50' : '#F44336',
                      },
                    ]}
                  >
                    {formatChangePercent(currentMetal.changePercent)}
                  </Text>
                </View>
              </View>
            </View>

            {}
            <View style={styles.caratSection}>
              <Text style={styles.sectionTitle}>Carat Pricing (per gram)</Text>
              <View style={styles.caratContent}>
                <View style={styles.caratDropdown}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowCaratDropdown(!showCaratDropdown)}
                  >
                    <Text style={styles.dropdownButtonText}>
                      {selectedCarat}K
                    </Text>
                    <Ionicons
                      name={showCaratDropdown ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#666"
                    />
                  </TouchableOpacity>
                  {showCaratDropdown && (
                    <View style={styles.dropdownMenu}>
                      <View style={styles.dropdownScrollContainer}>
                        {caratOptions.map(carat => (
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedCarat(carat.value);
                              setShowCaratDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>
                              {carat.value}K
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
                <View style={styles.caratPriceDisplay}>
                  <Text style={styles.caratPriceLabel}>Price per gram</Text>
                  <Text style={styles.caratPriceValue}>
                    {formatPrice(getCaratPrice(selectedCarat))}
                  </Text>
                </View>
              </View>
            </View>

            {}
            <View style={styles.chartSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Price Chart</Text>
                <View style={styles.timeframeButtons}>
                  {timeframes.map(timeframe => (
                    <TouchableOpacity
                      style={[
                        styles.timeframeButton,
                        selectedTimeframe === timeframe &&
                          styles.timeframeButtonActive,
                      ]}
                      onPress={() => setSelectedTimeframe(timeframe)}
                    >
                      <Text
                        style={[
                          styles.timeframeButtonText,
                          selectedTimeframe === timeframe &&
                            styles.timeframeButtonTextActive,
                        ]}
                      >
                        {timeframe}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {}
              <View style={styles.chartContainer}>
                <View style={styles.chartPlaceholder}>
                  <Ionicons
                    name="analytics-outline"
                    size={48}
                    color="#FFD700"
                  />
                  <Text style={styles.chartPlaceholderText}>
                    Interactive Chart
                  </Text>
                  <Text style={styles.chartPlaceholderSubtext}>
                    {selectedTimeframe} timeframe selected
                  </Text>
                </View>
              </View>

              {}
              <View style={styles.chartStats}>
                <View style={styles.chartStat}>
                  <Text style={styles.chartStatLabel}>High</Text>
                  <Text style={styles.chartStatValue}>
                    {formatPrice(marketData.high)}
                  </Text>
                </View>
                <View style={styles.chartStat}>
                  <Text style={styles.chartStatLabel}>Low</Text>
                  <Text style={styles.chartStatValue}>
                    {formatPrice(marketData.low)}
                  </Text>
                </View>
                <View style={styles.chartStat}>
                  <Text style={styles.chartStatLabel}>Volume</Text>
                  <Text style={styles.chartStatValue}>{marketData.volume}</Text>
                </View>
              </View>
            </View>

            {}
            <View style={styles.marketDataSection}>
              <Text style={styles.sectionTitle}>Market Data</Text>
              <View style={styles.marketDataGrid}>
                <View style={styles.marketDataItem}>
                  <Text style={styles.marketDataLabel}>Previous Close</Text>
                  <Text style={styles.marketDataValue}>
                    {formatPrice(marketData.prevClose)}
                  </Text>
                </View>
                <View style={styles.marketDataItem}>
                  <Text style={styles.marketDataLabel}>Previous Open</Text>
                  <Text style={styles.marketDataValue}>
                    {formatPrice(marketData.prevOpen)}
                  </Text>
                </View>
                <View style={styles.marketDataItem}>
                  <Text style={styles.marketDataLabel}>Bid</Text>
                  <Text style={styles.marketDataValue}>
                    {formatPrice(marketData.bid)}
                  </Text>
                </View>
                <View style={styles.marketDataItem}>
                  <Text style={styles.marketDataLabel}>Ask</Text>
                  <Text style={styles.marketDataValue}>
                    {formatPrice(marketData.ask)}
                  </Text>
                </View>
                <View style={styles.marketDataItem}>
                  <Text style={styles.marketDataLabel}>Market Cap</Text>
                  <Text style={styles.marketDataValue}>
                    {marketData.marketCap}
                  </Text>
                </View>
                <View style={styles.marketDataItem}>
                  <Text style={styles.marketDataLabel}>Volatility</Text>
                  <Text style={styles.marketDataValue}>
                    {marketData.volatility}
                  </Text>
                </View>
              </View>
            </View>

            {}
            <View style={styles.performanceSection}>
              <Text style={styles.sectionTitle}>Performance & Insights</Text>
              <View style={styles.performanceGrid}>
                <View style={styles.performanceItem}>
                  <View style={styles.performanceIcon}>
                    <Ionicons name="trending-up" size={20} color="#4CAF50" />
                  </View>
                  <View style={styles.performanceContent}>
                    <Text style={styles.performanceLabel}>Yearly Return</Text>
                    <Text
                      style={[styles.performanceValue, { color: '#4CAF50' }]}
                    >
                      {marketData.yearlyReturn}
                    </Text>
                  </View>
                </View>
                <View style={styles.performanceItem}>
                  <View style={styles.performanceIcon}>
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                  </View>
                  <View style={styles.performanceContent}>
                    <Text style={styles.performanceLabel}>All-Time High</Text>
                    <Text style={styles.performanceValue}>
                      {formatPrice(marketData.allTimeHigh)}
                    </Text>
                  </View>
                </View>
                <View style={styles.performanceItem}>
                  <View style={styles.performanceIcon}>
                    <Ionicons name="trending-down" size={20} color="#F44336" />
                  </View>
                  <View style={styles.performanceContent}>
                    <Text style={styles.performanceLabel}>All-Time Low</Text>
                    <Text style={styles.performanceValue}>
                      {formatPrice(marketData.allTimeLow)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 280,
  },
  headerGradient: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSymbol: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  refreshButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginLeft: 12,
  },
  refreshButtonLoading: {
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  priceDisplay: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },

  timestamp: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    marginTop: 280,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 50,
  },
  toggleContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  toggleGroup: {
    marginBottom: 24,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 26,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    minWidth: 65,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  chartSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  timeframeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 50,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  timeframeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  timeframeButtonTextActive: {
    color: '#1a1a2e',
    fontWeight: '700',
  },
  chartContainer: {
    height: 220,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  chartPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
    marginTop: 16,
    textAlign: 'center',
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  chartStat: {
    alignItems: 'center',
    flex: 1,
  },
  chartStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  chartStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  marketDataSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  marketDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  marketDataItem: {
    width: '48%',
    minHeight: 70,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 16,
  },
  marketDataLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  marketDataValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  performanceSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  performanceGrid: {
    gap: 20,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  performanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  performanceContent: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  priceChangeSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  priceChangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceChangeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  priceChangeTime: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priceChangeContent: {
    alignItems: 'center',
  },
  priceChangeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  priceChangeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 8,
  },
  priceChangePercent: {
    fontSize: 18,
    fontWeight: '600',
  },
  caratSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 99999,
  },
  caratContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  caratDropdown: {
    position: 'relative',
    zIndex: 99999,
    flex: 1,
    marginRight: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 80,
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 4,
    zIndex: 99999,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownScrollContainer: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a2e',
    textAlign: 'left',
  },

  caratPriceDisplay: {
    alignItems: 'flex-end',
    flex: 1,
  },
  caratPriceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  caratPriceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  loadingHeader: {
    height: 200,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
  },
});
