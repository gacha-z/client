import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { memo, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TABS, tabRouteSegment, type TabItem } from '@/constants/tabs';
import { styles } from './index.css';

type TabBarItemProps = {
  tab: TabItem;
  isFocused: boolean;
  routeKey: string | undefined;
  routeName: string;
  navigation: BottomTabBarProps['navigation'];
};

const isTabFocused = (tab: TabItem, focusedRouteName: string): boolean => {
  const segment = tabRouteSegment(tab.name);
  return (
    focusedRouteName === segment ||
    focusedRouteName === tab.name ||
    focusedRouteName.startsWith(`${tab.name}/`)
  );
};

/** TabBar 전용 탭 버튼 — memo, useCallback으로 포커스 변경 시 해당 탭만 리렌더 */
const TabBarItem = memo(function TabBarItem({
  tab,
  isFocused,
  routeKey,
  routeName,
  navigation
}: TabBarItemProps) {
  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  }, [isFocused, navigation, routeKey, routeName]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      style={styles.tab}
    >
      <Text style={[styles.label, isFocused && styles.labelFocused]}>{tab.label}</Text>
    </Pressable>
  );
});

/** 하단 탭 — constants/tabs.ts(TABS)에 있는 화면만 표시 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRouteName = state.routes[state.index]?.name ?? '';

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const routeName = tabRouteSegment(tab.name);
        const route = state.routes.find((r) => r.name === routeName);

        return (
          <TabBarItem
            key={tab.name}
            tab={tab}
            isFocused={isTabFocused(tab, focusedRouteName)}
            routeKey={route?.key}
            routeName={routeName}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
}
