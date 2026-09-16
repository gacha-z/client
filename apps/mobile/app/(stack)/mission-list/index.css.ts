import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingBottom: 20,
    gap: 20
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  dateArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.grey700
  },
  dateArrowDisabled: {
    color: colors.grey300
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.grey400
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
  emptyText: {
    color: colors.grey500,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 24
  },
  list: {
    gap: 16
  }
});
