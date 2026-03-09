import { Tabs } from 'expo-router';
import { MessageSquare, Grid2x2 as Grid, ChartBar as BarChart3, Settings } from 'lucide-react-native';
import { useParentMode } from '@/contexts/ParentModeContext';

export default function TabLayout() {
  const { isParentMode } = useParentMode();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Giao tiếp',
          tabBarIcon: ({ size, color }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Quản lý thẻ',
          tabBarIcon: ({ size, color }) => (
            <Grid size={size} color={color} />
          ),
          href: isParentMode ? '/manage' : null,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Thống kê',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
          href: isParentMode ? '/statistics' : null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
          href: isParentMode ? '/settings' : null,
        }}
      />
    </Tabs>
  );
}
