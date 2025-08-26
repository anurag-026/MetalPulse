import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isOnboardingComplete: boolean;
  currentScreen: 'onboarding' | 'home' | 'metalDetail';
  selectedMetal: any | null;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  navigateToDetail: (metal: any) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'metalDetail'>('onboarding');
  const [selectedMetal, setSelectedMetal] = useState<any | null>(null);

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
    setCurrentScreen('home');
  };

  const resetOnboarding = () => {
    setIsOnboardingComplete(false);
    setCurrentScreen('onboarding');
  };

  const navigateToDetail = (metal: any) => {
    setSelectedMetal(metal);
    setCurrentScreen('metalDetail');
  };

  const goBack = () => {
    if (currentScreen === 'metalDetail') {
      setCurrentScreen('home');
      setSelectedMetal(null);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        isOnboardingComplete,
        currentScreen,
        selectedMetal,
        completeOnboarding,
        resetOnboarding,
        navigateToDetail,
        goBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
