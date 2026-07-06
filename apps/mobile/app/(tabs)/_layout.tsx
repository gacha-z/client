import { Tabs } from 'expo-router';

import { NavigationBar } from '@/components/NavigationBar';
import { TABS, tabRouteSegment } from '@/constants/tabs';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <NavigationBar {...props} />}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tabRouteSegment(tab.name)}
          options={{ title: tab.label }}
        />
      ))}
    </Tabs>
  );
}
