import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: 246,
    minHeight: 180,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: colors.white
  },
  default: {
    borderColor: colors.outlineGrey
  },
  active: {
    borderColor: colors.blue500,
    shadowColor: colors.blue500,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4
  },
  inProgress: {
    borderColor: colors.blue500
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6
  },
  typeTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.indigo500,
    backgroundColor: colors.indigoTint,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.indigo500
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.black
  },
  description: {
    fontSize: 12,
    color: colors.warmGrey
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  difficulty: {
    fontSize: 12,
    color: colors.slateGrey
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 120,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.slateGrey
  }
});
