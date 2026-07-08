import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  tag: {
    minHeight: 22,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.blue500,
    backgroundColor: colors.blue50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  text: {
    color: colors.blue700,
    fontSize: 10,
    fontWeight: '700'
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
