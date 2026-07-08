import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.white
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 28
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.grey900
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
});
