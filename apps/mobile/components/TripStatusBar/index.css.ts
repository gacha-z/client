import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  // 좌우 패딩 없음 — 사용처(content 컨테이너)가 이미 paddingHorizontal: 20을 가짐
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1
  },
  tripName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grey900,
    flexShrink: 1
  },
  dayBadge: {
    backgroundColor: colors.blue500,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white
  }
});
