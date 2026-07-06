import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  summaryBox: {
    flex: 1,
    height: 53,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.blue500,
    backgroundColor: colors.white,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summaryLabel: {
    color: colors.blue500,
    fontSize: 13,
    fontWeight: '700'
  },
  summaryValue: {
    color: colors.blue500,
    fontSize: 16,
    fontWeight: '800'
  }
});
