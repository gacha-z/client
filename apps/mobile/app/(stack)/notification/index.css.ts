import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 32
  },
  state: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24
  },
  stateTitle: {
    color: colors.grey700,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700'
  },
  stateDescription: {
    color: colors.grey500,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center'
  },
  unreadSummary: {
    color: colors.grey600,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600'
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.blue500
  },
  retryLabel: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700'
  },
  moreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 12
  },
  moreLabel: {
    color: colors.grey600,
    fontSize: 14,
    fontWeight: '700'
  }
});
