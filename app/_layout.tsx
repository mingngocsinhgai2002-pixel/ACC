import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ParentModeProvider } from '@/contexts/ParentModeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ParentModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ParentModeProvider>
  );
}
