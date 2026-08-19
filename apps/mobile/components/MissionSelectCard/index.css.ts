import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: 246,
    height: 286,
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
  thumbnail: {
    width: '100%',
    height: 153
  },
  thumbnailPlaceholder: {
    backgroundColor: colors.grey100
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4
  },
  placeName: {
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
  address: {
    flex: 1,
    fontSize: 12,
    color: colors.slateGrey
  },
  rewardTag: {
    borderWidth: 1,
    borderColor: colors.indigo500,
    backgroundColor: colors.indigoTint,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.indigo500
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
