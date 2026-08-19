import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceGrey,
    borderWidth: 1,
    borderColor: colors.outlineGrey,
    borderRadius: 16,
    padding: 16,
    gap: 12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.grey800
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.graphite
  },
  statusLabel: {
    fontSize: 12,
    color: colors.warmGrey
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.blue500
  },
  segmentedTrack: {
    flexDirection: 'row',
    gap: 4,
    height: 8
  },
  segment: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.white
  },
  segmentFilled: {
    backgroundColor: colors.blue500
  },
  segmentGivenUp: {
    backgroundColor: '#ff5252'
  },
  memberRow: {
    flexDirection: 'row',
    gap: 12
  },
  memberItem: {
    alignItems: 'center',
    gap: 4
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey100
  },
  memberName: {
    fontSize: 10,
    color: colors.grey500
  },
  pickerBadge: {
    position: 'absolute',
    top: 26,
    backgroundColor: colors.blue500,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1
  },
  pickerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white
  }
});
