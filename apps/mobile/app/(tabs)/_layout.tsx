import { Tabs } from 'expo-router';

import { TabBar } from '@/components/TabBar';
import { TABS, tabRouteSegment } from '@/constants/tabs';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
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
