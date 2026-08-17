import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.blue500
  },
  dark: {
    backgroundColor: colors.black
  },
  disabled: {
    backgroundColor: colors.grey300
  },
  pressed: {
    opacity: 0.7
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white
  }
});
