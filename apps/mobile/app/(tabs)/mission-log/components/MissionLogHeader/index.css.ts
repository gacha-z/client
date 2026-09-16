import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tripSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1
  },
  tripName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grey900
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  dateArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grey700
  },
  dateArrowDisabled: {
    color: colors.grey300
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.grey600
  }
});
