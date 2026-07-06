import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const commonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey100,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: colors.grey400
  },
  pillButton: {
    minHeight: 32,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: colors.blue500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  pillButtonDisabled: {
    backgroundColor: colors.grey100
  },
  pillButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700'
  },
  pillButtonTextDisabled: {
    color: colors.grey400
  },
  badge: {
    minWidth: 52,
    height: 20,
    paddingHorizontal: 9,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600'
  }
});
