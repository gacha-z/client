import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingRight: 16
  },
  filter: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.grey200,
    borderRadius: 20,
    backgroundColor: colors.white
  },
  filterSelected: {
    borderColor: colors.blue500,
    backgroundColor: colors.blue50
  },
  label: {
    color: colors.grey500,
    fontSize: 13,
    fontWeight: '600'
  },
  labelSelected: {
    color: colors.blue600,
    fontWeight: '700'
  }
});
