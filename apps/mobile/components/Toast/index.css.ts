import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  positioner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    alignItems: 'center',
    zIndex: 100,
    elevation: 10
  },
  toast: {
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100
  },
  success: {
    backgroundColor: colors.blue700
  },
  error: {
    backgroundColor: colors.grey900
  },
  message: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center'
  }
});
