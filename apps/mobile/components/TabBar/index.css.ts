import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.grey200,
    backgroundColor: colors.white,
    paddingTop: 8
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.grey500
  },
  labelFocused: {
    color: colors.blue600,
    fontWeight: '700'
  }
});
