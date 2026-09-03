import { StyleSheet } from 'react-native';

import { colors } from '@travel-gacha/ui';

export const styles = StyleSheet.create({
  container: {
    width: '48.2%',
    minHeight: 130,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.grey200,
    borderRadius: 16,
    backgroundColor: colors.white
  },
  containerLocked: {
    borderColor: colors.grey100,
    backgroundColor: colors.grey50
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryTag: {
    minHeight: 20,
    justifyContent: 'center',
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 5
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: '700'
  },
  categoryTagLocked: {
    borderColor: colors.grey200,
    backgroundColor: colors.grey50
  },
  categoryLabelLocked: {
    color: colors.grey400
  },
  regionItemTag: {
    borderColor: '#93d4aa',
    backgroundColor: '#edf8f1'
  },
  regionItemLabel: {
    color: '#287548'
  },
  travelCountTag: {
    borderColor: colors.blue400,
    backgroundColor: colors.blue50
  },
  travelCountLabel: {
    color: colors.blue700
  },
  regionExplorationTag: {
    borderColor: '#bda8e8',
    backgroundColor: '#f5f0ff'
  },
  regionExplorationLabel: {
    color: '#6f4ba8'
  },
  regionAchievementTag: {
    borderColor: '#f1c27d',
    backgroundColor: '#fff5e8'
  },
  regionAchievementLabel: {
    color: '#9a5b16'
  },
  missionDiaryTag: {
    borderColor: '#aab7ee',
    backgroundColor: '#eef1ff'
  },
  missionDiaryLabel: {
    color: '#4d5d9e'
  },
  foodCafeTag: {
    borderColor: '#f1aaa0',
    backgroundColor: '#fff0ed'
  },
  foodCafeLabel: {
    color: '#a44c42'
  },
  iconWrap: {
    width: 28,
    height: 28,
    marginTop: 9,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copy: {
    gap: 4
  },
  title: {
    color: colors.grey900,
    fontSize: 15,
    fontWeight: '800'
  },
  requirement: {
    color: colors.grey600,
    fontSize: 11,
    lineHeight: 16
  },
  textLocked: {
    color: colors.grey400
  }
});
