import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ParentModeContextType {
  isParentMode: boolean;
  toggleMode: () => void;
}

const ParentModeContext = createContext<ParentModeContextType | undefined>(undefined);

export function ParentModeProvider({ children }: { children: React.ReactNode }) {
  const [isParentMode, setIsParentMode] = useState(false);

  useEffect(() => {
    loadMode();
  }, []);

  async function loadMode() {
    try {
      const mode = await AsyncStorage.getItem('parentMode');
      setIsParentMode(mode === 'true');
    } catch (error) {
      console.error('Error loading mode:', error);
    }
  }

  async function toggleMode() {
    try {
      const newMode = !isParentMode;
      await AsyncStorage.setItem('parentMode', String(newMode));
      setIsParentMode(newMode);
    } catch (error) {
      console.error('Error saving mode:', error);
    }
  }

  return (
    <ParentModeContext.Provider value={{ isParentMode, toggleMode }}>
      {children}
    </ParentModeContext.Provider>
  );
}

export function useParentMode() {
  const context = useContext(ParentModeContext);
  if (context === undefined) {
    throw new Error('useParentMode must be used within ParentModeProvider');
  }
  return context;
}
