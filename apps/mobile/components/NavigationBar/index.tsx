import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAtomValue } from 'jotai';
import { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { missionPendingAtom } from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import {
  CameraIcon,
  CardsIcon,
  CollectionIcon,
  HomeIcon,
  MissionLogIcon,
  TravelIcon
} from '@/components/icons';
import { TABS, tabRouteSegment, type TabItem } from '@/constants/tabs';

import { styles } from './index.css';

function TabIcon({ name, color }: { name: TabItem['name']; color: string }) {
  switch (name) {
    case 'index':
      return <HomeIcon color={color} />;
    case 'travel':
      return <TravelIcon color={color} />;
    case 'collection':
      return <CollectionIcon color={color} />;
    case 'mission-log':
      return <MissionLogIcon color={color} />;
    default:
      return null;
  }
}

type TabItemProps = {
  tab: TabItem;
  isFocused: boolean;
  routeKey: string | undefined;
  routeName: string;
  navigation: BottomTabBarProps['navigation'];
};

type CenterTabProps = Omit<TabItemProps, 'tab'>;

const NavigationBarItem = memo(function NavigationBarItem({
  tab,
  isFocused,
  routeKey,
  routeName,
  navigation
}: TabItemProps) {
  const color = isFocused ? colors.blue500 : colors.grey400;

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
      <TabIcon name={tab.name} color={color} />
      <Text style={[styles.label, isFocused && styles.labelFocused]}>{tab.label}</Text>
    </Pressable>
  );
});

const NavigationBarCenter = memo(function NavigationBarCenter({
  isFocused,
  routeKey,
  routeName,
  navigation
}: CenterTabProps) {
  const missionPending = useAtomValue(missionPendingAtom);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(floatAnim, {
      toValue: isFocused ? -8 : 0,
      useNativeDriver: true,
      tension: 180,
      friction: 8
    }).start();
  }, [isFocused, floatAnim]);

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
      style={styles.centerTab}
    >
      <Animated.View style={[styles.fabRing, { transform: [{ translateY: floatAnim }] }]}>
        <View style={styles.fab}>
          {missionPending ? <CameraIcon size={30} /> : <CardsIcon size={30} />}
        </View>
      </Animated.View>
    </Pressable>
  );
});

/** 하단 네비게이션 바 */
export function NavigationBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRouteName = state.routes[state.index]?.name ?? '';

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const routeName = tabRouteSegment(tab.name);
        const route = state.routes.find((r) => r.name === routeName);
        const isFocused = focusedRouteName === routeName;
        const itemProps = {
          tab,
          isFocused,
          routeKey: route?.key,
          routeName,
          navigation
        };

        if (tab.isCenter) {
          const { tab: _tab, ...centerProps } = itemProps;
          return <NavigationBarCenter key={tab.name} {...centerProps} />;
        }
        return <NavigationBarItem key={tab.name} {...itemProps} />;
      })}
    </View>
  );
}
