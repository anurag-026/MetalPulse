import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style 
}) => {
  const shimmerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: SCREEN_WIDTH,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerStyle = {
    transform: [{ translateX: shimmerAnim }],
  };

  return (
    <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  );
};

// Predefined skeleton components for common use cases
export const SkeletonCard: React.FC = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonCardHeader}>
      <Skeleton width={60} height={60} borderRadius={30} />
      <View style={styles.skeletonCardText}>
        <Skeleton width={80} height={18} />
        <Skeleton width={40} height={14} />
      </View>
      <Skeleton width={70} height={24} borderRadius={12} />
    </View>
    <View style={styles.skeletonCardContent}>
      <Skeleton width={120} height={32} />
      <View style={styles.skeletonCardRow}>
        <View style={styles.skeletonCardColumn}>
          <Skeleton width={60} height={12} />
          <Skeleton width={80} height={16} />
          <Skeleton width={70} height={14} />
        </View>
        <View style={styles.skeletonCardColumn}>
          <Skeleton width={60} height={12} />
          <Skeleton width={80} height={16} />
        </View>
      </View>
    </View>
  </View>
);

export const SkeletonDetailHeader: React.FC = () => (
  <View style={styles.skeletonDetailHeader}>
    <View style={styles.skeletonDetailTop}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.skeletonDetailTitle}>
        <Skeleton width={120} height={28} />
        <Skeleton width={60} height={18} />
      </View>
      <View style={styles.skeletonDetailActions}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <Skeleton width={48} height={48} borderRadius={24} />
      </View>
    </View>
    <View style={styles.skeletonDetailPrice}>
      <Skeleton width={100} height={16} />
      <Skeleton width={200} height={42} />
      <Skeleton width={120} height={14} />
    </View>
  </View>
);

export const SkeletonSection: React.FC = () => (
  <View style={styles.skeletonSection}>
    <Skeleton width={140} height={22} />
    <View style={styles.skeletonSectionContent}>
      <Skeleton width="100%" height={60} />
      <Skeleton width="100%" height={60} />
      <Skeleton width="100%" height={60} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: SCREEN_WIDTH,
  },
  skeletonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  skeletonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonCardText: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  skeletonCardContent: {
    alignItems: 'center',
    gap: 15,
  },
  skeletonCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  skeletonCardColumn: {
    alignItems: 'flex-start',
    gap: 8,
  },
  skeletonDetailHeader: {
    backgroundColor: '#1a1a2e',
    borderRadius: 30,
    padding: 20,
    paddingTop: 50,
    minHeight: 280,
  },
  skeletonDetailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  skeletonDetailTitle: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  skeletonDetailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonDetailPrice: {
    alignItems: 'center',
    gap: 12,
  },
  skeletonSection: {
    backgroundColor: '#ffffff',
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
  skeletonSectionContent: {
    marginTop: 24,
    gap: 16,
  },
});
