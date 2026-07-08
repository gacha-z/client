import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  missionCard: {
    minHeight: 144,
    padding: 12,
    flexDirection: 'row',
    gap: 12
  },
  thumbnail: {
    width: 124,
    height: 124,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: colors.blue100
  },
  missionContent: {
    flex: 1,
    minWidth: 0
  },
  missionTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    color: colors.grey900
  },
  missionMeta: {
    marginTop: 6,
    gap: 3
  },
  rewardTags: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5
  }
});
