import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  list: {
    gap: 20
  },
  state: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 48
  },
  stateTitle: {
    color: colors.grey700,
    fontSize: 16,
    fontWeight: '700'
  },
  stateDescription: {
    color: colors.grey500,
    fontSize: 14,
    textAlign: 'center'
  },
  retryButton: {
    borderRadius: 999,
    backgroundColor: colors.blue500,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  retryLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700'
  },
  moreButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey300,
    paddingVertical: 12
  },
  moreLabel: {
    color: colors.grey600,
    fontSize: 14,
    fontWeight: '700'
  }
});
