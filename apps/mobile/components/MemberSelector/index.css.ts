import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14
  },
  item: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: colors.grey300,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white
  },
  itemSelected: {
    borderColor: colors.blue500,
    backgroundColor: colors.blue500
  },
  text: {
    fontSize: 18,
    color: colors.grey300
  },
  textSelected: {
    color: colors.white
  }
});
