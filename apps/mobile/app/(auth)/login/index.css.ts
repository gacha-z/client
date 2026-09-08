import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: colors.blue500
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18
  },
  brandName: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '700'
  },
  actions: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: 14,
    paddingTop: 16
  },
  loginButton: {
    position: 'relative',
    height: 58,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14
  },
  appleButton: {
    backgroundColor: colors.white
  },
  appleIcon: {
    position: 'absolute',
    left: 20,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  appleLabel: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600'
  },
  errorMessage: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center'
  },
  pressed: {
    opacity: 0.75
  }
});
