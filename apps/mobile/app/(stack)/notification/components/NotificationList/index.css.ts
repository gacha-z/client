import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  list: {
    gap: 16
  },
  empty: {
    flex: 1,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  emptyTitle: {
    color: colors.grey700,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700'
  },
  emptyDescription: {
    color: colors.grey400,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center'
  }
});
