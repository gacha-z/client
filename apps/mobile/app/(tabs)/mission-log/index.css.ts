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
  state: {
    alignItems: 'center',
    paddingVertical: 48
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
