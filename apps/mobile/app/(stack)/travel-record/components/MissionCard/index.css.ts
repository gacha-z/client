import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  missionCard: {
    padding: 12,
    gap: 6
  },
  headerRow: {
    flexDirection: 'row',
    gap: 6
  },
  missionTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.grey900
  },
  missionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.grey600
  },
  setlogList: {
    marginTop: 4,
    gap: 6
  },
  setlogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  setlogMember: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.grey700
  },
  downloadButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.blue50
  },
  downloadLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue500
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: colors.grey400
  }
});
