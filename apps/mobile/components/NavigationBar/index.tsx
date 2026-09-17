import type { BottomTabBarProps } from 'expo-router/tabs';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
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
import { Toast } from '@/components/Toast';
import { TABS, tabRouteSegment, type TabItem } from '@/constants/tabs';
import { useActiveTrip } from '@/hooks';

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
  const { tripId: activeTripId, isPending: isActiveTripPending } = useActiveTrip();
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [noActiveTripToastVisible, setNoActiveTripToastVisible] = useState(false);

  const canVerifyMission = missionPending && Boolean(activeTripId);

  useEffect(() => {
    Animated.spring(floatAnim, {
      toValue: isFocused ? -8 : 0,
      useNativeDriver: true,
      tension: 180,
      friction: 8
    }).start();
  }, [isFocused, floatAnim]);

  const onPress = useCallback(() => {
    if (canVerifyMission && isFocused) {
      router.push({ pathname: '/mission-log-capture', params: { tripId: activeTripId } });
      return;
    }
    if (!activeTripId && !isActiveTripPending) {
      setNoActiveTripToastVisible(true);
      return;
    }
    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName, activeTripId ? { tripId: activeTripId } : undefined);
    }
  }, [
    canVerifyMission,
    router,
    isFocused,
    activeTripId,
    isActiveTripPending,
    navigation,
    routeKey,
    routeName
  ]);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={styles.centerTab}
      >
        <Animated.View style={[styles.fabRing, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.fab}>
            {canVerifyMission && isFocused ? <CameraIcon size={30} /> : <CardsIcon size={30} />}
          </View>
        </Animated.View>
      </Pressable>
      <Toast
        visible={noActiveTripToastVisible}
        message="진행 중인 여행이 없어요. 여행을 먼저 만들거나 참여해보세요."
        variant="error"
        onDismiss={() => setNoActiveTripToastVisible(false)}
      />
    </>
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
          return (
            <NavigationBarCenter
              key={tab.name}
              isFocused={itemProps.isFocused}
              routeKey={itemProps.routeKey}
              routeName={itemProps.routeName}
              navigation={itemProps.navigation}
            />
          );
        }
        return <NavigationBarItem key={tab.name} {...itemProps} />;
      })}
    </View>
  );
}
