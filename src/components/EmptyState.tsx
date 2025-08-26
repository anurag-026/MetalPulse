import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';

interface EmptyStateProps {
  type: 'no-data' | 'no-connection' | 'error' | 'empty-results';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  message,
  actionText,
  onAction,
  showRetry = false,
  onRetry,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'no-data':
        return <MaterialCommunityIcons name="database-off" size={80} color="#FFD700" />;
      case 'no-connection':
        return <MaterialCommunityIcons name="wifi-off" size={80} color="#FFD700" />;
      case 'error':
        return <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#F44336" />;
      case 'empty-results':
        return <MaterialCommunityIcons name="magnify" size={80} color="#FFD700" />;
      default:
        return <MaterialCommunityIcons name="help-circle-outline" size={80} color="#FFD700" />;
    }
  };

  const getBackgroundColors = () => {
    switch (type) {
      case 'error':
        return ['#1a1a2e', '#2d1b1b'];
      case 'no-connection':
        return ['#1a1a2e', '#1b2d1b'];
      default:
        return ['#1a1a2e', '#16213e'];
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getBackgroundColors()}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        {actionText && onAction && (
          <TouchableOpacity style={styles.actionButton} onPress={onAction}>
            <Text style={styles.actionButtonText}>{actionText}</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
        
        {showRetry && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <MaterialCommunityIcons name="refresh" size={20} color="#FFD700" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {type === 'no-data' && 'Try refreshing or check your connection'}
            {type === 'no-connection' && 'Check your internet connection and try again'}
            {type === 'error' && 'Something went wrong. Please try again later'}
            {type === 'empty-results' && 'No results found for your search'}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginRight: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    paddingHorizontal: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#8a8a8a',
    textAlign: 'center',
    lineHeight: 20,
  },
});
