import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12
  },
  empty: {
    paddingVertical: 48,
    textAlign: 'center',
    color: colors.grey500,
    fontSize: 13
  }
});
