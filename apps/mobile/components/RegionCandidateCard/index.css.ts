import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: colors.white
  },
  selectionButton: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 16
  },
  default: {
    borderColor: colors.grey100
  },
  selected: {
    borderColor: colors.blue500,
    shadowColor: colors.blue500,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4
  },
  image: {
    width: 115,
    height: 115,
    borderRadius: 6,
    backgroundColor: colors.blue100
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 8
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.black
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.grey600
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: colors.grey700
  },
  retryButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.blue50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  retryButtonDisabled: {
    backgroundColor: colors.grey100,
    opacity: 0.7
  }
});
